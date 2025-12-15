#!/bin/bash

# Iniciar SQL Server en el background
/opt/mssql/bin/sqlservr &

# Esperar a que esté listo
sleep 30s

# Ejecutar script SQL
echo "Ejecutando script de inicialización..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -d master -i /docker-entrypoint-initdb.d/init.sql

# Mantener contenedor vivo
wait