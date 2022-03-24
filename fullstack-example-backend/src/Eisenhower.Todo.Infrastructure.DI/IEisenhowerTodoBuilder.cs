using Microsoft.Extensions.DependencyInjection;

namespace Eisenhower.Todo.Infrastructure.DI;

/// <summary>
/// Eisenhower DI builder
/// </summary>
public interface IEisenhowerTodoBuilder
{
    IServiceCollection Services { get; }
}
