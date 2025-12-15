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

# Acceder a la aplicación
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# Swagger: http://localhost:5000/swagger