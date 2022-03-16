# Migration Startup for EF Core

Migrations for EF Core will be done through this project.

## Create Migration

Create migrations. First adjust model, then use dotnet cli to create migration.

```
dotnet ef migrations add InitialCreate --context EisenhowerTodoDbContext --project Eisenhower.Todo.Infrastructure.EF.csproj --startup-project ../Eisenhower.Todo.Infrastructure.EF.MigrationStartup/Eisenhower.Todo.Infrastructure.EF.MigrationStartup.csproj

```

## Update Database 

```
dotnet ef database update --context EisenhowerTodoDbContext --project Eisenhower.Todo.Infrastructure.EF.csproj --startup-project ../Eisenhower.Todo.Infrastructure.EF.MigrationStartup/Eisenhower.Todo.Infrastructure.EF.MigrationStartup.csproj
```


// TODO: Read db configuration from appSettings/environment variables to avoid hard-coded values. May not need it at the moment for this project. Need this 100% in API