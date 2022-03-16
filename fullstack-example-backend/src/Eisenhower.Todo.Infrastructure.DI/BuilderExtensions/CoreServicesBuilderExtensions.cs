using Microsoft.Extensions.DependencyInjection;
using Eisenhower.Todo.ApplicationCore.Service;

namespace Eisenhower.Todo.Infrastructure.DI;

public static class EisenhowerTodoBuilderExtensionsCore 
{
    /// <summary>
    /// Adds all core services to DI.
    /// </summary>
    /// <param name="builder">DI builder</param>
    /// <returns>Builder</returns>
    public static IEisenhowerTodoBuilder AddEisenhowerTodoCoreServices(this IEisenhowerTodoBuilder builder)
    {
        builder.Services.AddScoped<TodoItemApplicationService>();
        builder.Services.AddScoped<ITodoItemReadApplicationService>(serviceProvider => serviceProvider.GetRequiredService<TodoItemApplicationService>());
        builder.Services.AddScoped<ITodoItemWriteApplicationService>(serviceProvider => serviceProvider.GetRequiredService<TodoItemApplicationService>());
        
        builder.Services.AddScoped<TodoListApplicationService>();
        builder.Services.AddScoped<ITodoListReadApplicationService>(servicesProvider => servicesProvider.GetRequiredService<TodoListApplicationService>());
        builder.Services.AddScoped<ITodoListWriteApplicationService>(servicesProvider => servicesProvider.GetRequiredService<TodoListApplicationService>());

        builder.Services.AddScoped<UserApplicationService>();
        builder.Services.AddScoped<IUserReadApplicationService>(serviceProvider => serviceProvider.GetRequiredService<UserApplicationService>());
        builder.Services.AddScoped<IUserWriteApplicationService>(serviceProvider => serviceProvider.GetRequiredService<UserApplicationService>());
        
        return builder;
    }
}