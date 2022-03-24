namespace Eisenhower.Todo.Domain;

public interface ITodoListRepository : IDisposable, IAsyncDisposable
{
    Task<TodoList[]> LoadAsync(IEnumerable<TodoListId> ids, CancellationToken cancellationToken = default(CancellationToken));
    Task AddAsync(IEnumerable<TodoList> models, CancellationToken cancellationToken = default(CancellationToken));
    Task RemoveAsync(IEnumerable<TodoList> models, CancellationToken cancellationToken = default(CancellationToken));
    Task UpdateAsync(IEnumerable<TodoList> models, CancellationToken cancellationToken = default(CancellationToken));
    Task<Dictionary<TodoListId, bool>> ExistsAsync(IEnumerable<TodoListId> ids, CancellationToken cancellationToken = default(CancellationToken));
}