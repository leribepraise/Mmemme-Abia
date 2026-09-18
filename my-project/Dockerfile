FROM node:24-alpine@sha256:50c8e8ca1d27439048670df5883f32d57cf81cff6233222c893fd0d9884cbd81 AS build
WORKDIR /app
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false VITE_API_BASE_URL=/api/v1
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM caddy:2-alpine@sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648
WORKDIR /app
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist ./dist
RUN caddy fmt --overwrite /etc/caddy/Caddyfile \
    && addgroup -S -g 10001 app && adduser -S -u 10001 -G app app \
    && chown -R app:app /app /data /config
USER app
EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
