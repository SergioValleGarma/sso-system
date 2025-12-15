# 1. Imagen base para ejecutar (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# 2. Imagen SDK para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copiar archivos de proyecto (respetando la estructura de carpetas)
COPY ["SSO.WebApi/SSO.WebApi.csproj", "SSO.WebApi/"]
COPY ["SSO.Application/SSO.Application.csproj", "SSO.Application/"]
COPY ["SSO.Infrastructure/SSO.Infrastructure.csproj", "SSO.Infrastructure/"]
COPY ["SSO.Domain/SSO.Domain.csproj", "SSO.Domain/"]

# Restaurar dependencias
RUN dotnet restore "SSO.WebApi/SSO.WebApi.csproj"

# Copiar todo el código fuente
COPY . .
WORKDIR "/src/SSO.WebApi"
RUN dotnet build "SSO.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 3. Publicar
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "SSO.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 4. Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SSO.WebApi.dll"]
