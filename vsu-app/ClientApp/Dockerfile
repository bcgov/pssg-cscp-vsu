# ##################################################################################################
#   VSU-UI · Angular SPA built by node, served by a custom Caddy (replace-response plugin) · non-root
#
#   Build (from repo root, ALWAYS — the context is the repo root so every COPY starts there):
#     docker build -t vsu-ui:local -f vsu-app/ClientApp/Dockerfile .
# ##################################################################################################

# --- Angular build stage ---
FROM node:22.23.1-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS ng-builder
WORKDIR /src
# dependency lists FIRST — the npm ci layer stays cached until they change
COPY vsu-app/ClientApp/package*.json ./
RUN npm ci
COPY vsu-app/ClientApp/ ./
RUN npm run build -- --configuration production

# --- Caddy builder — custom binary with the replace-response plugin ---
FROM caddy:2.11.4-builder@sha256:198d47eaee306d4d0c38a9960c89ff2c959aa29ad51d3e2dafa3e93ac961782a AS builder
RUN xcaddy build --with github.com/caddyserver/replace-response

# --- Runtime stage ---
FROM caddy:2.11.4-alpine@sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648 AS final
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
