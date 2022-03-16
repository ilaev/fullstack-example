using Microsoft.Extensions.DependencyInjection;
using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.Infrastructure.DI;

public class FakeUnitOfWork : IUnitOfWork
{
    public Task CommitAsync()
    {
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        
    }

    public ValueTask DisposeAsync()
    {
        return ValueTask.CompletedTask;
    }
}

class FakeItemRepo : ITodoItemRepository
{
    public Task AddAsync(params TodoItem[] models)
    {
        throw new NotImplementedException();
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }

    public ValueTask DisposeAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Dictionary<TodoItemId, bool>> ExistsAsync(params TodoItemId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task<TodoItem[]> LoadAsync(params TodoItemId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task RemoveAsync(params TodoItemId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(params IEnumerable<TodoItem>[] models)
    {
        throw new NotImplementedException();
    }
}

class FakeListRepo : ITodoListRepository
{
    public Task AddAsync(params TodoList[] models)
    {
        throw new NotImplementedException();
    }

    public Task<Dictionary<TodoListId, bool>> ExistsAsync(params TodoListId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task<TodoList[]> LoadAsync(params TodoListId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task RemoveAsync(params TodoListId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(params IEnumerable<TodoList>[] models)
    {
        throw new NotImplementedException();
    }
}

class FakeUserRepo : IUserRepository
{
    public Task AddAsync(params User[] models)
    {
        throw new NotImplementedException();
    }

    public Task<Dictionary<UserId, bool>> ExistsAsync(params UserId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task<User[]> LoadAsync(params UserId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task RemoveAsync(params UserId[] ids)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(params IEnumerable<User>[] models)
    {
        throw new NotImplementedException();
    }
}

public static class EisenhowerTodoBuilderExtensionsInfrastructureEFCore 
{
    /// <summary>
    /// Adds all infrastructure services with ef core as the data access.
    /// </summary>
    /// <param name="builder">Builder</param>
    /// <returns>Builder</returns>
    public static IEisenhowerTodoBuilder AddInfrastructureEFCoreServices(this IEisenhowerTodoBuilder builder) 
    {
        builder.Services.AddScoped<IUnitOfWork, FakeUnitOfWork>();
        builder.Services.AddScoped<ITodoItemRepository, FakeItemRepo>();
        builder.Services.AddScoped<ITodoListRepository, FakeListRepo>();
        builder.Services.AddScoped<IUserRepository, FakeUserRepo>();     

        return builder;
    }
}