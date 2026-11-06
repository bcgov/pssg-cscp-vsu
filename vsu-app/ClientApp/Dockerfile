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
FROM caddy:2.11.7-builder@sha256:c4cd20eaa0b69112fd5d4f721ffc9671687e1d5d0b155c8620cf7546dbef94c0 AS builder
RUN xcaddy build --with github.com/caddyserver/replace-response

# --- Runtime stage ---
FROM caddy:2.11.7-alpine@sha256:e70b164da81ef698b3ad19af799ea6086ce6d9e48ed4079eb9fe26f6fbf14ee5 AS final
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
