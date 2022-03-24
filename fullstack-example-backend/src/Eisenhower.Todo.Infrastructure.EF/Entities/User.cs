namespace Eisenhower.Todo.Infrastructure.EF.Entities;

public class User : Entity 
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }

    // Navigation properties
    public virtual ICollection<TodoList> TodoLists { get; set; }

    public User() 
    {
        this.Email = string.Empty;
        this.Name = string.Empty;
        this.TodoLists = new List<TodoList>();
    } 

    public User(
        long dbId,
        Guid id,
        string email,
        string name,
        DateTime createdAt,
        DateTime modifiedAt,
        ICollection<TodoList> todoLists
    ) : base (dbId)
    {
        this.Id = id;
        this.Email = email;
        this.Name = name;
        this.CreatedAt = createdAt;
        this.ModifiedAt = modifiedAt;
        this.TodoLists = todoLists;
    }
}