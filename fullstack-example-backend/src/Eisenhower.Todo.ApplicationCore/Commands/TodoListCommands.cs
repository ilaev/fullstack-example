using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class TodoListWriteCommand 
{
    public TodoListId TodoListId { get; private set; }
    public UserId UserId { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string Color { get; private set; }
    public IEnumerable<TodoItemId> TodoItemIds { get; private set; }
    
    public TodoListWriteCommand(
        Guid listId,
        Guid userId,
        string name,
        string description,
        string color,
        IEnumerable<TodoItemId> todoItemIds
    ) {
        this.TodoListId = new TodoListId(listId);
        this.UserId = new UserId(userId);
        this.Name = name;
        this.Description = description;
        this.Color = color;
        this.TodoItemIds = todoItemIds;
    }
}

public class TodoListCreateCommand : TodoListWriteCommand
{
    public TodoListCreateCommand(
        Guid listId,
        Guid userId,
        string name,
        string description,
        string color,
        IEnumerable<TodoItemId> todoItemIds
    ) : base(listId, userId, name, description, color, todoItemIds)
    {
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
        string color,
        IEnumerable<TodoItemId> todoItemIds
    ) : base(listId, userId, name, description, color, todoItemIds)
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