namespace Eisenhower.Todo.Domain;

public class TodoItemId : IEquatable<TodoItemId>
{
    public Guid Id { get; private set; }

    public TodoItemId(Guid id) 
    {
        if (id == null || id == Guid.Empty)
            throw new ArgumentNullException("TodoItem id can't be null. Specify id.");
        this.Id = id;
    }

    public bool Equals(TodoItemId? other)
    {
        if (other is null)
            return false;
        return this.Id == other.Id;
    }
    public override bool Equals(object obj) => Equals(obj as TodoItemId);
    public override int GetHashCode() => (Id).GetHashCode();
}