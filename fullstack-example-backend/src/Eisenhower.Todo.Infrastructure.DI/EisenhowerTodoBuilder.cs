using Microsoft.Extensions.DependencyInjection;

namespace Eisenhower.Todo.Infrastructure.DI;

public class EisenhowerTodoBuilder : IEisenhowerTodoBuilder
{
    public EisenhowerTodoBuilder(IServiceCollection services) 
    {
        if (services == null)
            throw new ArgumentNullException(nameof(services));
        this.Services = services;
    }
    public IServiceCollection Services { get; }
}