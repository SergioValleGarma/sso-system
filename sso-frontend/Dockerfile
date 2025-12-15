# --- ETAPA 1: Construcción (Build) ---
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiamos primero los package.json para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la aplicación para producción (crea la carpeta /dist)
RUN npm run build

# --- ETAPA 2: Servidor Web (Nginx) ---
FROM nginx:alpine as production-stage

# Copiamos los archivos compilados de la etapa anterior a la carpeta de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]
