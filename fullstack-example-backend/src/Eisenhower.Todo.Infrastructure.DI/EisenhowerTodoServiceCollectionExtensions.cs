using Microsoft.Extensions.DependencyInjection;

namespace Eisenhower.Todo.Infrastructure.DI;

/// <summary>
/// Dependency injection methods for adding working Eisenhower Todo Application.
/// </summary>
public static class EisenhowerTodoServiceCollectionExtensions
{
    /// <summary>
    /// Creates Dependency injection builder
    /// </summary>
    /// <param name="services">Service collection</param>
    /// <returns>IEisenhowerTodoBuilder</returns>
    public static IEisenhowerTodoBuilder AddEisenhowerTodoBuilder(this IServiceCollection services) 
    {
        return new EisenhowerTodoBuilder(services);
    }

    /// <summary>
    /// Adds Eisenhower Todo App 
    /// </summary>
    /// <param name"services">Service collection</param>
    /// <returns>Builder</returns>
    public static IEisenhowerTodoBuilder AddEisenhowerTodo(this IServiceCollection services, EisenhowerTodoAppDIOptions options) 
    {
        return services
        .AddEisenhowerTodoBuilder()
        .AddEisenhowerTodoCoreServices()
        .AddInfrastructureEFCoreServices(options.DbOptions);
    }

}