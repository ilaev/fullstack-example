# Migration Startup for EF Core for development environment

Migrations for Entity Framework Core will be done through this project.

## Create Migration

Create migrations. First adjust model, then use dotnet cli to create migration.

```
dotnet ef migrations add InitialCreate --context EisenhowerTodoDbContext --project Eisenhower.Todo.Infrastructure.EF.csproj --startup-project ../Eisenhower.Todo.Infrastructure.EF.MigrationStartup/Eisenhower.Todo.Infrastructure.EF.MigrationStartup.csproj

```

## Update Database 

```
dotnet ef database update --context EisenhowerTodoDbContext --project Eisenhower.Todo.Infrastructure.EF.csproj --startup-project ../Eisenhower.Todo.Infrastructure.EF.MigrationStartup/Eisenhower.Todo.Infrastructure.EF.MigrationStartup.csproj
```