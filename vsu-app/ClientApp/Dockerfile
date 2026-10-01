# ##################################################################################################
#   VSU-UI · Angular SPA built by node, served by a custom Caddy (replace-response plugin) · non-root
#
#   Build (from repo root, ALWAYS — the context is the repo root so every COPY starts there):
#     docker build -t vsu-ui:local -f vsu-app/ClientApp/Dockerfile .
# ##################################################################################################

# --- Angular build stage ---
FROM node:22.23.3-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS ng-builder
WORKDIR /src
# dependency lists FIRST — the npm ci layer stays cached until they change
COPY vsu-app/ClientApp/package*.json ./
RUN npm ci
COPY vsu-app/ClientApp/ ./
RUN npm run build -- --configuration production

# --- Caddy builder — custom binary with the replace-response plugin ---
FROM caddy:2.11.4-builder@sha256:369218c81ca6d6af249981221b3a5c764d886dd5b058f51d144066de13f2418d AS builder
RUN xcaddy build --with github.com/caddyserver/replace-response

# --- Runtime stage ---
FROM caddy:2.11.4-alpine@sha256:6aeddd44c3078b0f9a35206472a11420648a79c184603ef95957d0a20044cb2b AS final
RUN apk update && apk upgrade --no-cache
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
ENV API_URL=
RUN chmod +rw /config/caddy
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
# Strip the file capability BuildKit preserves on the copied binary. Caddy binds 2015/2016 (non-privileged),
# so cap_net_bind_service is unneeded, and its presence blocks exec under allowPrivilegeEscalation:false (no_new_privs).
RUN apk add --no-cache libcap && setcap -r /usr/bin/caddy && getcap /usr/bin/caddy || true
COPY vsu-app/ClientApp/Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/browser/ /site
RUN chown -R appuser:appgroup /site
USER appuser
EXPOSE 2015 2016
