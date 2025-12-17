using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SSO.Application;
using SSO.Application.Common.Security;
using SSO.Infrastructure;
using SSO.Infrastructure.Persistence.Contexts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Mi SSO API", Version = "v1" });

    // Definir el esquema de seguridad (Botón Authorize)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(",")
                     ?? new string[] { "http://localhost:5173" }; // Valor por defecto

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins(allowedOrigins) // <--- USAR LA VARIABLE
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddAuthorization(options =>
{
    // Registramos una política por cada permiso del sistema.
    // El nombre de la política será IGUAL al valor del permiso (ej: "Permissions.Users.View")
    foreach (var permission in Permissions.GetAll())
    {
        options.AddPolicy(permission, policy => policy.RequireClaim("Permission", permission));
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication(); // <--- ¡IMPORTANTE!
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        // 1. Aplicar migraciones automáticamente
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();

        // 2. Sembrar datos
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<SSO.Infrastructure.Identity.ApplicationUser>>();

        await SSO.Infrastructure.Persistence.IdentityDataSeeder.SeedRolesAsync(roleManager);
        await SSO.Infrastructure.Persistence.IdentityDataSeeder.SeedPermissionsAsync(context);
        await SSO.Infrastructure.Persistence.IdentityDataSeeder.SeedDefaultAdminAsync(userManager);
        await SSO.Infrastructure.Persistence.IdentityDataSeeder.AssignAllPermissionsToAdminAsync(roleManager, context);

        Console.WriteLine("Base de datos migrada y datos sembrados exitosamente.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error durante la migración o siembra de datos");
        // No lanzar excepción para que la aplicación continúe
    }
}

app.Run();