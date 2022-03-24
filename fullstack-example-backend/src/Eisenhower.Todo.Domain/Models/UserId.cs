namespace Eisenhower.Todo.Domain;

public class UserId : IEquatable<UserId>
{
    public Guid Id { get; private set; }

    public UserId(Guid id) 
    {
        if (id == null || id == Guid.Empty)
            throw new ArgumentNullException("TodoItem id can't be null. Specify id.");
        this.Id = id;
    }

    public bool Equals(UserId? other)
    {
        if (other is null)
            return false;
        return this.Id == other.Id;
    }
    public override bool Equals(object obj) => Equals(obj as UserId);
    public override int GetHashCode() => (Id).GetHashCode();
}