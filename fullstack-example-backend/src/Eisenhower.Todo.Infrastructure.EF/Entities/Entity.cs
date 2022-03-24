namespace Eisenhower.Todo.Infrastructure.EF.Entities;

public abstract class Entity : IEquatable<Entity>
{
    public virtual long DbId { get; protected set; }
    
    protected Entity() 
    {}

    protected Entity(long dbId)
    {}

    public static bool operator ==(Entity x, Entity y)
    {
        if (x is null && y is null) 
            return true;
        if (x is null || y is null)
            return false;
        return x.Equals(y);
    }

    public static bool operator !=(Entity x, Entity y) 
    {
        return !(x == y);
    }


    public override int GetHashCode()
    {
        return (this.GetType().ToString().GetHashCode() + this.DbId * 13).GetHashCode();
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Entity other) 
            return false;

        if (ReferenceEquals(this, obj))
        {
            return true;
        }

        if (ReferenceEquals(obj, null))
        {
            return false;
        }

        if (this.GetType() != obj.GetType())
            return false;

        return this.DbId.Equals(other.DbId);
    }

    public bool Equals(Entity? x)
    {
        if (x is null) 
            return false;
        return this.DbId.Equals(x.DbId);
    }
}