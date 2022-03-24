namespace Eisenhower.Todo.Domain;

public class TodoListId : IEquatable<TodoListId>
{
    public Guid Id { get; private set; }

    public TodoListId(Guid id) 
    {
        this.Id = id;
    }
    public bool Equals(TodoListId? other)
    {
        if (other is null)
            return false;
        return this.Id == other.Id;
    }
    public override bool Equals(object obj) => Equals(obj as TodoListId);
    public override int GetHashCode() => (Id).GetHashCode();
}