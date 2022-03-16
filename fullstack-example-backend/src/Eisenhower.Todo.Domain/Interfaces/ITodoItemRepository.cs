namespace Eisenhower.Todo.Domain;

public interface ITodoItemRepository : IDisposable, IAsyncDisposable
{
    Task<TodoItem[]> LoadAsync(params TodoItemId[] ids);
    Task AddAsync(params TodoItem[] models); 
    Task RemoveAsync(params TodoItemId[] ids);
    Task UpdateAsync(params IEnumerable<TodoItem>[] models);
    Task<Dictionary<TodoItemId, bool>> ExistsAsync(params TodoItemId[] ids);

}