namespace Eisenhower.Todo.Domain;

public interface ITodoItemRepository : IDisposable, IAsyncDisposable
{
    Task<TodoItem[]> LoadAsync(IEnumerable<TodoItemId> ids, CancellationToken cancellationToken = default(CancellationToken));
    Task AddAsync(IEnumerable<TodoItem> models, CancellationToken cancellationToken = default(CancellationToken)); 
    Task RemoveAsync(IEnumerable<TodoItem> models, CancellationToken cancellationToken = default(CancellationToken));
    Task UpdateAsync(IEnumerable<TodoItem> models, CancellationToken cancellationToken = default(CancellationToken));
    Task<Dictionary<TodoItemId, bool>> ExistsAsync(IEnumerable<TodoItemId> ids, CancellationToken cancellationToken = default(CancellationToken));

}