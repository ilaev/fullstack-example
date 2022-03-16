using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class TodoListCreateCommand 
{
    public TodoListId TodoListId { get; private set; }
    
    public TodoListCreateCommand(
        Guid listId
    ) {
        this.TodoListId = new TodoListId(listId);
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

public class TodoListUpdateCommand
{
    public TodoListId TodoListId { get; private set; }
    
    public TodoListUpdateCommand(
        Guid listId
    ) {
        this.TodoListId = new TodoListId(listId);
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