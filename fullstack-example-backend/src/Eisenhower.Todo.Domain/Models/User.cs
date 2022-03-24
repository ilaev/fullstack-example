namespace Eisenhower.Todo.Domain;

// TODO: implement IEquatable
public class User 
{
    public UserId UserId { get; private set; }
    public string Email { get; private set; }
    public string Name { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ModifiedAt { get; private set; }
    public IEnumerable<TodoListId> TodoListIds { get; private set; }

    public User(
        UserId id,
        string email,
        string name,
        DateTime createdAt,
        DateTime modifiedAt,
        IEnumerable<TodoListId> todoListIds
    ) {
        if (string.IsNullOrEmpty(email))
            throw new ArgumentNullException(nameof(email));
        if (string.IsNullOrEmpty(name))
            throw new ArgumentNullException(nameof(name));

        this.UserId = id;
        this.Email = email;
        this.Name = name;
        this.CreatedAt = createdAt;
        this.ModifiedAt = modifiedAt;
        this.TodoListIds = todoListIds;
    }
}