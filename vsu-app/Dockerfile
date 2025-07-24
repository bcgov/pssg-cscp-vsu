# =====================================================================================
#  How to build this image locally:
#
#    docker build \
#      -t vsu-app:test \
#      -f vsu-app/Dockerfile \
#      --build-arg BUILD_IMAGE_NAME=vsu-app \
#      --build-arg BUILD_VERSION=local-dev \
#      .
#
#  (Run this command from the pssg-cscp-vsu repo root)
# =====================================================================================
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

# Install Node.js (required to install Angular)
RUN apt-get update -yq &&  \
  apt-get upgrade -yq &&   \
  apt-get install -yq curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -yq nodejs=12.22.12-deb-1nodesource1

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