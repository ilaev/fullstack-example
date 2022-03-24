namespace Eisenhower.Todo.Domain;

// TODO: implement IEquatable
public class TodoList 
{
    public static Guid DefaultListGuid = new Guid("00000000-0000-0000-0000-111111000000");
    public TodoListId TodoListId { get; private set; }    
    public UserId UserId { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string Color { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ModifiedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }
    public IEnumerable<TodoItemId> TodoItemIds { get; private set; }

    public TodoList(
        TodoListId id,
        UserId userId,
        string name,
        string description,
        string color,
        DateTime createdAt,
        DateTime modifiedAt,
        DateTime? deletedAt,
        IEnumerable<TodoItemId> todoItemIds
    ) {
        if (string.IsNullOrEmpty(name))
            throw new ArgumentNullException(nameof(name));
        // TODO: validate color
        this.TodoListId = id;
        this.UserId = userId;
        this.Name = name;
        this.Description = description;
        this.Color = color;
        this.CreatedAt = createdAt;
        this.ModifiedAt = modifiedAt;
        this.DeletedAt = deletedAt;
        this.TodoItemIds = todoItemIds;
    }
}