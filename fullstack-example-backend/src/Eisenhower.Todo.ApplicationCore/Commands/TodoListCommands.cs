using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class TodoListWriteCommand : IEquatable<TodoListWriteCommand>
{
    public TodoListId TodoListId { get; private set; }
    public UserId UserId { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string Color { get; private set; }
    
    public TodoListWriteCommand(
        Guid listId,
        Guid userId,
        string name,
        string description,
        string color
    ) {
        this.TodoListId = new TodoListId(listId);
        this.UserId = new UserId(userId);
        this.Name = name;
        this.Description = description;
        this.Color = color;
    }

    public bool Equals(TodoListWriteCommand? other)
    {
        if (other is null)
            return false;
        return this.TodoListId.Equals(other.TodoListId) 
            && this.UserId.Equals(other.UserId) 
            && this.Name == other.Name 
            && this.Description == other.Description
            && this.Color == other.Color;
    }
    public override bool Equals(object obj) => Equals(obj as TodoListWriteCommand);
    public override int GetHashCode() => (TodoListId.Id, UserId.Id, Name, Description, Color).GetHashCode();
}

public class TodoListCreateCommand : TodoListWriteCommand, IEquatable<TodoListCreateCommand>
{
    public TodoListCreateCommand(
        Guid listId,
        Guid userId,
        string name,
        string description,
        string color
    ) : base(listId, userId, name, description, color)
    {
    }
    
    public bool Equals(TodoListCreateCommand? other)
    {
        return base.Equals(other);
    }
}

public class TodoListReadCommand 
{
    public TodoListId TodoListId { get; private set; }
    
    public TodoListReadCommand(
        Guid listId
    ) {
        this.TodoListId = new TodoListId(listId);
    }
}

public class TodoListUpdateCommand : TodoListWriteCommand
{
    public TodoListUpdateCommand(
        Guid listId,
        Guid userId,
        string name,
        string description,
        string color
    ) : base(listId, userId, name, description, color)
    {
    }
}

public class TodoListDeleteCommand
{
    public TodoListId TodoListId { get; private set; }
    
    public TodoListDeleteCommand(
        Guid listId
    ) {
        this.TodoListId = new TodoListId(listId);
    }
}