# Backend

Remember: Clean Architecture. Layered Circle. No name in outer circle can be mentioned by an inner circle.
Obviously overengineered for the sake of implementing this layered architecture.
Small projects like this or prototypes, which will not grow, don't necesarry need all these layers and the mappings of the data between these layers. The overhead to make feature changes would be too large for too little gain. 

# Install

- .NET 6 SDK
- Visual Studio Code
- Postgres 14

# Build

Use dotnet to build any of the projects.

```
dotnet build src/Eisenhower.Todo.Api/Eisenhower.Todo.Api.csproj
```
# Run

Make sure postgresql service is running.
Run the API either with Visual Studio Code or this command:

```
dotnet run --project src/Eisenhower.Todo.Api/Eisenhower.Todo.Api.csproj
```

TODO: create install, build and run scripts.

## Project explanation
### src/Eisenhower.Todo.Domain

Domain objects and abstractions. Should not have any dependency.  

### src/Eisenhower.Todo.ApplicationCore (Application use cases)

The business core of our application. Can have the domain as the dependency

### src/Eisenhower.Todo.Infrastructure.DI

Includes the glue code for the dependency injection through Microsoft interfaces. May need CrossConcern project, but let's see for now.

### src/Eisenhower.Todo.Infrastructure.EF

Infrastructure for Entity Framework Core. Current data access layer. 

### src/Eisenhower.Todo.Infrastructure.EF.MigrationStartup

Used only to create and manage Entity Framework Core migrations since EF Core requires a special tooling dependency which I don't want to include anywhere else. 

### src/Eisenhower.Todo.Api

The API with it's own DTOs. The Angular frontend will talk to this API. 

### tests/

Tests to all projects belong into this folder. Any kind of tests. Integration tests should include the keyword "integration" in the test projects name 

