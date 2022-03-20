namespace Eisenhower.Todo.Infrastructure.EF.Entities;

public class TodoList : Entity 
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Color { get; set;}
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<TodoItem> TodoItems { get; set; }

    // Navigation properties
    public long UserDbId { get; set; }
    public User User { get; set; }

    public TodoList()
    {
        this.Name = string.Empty;
        this.Description = string.Empty;
        this.Color = string.Empty;
        this.TodoItems = new List<TodoItem>();
    }
    public TodoList(
        long dbId,
        Guid id,
        string name,
        string description,
        string color,
        DateTime createdAt,
        DateTime modifiedAt,
        DateTime? deletedAt,
        ICollection<TodoItem> todoItems
    ) : base(dbId)
    {
        this.Id = id;
        this.Name = name;
        this.Description = description;
        this.Color = color;
        this.CreatedAt = createdAt;
        this.ModifiedAt = modifiedAt;
        this.DeletedAt = deletedAt;
        this.TodoItems = todoItems;
    }
}