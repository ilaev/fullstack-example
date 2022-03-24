using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Eisenhower.Todo.Domain;
using Eisenhower.Todo.Infrastructure.EF;

namespace Eisenhower.Todo.Infrastructure.DI;

public static class EisenhowerTodoBuilderExtensionsInfrastructureEFCore 
{
    /// <summary>
    /// Adds all infrastructure services with ef core as the data access.
    /// </summary>
    /// <param name="builder">Builder</param>
    /// <returns>Builder</returns>
    public static IEisenhowerTodoBuilder AddInfrastructureEFCoreServices(this IEisenhowerTodoBuilder builder, DbOptions options) 
    {
        builder.Services.AddScoped((serviceProvider) => {
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var dbContextOptions = new EisenhowerTodoDbOptions(
                options.Host, 
                options.Port, 
                options.DatabaseName, 
                options.UserName,
                options.Password,
                options.DefaultSchema,
                options.Pooling,
                options.MinPoolSize,
                options.MaxPoolSize,
                options.ConnectionIdleLifeTime,
                options.ConnectionPruningInterval,
                options.ConnectionLifetime,
                options.Keepalive);
            return new EisenhowerTodoDbContext(loggerFactory, dbContextOptions);
        });
        builder.Services.AddScoped<IUnitOfWork, EfCoreUnitOfWork>();
        builder.Services.AddScoped<ITodoItemRepository, TodoItemRepository>();
        builder.Services.AddScoped<ITodoListRepository, TodoListRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();     
        
        return builder;
    }
}