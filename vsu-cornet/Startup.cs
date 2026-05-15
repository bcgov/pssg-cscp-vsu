using Gov.Cscp.Victims.Public.Services;
using Gov.Cscp.Victims.Public.Shared.Database;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Gov.Cscp.Victims.Public
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<TokenHandler>();
            services.AddTransient<CornetAuthHandler>();

            // Configure Dynamics token provider options
            services.Configure<DynamicsTokenProviderOptions>(Configuration.GetSection("Dynamics"));

            // Add memory cache for token caching
            services.AddMemoryCache();
            services.AddTransient<ICache, MemoryCache>();

            // Add HTTP client factory for token providers
            services.AddHttpClient("oauth_token");
            services.AddHttpClient("entraid_token");

            // Register both token providers
            services.AddTransient<ADFSTokenProvider>();
            services.AddTransient<EntraIdTokenProvider>();

            // Register the appropriate token provider based on configuration
            services.AddTransient<ITokenProvider>(sp =>
            {
                var options =
                    sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<DynamicsTokenProviderOptions>>();

                return options.Value.AuthenticationType switch
                {
                    DynamicsAuthenticationType.OnPremise => sp.GetRequiredService<ADFSTokenProvider>(),
                    DynamicsAuthenticationType.Cloud => sp.GetRequiredService<EntraIdTokenProvider>(),
                    _ => throw new System.InvalidOperationException(
                        $"Unknown authentication type: {options.Value.AuthenticationType}"
                    ),
                };
            });

            services
                .AddHttpClient<IDynamicsResultService, DynamicsResultService>()
                .AddHttpMessageHandler<TokenHandler>();
            services
                .AddHttpClient<ICornetResultService, CornetResultService>()
                .AddHttpMessageHandler<CornetAuthHandler>();
            services.AddMvc(opts =>
            {
                opts.EnableEndpointRouting = false;
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "default", template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
