# clonar de repositorio

```bash
git clone https://github.com/sergiovallegarma/sso-system.git
cd sso-system
docker-compose -f docker-compose.prod.yml up -d
```

# Sistema SSO (Single Sign-On)

Sistema de autenticación y autorización desarrollado con:
- **Backend**: .NET 8 + Entity Framework + Identity
- **Frontend**: React + Vite
- **Base de datos**: SQL Server

## Credenciales por defecto
- **Usuario**: admin@sistema.com
- **Contraseña**: Admin123!

## Cómo ejecutar

### Opción 1: Con Docker Compose
```bash
# Descargar y ejecutar
docker-compose -f docker-compose.prod.yml up -d

### si desea personalizar la ip puede remplazar la ip de la variable API_URL que se encuentra en el archivo docker-compose.prod.yml
- API_URL=${API_URL:-http://localhost:5000/api}

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Swagger: http://localhost:5000/swagger

