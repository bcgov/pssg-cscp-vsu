
##################################################################################################
#                                                                                                 #
#   VSU-SPA: ASP.NET Core + Angular Single Page Application (SPA)                                 #
#                                                                                                 #
#   LOCAL BUILD & RUN INSTRUCTIONS                                                                #
#   --------------------------------------------------------------------------------------------  #
#   1. Build the Docker image:                                                                    #
#        docker build \                                                                           #
#          -t vsu-spa:local \                                                                     #
#          -f vsu-app/Dockerfile \                                                                #
#          --build-arg BUILD_IMAGE_NAME=vsu-spa \                                                 #
#          --build-arg BUILD_VERSION=local-dev \                                                  #
#          .                                                                                      #
#                                                                                                 #
#   2. Run the container:                                                                         #
#        docker run --rm -it -p 8080:8080 vsu-spa:local                                           #
#                                                                                                 #
#   3. Inspect the running container (in another terminal):                                       #
#        docker exec -it <container_id_or_name> bash                                              #
#        whoami            # should print 'appuser'                                               #
#        touch /app/testfile  # should succeed                                                    #
#        printenv BUILD_IMAGE_NAME                                                                #
#        printenv BUILD_VERSION                                                                   #
#                                                                                                 #
#   ARCHITECTURE & BUILD OVERVIEW                                                                 #
#   --------------------------------------------------------------------------------------------  #
#   - Multi-stage Docker build for .NET backend (vsu-app)                                         #
#   - Angular frontend (vsu-app/ClientApp) is built via MSBuild targets during `dotnet publish`   #
#     (not a separate Docker stage), using Microsoft.AspNetCore.SpaServices.Extensions            #
#   - MSBuild (with SpaServices.Extensions) runs `npm install` and `npm run build -- --prod`      #
#     in ClientApp as part of publish                                                             #
#   - The Angular build output is included in the published output (wwwroot)                      #
#   - .NET app serves the Angular SPA as static files                                             #
#   - Runtime container runs as non-root user (appuser) for security                              #
#   - All files in /app are owned by appuser:appgroup                                             #
#   - Build metadata (BUILD_IMAGE_NAME, BUILD_VERSION) available as env vars                      #
#                                                                                                 #
#   TECHNOLOGIES                                                                                  #
#   --------------------------------------------------------------------------------------------  #
#   - Backend: ASP.NET Core (.NET 8)                                                              #
#   - Frontend: Angular (in vsu-app/ClientApp)                                                    #
#   - Build: Docker builds both, .NET app serves Angular SPA                                      #
#                                                                                                 #
##################################################################################################

# --- Build Arguments (Global) ---
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

# --- Runtime Base Image ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
WORKDIR /app


# --- Build Stage (SDK) ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

COPY . .


# Install Node.js (required to install Angular) and build tools for node-sass
RUN apt-get update -yq && \
  apt-get upgrade -yq && \
  apt-get install -yq curl python3 build-essential && \
  ln -sf /usr/bin/python3 /usr/bin/python
# Updated to Node.js 22.x for better compatibility and security
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -yq nodejs

# Restore as distinct layers
RUN dotnet restore "./vsu-app/vsu-app.csproj"
RUN dotnet build "vsu-app/vsu-app.csproj" -c Release -o /app/build


# --- Publish Stage ---
FROM build AS publish
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION
COPY . .

# Build and publish a release
RUN dotnet publish "vsu-app/vsu-app.csproj" -c Release -o /app/publish


# --- Final Runtime Image ---
FROM base AS final
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

# Update all system packages for latest security patches FIRST.
# This ensures OS-level vulnerabilities are fixed.
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Debug/Fail Fast: See if args are really set!
RUN echo "BUILD_IMAGE_NAME='$BUILD_IMAGE_NAME'" && if [ -z "$BUILD_IMAGE_NAME" ]; then echo "BUILD_IMAGE_NAME is empty!"; exit 1; fi
RUN echo "BUILD_VERSION='$BUILD_VERSION'" && if [ -z "$BUILD_VERSION" ]; then echo "BUILD_VERSION is empty!"; exit 1; fi

# 1. Create non-root user and group for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# 2. Copy published app from build stage as root
COPY --from=publish /app/publish ./

# 3. Set ownership of all app files to appuser:appgroup (key for security!)
RUN chown -R appuser:appgroup /app

# 4. Accept build-time arguments and set environment variables
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}

# 5. Switch to non-root user for runtime
USER appuser

# --- Expose and Run ---
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ENTRYPOINT ["dotnet", "vsu-app.dll"]