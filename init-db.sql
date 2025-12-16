-- init-db.sql
USE master;
GO

-- Crear la base de datos si no existe
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'DBSSO')
BEGIN
    CREATE DATABASE DBSSO;
    PRINT 'Base de datos DBSSO creada.';
END
ELSE
BEGIN
    PRINT 'Base de datos DBSSO ya existe.';
END
GO

-- Cambiar a la base de datos DBSSO
USE DBSSO;
GO

-- Crear el usuario user_dbsso si no existe
IF NOT EXISTS(SELECT * FROM sys.database_principals WHERE name = 'user_dbsso')
BEGIN
    -- Crear login primero en master
    USE master;
    GO
    
    IF NOT EXISTS(SELECT * FROM sys.sql_logins WHERE name = 'user_dbsso')
    BEGIN
        CREATE LOGIN user_dbsso WITH PASSWORD = 'MwDlw@C849uRsR#hg', CHECK_POLICY = OFF;
        PRINT 'Login user_dbsso creado.';
    END
    
    USE DBSSO;
    GO
    
    CREATE USER user_dbsso FOR LOGIN user_dbsso;
    
    -- Otorgar permisos necesarios
    ALTER ROLE db_owner ADD MEMBER user_dbsso;
    
    PRINT 'Usuario user_dbsso creado y asignado como db_owner.';
END
ELSE
BEGIN
    PRINT 'El usuario user_dbsso ya existe.';
END
GO