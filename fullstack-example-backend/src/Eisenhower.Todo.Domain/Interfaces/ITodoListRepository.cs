namespace Eisenhower.Todo.Domain;

public interface ITodoListRepository
{
    Task<TodoList[]> LoadAsync(params TodoListId[] ids);
    Task AddAsync(params TodoList[] models);
    Task RemoveAsync(params TodoListId[] ids);
    Task UpdateAsync(params IEnumerable<TodoList>[] models);
    Task<Dictionary<TodoListId, bool>> ExistsAsync(params TodoListId[] ids);
}