namespace Eisenhower.Todo.Domain;
public class TodoItem
{
    public TodoItemId TodoItemId { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public TodoItem(
        TodoItemId id,
        DateTime? deletedAt
    ) {
        this.TodoItemId =  id;
        this.DeletedAt = deletedAt;
    }
}
