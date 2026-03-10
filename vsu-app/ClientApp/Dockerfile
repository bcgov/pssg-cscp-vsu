# ##################################################################################################
#                                                                                                 #
#   VSU-UI: Angular Single Page Application (SPA) served by Caddy                                 #
#                                                                                                 #
#   LOCAL VERIFICATION (run from repo root):                                                      #
#   docker build -t vsu-ui:local -f vsu-app/ClientApp/Dockerfile ./vsu-app/ClientApp              #
#                                                                                                 #
#   ARCHITECTURE & BUILD OVERVIEW                                                                 #
#   --------------------------------------------------------------------------------------------  #
#   - Multi-stage Docker build: Node for Angular build, Caddy for serving SPA                     #
#   - This image contains only the Angular SPA with Caddy web server                              #
#   - Runtime container runs as non-root user (appuser) for security                              #
#   - All files in /site are owned by appuser:appgroup                                            #
#   - Build metadata available via OCI image labels (use docker inspect)                          #
#   - Follows ERA (EMCR-ESS-PORTAL) standard UI Dockerfile pattern                               #
#                                                                                                 #
# ##################################################################################################

# ======================
# Angular Build Stage
# ======================
FROM node:22-alpine AS ng-builder

# Install Angular CLI globally
RUN npm install -g @angular/cli

WORKDIR /src

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (optimized for caching)
RUN npm install --no-audit --no-fund

# Copy source code after dependencies (better caching)
COPY . .

RUN npm run build -- --configuration production

# ======================
# Caddy Builder Stage
# ======================
FROM caddy:2-builder AS builder

RUN xcaddy build --with github.com/caddyserver/replace-response
# This command builds a custom Caddy binary with the 'replace-response' plugin included.
# The plugin allows to modify HTTP responses (e.g., replace text/content) via Caddy config.

# ======================
# Runtime Stage
# ======================
FROM caddy:2-alpine AS final

# Update packages for security
RUN apk update && apk upgrade --no-cache

# Create non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

ENV API_URL=

RUN chmod +rw /config/caddy
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/browser/ /site

# Set ownership and switch to non-root user
RUN chown -R appuser:appgroup /site
USER appuser

EXPOSE 2015 2016
