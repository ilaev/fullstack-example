namespace Eisenhower.Todo.Domain;

public class TodoList 
{
    public TodoListId TodoListId { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public TodoList(
        TodoListId id,
        DateTime? deletedAt
    ) {
        this.TodoListId = id;
        this.DeletedAt = deletedAt;
    }
}