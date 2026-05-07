#nullable enable
using System;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text.Json;
using Database.Extensions;
using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Services.HealthChecks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using NWebsec.AspNetCore.Mvc;
using NWebsec.AspNetCore.Mvc.Csp;
using Serilog;
using Serilog.Enrichers.Span;
using Serilog.Exceptions;

namespace Gov.Cscp.Victims.Public
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configuration
            builder
                .Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile(
                    $"appsettings.{builder.Environment.EnvironmentName}.json",
                    optional: true,
                    reloadOnChange: true
                )
                .AddEnvironmentVariables();

            // Logging
            builder
                .Logging.AddSimpleConsole(opts =>
                {
                    opts.IncludeScopes = true;
                    opts.TimestampFormat = "[yyyy-MM-dd HH:mm:ss] ";
                })
                .SetMinimumLevel(LogLevel.Debug)
                .AddDebug()
                .AddEventSourceLogger();

            ConfigureServices(builder.Services, builder.Configuration);

            var app = builder.Build();

            ConfigurePipeline(app, builder.Configuration, app.Environment);

            app.Run();
        }

        private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<TokenHandler>();

            services.AddHttpClient<ICOASTAuthService, COASTAuthService>();
            services
                .AddHttpClient<IDynamicsResultService, DynamicsResultService>()
                .AddHttpMessageHandler<TokenHandler>();

            // Add Dataverse connection
            services.AddDatabase(configuration);

            // Add a memory cache
            services.AddMemoryCache();

            services.AddRouting(options => options.LowercaseUrls = true);

            // for security reasons, the following headers are set.
            services
                .AddMvc(opts =>
                {
                    // default deny
                    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                    opts.Filters.Add(new AuthorizeFilter(policy));

                    opts.Filters.Add(typeof(NoCacheHttpHeadersAttribute));
                    opts.Filters.Add(new XRobotsTagAttribute() { NoIndex = true, NoFollow = true });
                    opts.Filters.Add(typeof(XContentTypeOptionsAttribute));
                    opts.Filters.Add(typeof(XDownloadOptionsAttribute));
                    opts.Filters.Add(typeof(XFrameOptionsAttribute));
                    opts.Filters.Add(typeof(XXssProtectionAttribute));
                    //CSPReportOnly
                    opts.Filters.Add(typeof(CspReportOnlyAttribute));
                    opts.Filters.Add(new CspScriptSrcReportOnlyAttribute { None = true });
                    // Allow anonymous access - authentication not implemented yet
                    opts.Filters.Add(new AllowAnonymousFilter());
                })
                .AddNewtonsoftJson(opts =>
                {
                    opts.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
                    opts.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
                    opts.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;

                    // ReferenceLoopHandling is set to Ignore to prevent JSON parser issues with the user / roles model.
                    opts.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // allow for large files to be uploaded
            services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 1073741824; // 1 GB
            });

            // Health checks
            services
                .AddHealthChecks()
                .AddCheck<ApiSelfHealthCheck>(
                    "API",
                    failureStatus: HealthStatus.Degraded,
                    tags: new[] { "self", "process" }
                )
                .AddCheck<DataverseHealthCheck>(
                    "Dataverse",
                    failureStatus: HealthStatus.Unhealthy,
                    tags: new[] { "dataverse", "dynamics", "ready" }
                );

            services.AddSession();

            services.AddSerilog();

            // Add Swagger services
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(
                    "v1",
                    new Microsoft.OpenApi.OpenApiInfo
                    {
                        Title = "VSU API",
                        Version = "v1",
                        Description = "API for the Victim Services Unit Application (VSU) application",
                    }
                );
            });
        }

        private static void ConfigurePipeline(WebApplication app, IConfiguration configuration, IWebHostEnvironment env)
        {
            ConfigureLogging(env, configuration);

            string? pathBase = configuration["BASE_PATH"];

            if (!string.IsNullOrEmpty(pathBase))
            {
                app.UsePathBase(pathBase);
            }
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseSerilogRequestLogging(options =>
            {
                // Reduce log level for specific endpoints
                options.GetLevel = (httpContext, elapsed, ex) =>
                {
                    if (ex != null)
                        return Serilog.Events.LogEventLevel.Error;

                    var path = httpContext.Request.Path.ToString();

                    if (path.StartsWith("/hc", StringComparison.OrdinalIgnoreCase))
                        return httpContext.Response.StatusCode >= 500
                            ? Serilog.Events.LogEventLevel.Error
                            : Serilog.Events.LogEventLevel.Verbose;

                    if (path.StartsWith("/api/lookup", StringComparison.OrdinalIgnoreCase))
                        return Serilog.Events.LogEventLevel.Verbose;

                    // log warnings for requests that take longer than 1 second
                    return elapsed > 1000
                        ? Serilog.Events.LogEventLevel.Warning
                        : Serilog.Events.LogEventLevel.Information;
                };

                options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                {
                    diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                    diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                    diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
                };
            });

            // Health check – returns JSON with API + Dataverse status.
            // Overall status (and HTTP status code) is driven solely by the API self-check so that
            // a Dataverse outage does not cause a pod crash-restart loop.
            app.MapHealthChecks(
                "/hc",
                new HealthCheckOptions
                {
                    // Allow the endpoint to be reached even when the aggregate status is Unhealthy.
                    ResultStatusCodes =
                    {
                        [HealthStatus.Healthy] = 200,
                        [HealthStatus.Degraded] = 200,
                        [HealthStatus.Unhealthy] = 200,
                    },
                    ResponseWriter = async (context, report) =>
                    {
                        // Determine overall status from the API self-check only.
                        // Dataverse failures are surfaced in the per-check details but do not
                        // flip the overall status to Unhealthy (which would restart the pod).
                        var overallStatus = report.Entries.TryGetValue("API", out var apiEntry)
                            ? apiEntry.Status
                            : report.Status;

                        context.Response.StatusCode = overallStatus == HealthStatus.Unhealthy ? 503 : 200;
                        context.Response.ContentType = "application/json";

                        var result = JsonSerializer.Serialize(
                            new
                            {
                                status = overallStatus.ToString(),
                                checks = report.Entries.Select(e => new
                                {
                                    name = e.Key,
                                    status = e.Value.Status.ToString(),
                                    description = e.Value.Description,
                                }),
                            },
                            new JsonSerializerOptions { WriteIndented = true }
                        );

                        await context.Response.WriteAsync(result);
                    },
                }
            );

            app.Use(
                async (ctx, next) =>
                {
                    ctx.Response.Headers.Append(
                        "Strict-Transport-Security",
                        "max-age=31536000; includeSubDomains; preload"
                    );
                    await next();
                }
            );

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opts => opts.NoReferrer());
            app.UseXXssProtection(options => options.EnabledWithBlockMode());
            app.UseXfo(options => options.Deny());

            // Define Content Security Policy when not running in development
            if (!env.IsDevelopment())
            {
                // Content-Security-Policy header
                app.UseCsp(opts =>
                {
                    opts.BlockAllMixedContent()
                        .StyleSources(s =>
                            s.Self()
                                .UnsafeInline()
                                .CustomSources(
                                    "https://use.fontawesome.com",
                                    "https://stackpath.bootstrapcdn.com",
                                    "https://fonts.googleapis.com"
                                )
                        )
                        .FontSources(s =>
                            s.Self().CustomSources("https://use.fontawesome.com", "https://fonts.gstatic.com")
                        )
                        .FormActions(s => s.Self())
                        .FrameAncestors(s => s.Self())
                        .ImageSources(s => s.Self().CustomSources("data:"))
                        .DefaultSources(s => s.Self())
                        .ObjectSources(s => s.Self().CustomSources("data:"))
                        .FrameSources(s => s.Self().CustomSources("data:"))
                        .ConnectSources(s =>
                            s.Self().CustomSources("https://use.fontawesome.com", "https://stackpath.bootstrapcdn.com")
                        )
                        .ScriptSources(s =>
                            s.Self()
                                .UnsafeInline()
                                .UnsafeEval()
                                .CustomSources(
                                    "https://apis.google.com",
                                    "https://maxcdn.bootstrapcdn.com",
                                    "https://cdnjs.cloudflare.com",
                                    "https://code.jquery.com",
                                    "https://stackpath.bootstrapcdn.com",
                                    "https://fonts.googleapis.com"
                                )
                        );
                });
            }

            StaticFileOptions staticFileOptions = new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                        "no-cache, no-store, must-revalidate, private";
                    ctx.Context.Response.Headers[HeaderNames.Pragma] = "no-cache";
                    ctx.Context.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
                    ctx.Context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
                    ctx.Context.Response.Headers["X-Content-Type-Options"] = "nosniff";
                },
            };

            app.UseStaticFiles(staticFileOptions);
            app.UseSpaStaticFiles(staticFileOptions);

            app.UseNoCacheHttpHeaders();

            app.UseSession();

            app.UseCookiePolicy(
                new CookiePolicyOptions
                {
                    HttpOnly = HttpOnlyPolicy.Always,
                    Secure = CookieSecurePolicy.Always,
                    MinimumSameSitePolicy = Microsoft.AspNetCore.Http.SameSiteMode.None,
                }
            );

            app.UseHttpsRedirection();
            app.UseRouting();
            app.MapControllers();

            // enable swagger only in development
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "VSU API V1");
                });
            }
        }

        private static void ConfigureLogging(IWebHostEnvironment env, IConfiguration configuration)
        {
            var loggerConfiguration = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .Enrich.WithExceptionDetails()
                .Enrich.WithMachineName()
                .Enrich.WithProperty("app", "VSU")
                .Enrich.WithProperty("environment", env.EnvironmentName)
                .Enrich.WithEnvironmentUserName()
                .Enrich.WithCorrelationId()
                .Enrich.WithSpan()
                .Enrich.WithProperty(
                    "version",
                    Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "Unknown"
                )
                .Enrich.WithProperty("UTC_Timestamp", DateTime.UtcNow.ToString("o"));

            // Set minimum level based on environment
            if (env.IsDevelopment())
            {
                loggerConfiguration.MinimumLevel.Debug();
            }
            else
            {
                loggerConfiguration.MinimumLevel.Information();
            }

            // Override for specific namespaces
            loggerConfiguration
                .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
                .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning);

            loggerConfiguration.WriteTo.Console();

            var splunkCollectorUrl = configuration["SPLUNK_COLLECTOR_URL"];
            var splunkToken = configuration["SPLUNK_TOKEN"];

            if (!string.IsNullOrEmpty(splunkCollectorUrl) && !string.IsNullOrEmpty(splunkToken))
            {
                // Use proper certificate validation or provide custom validator
                HttpClientHandler? handler = null;

                if (env.IsDevelopment())
                {
                    handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback =
                            HttpClientHandler.DangerousAcceptAnyServerCertificateValidator,
                    };
                }

                loggerConfiguration.WriteTo.EventCollector(
                    splunkHost: splunkCollectorUrl,
                    eventCollectorToken: splunkToken,
                    sourceType: "coast:vsu:api",
                    restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information,
                    messageHandler: handler,
                    batchSizeLimit: 100,
                    batchIntervalInSeconds: 2
                );
            }

            Log.Logger = loggerConfiguration.CreateLogger();

            Serilog.Debugging.SelfLog.Enable(msg =>
            {
                Console.Error.WriteLine($"Serilog Error: {msg}");
            });

            Log.Logger.Information("VSU API Started");
        }
    }
}
