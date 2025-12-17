# --- ETAPA 1: Construcción ---
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ETAPA 2: Servidor Web ---
FROM nginx:alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPIAR EL SCRIPT DE CONFIGURACIÓN
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

# Usamos nuestro script como comando de inicio
CMD ["/bin/sh", "/docker-entrypoint.d/env.sh"]
