using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class TodoItemCreateCommand 
{
    public TodoItemId TodoItemId { get; private set; }

    public TodoItemCreateCommand(
        Guid itemId
    ) {
        this.TodoItemId = new TodoItemId(itemId);
    }
}

public class TodoItemReadCommand 
{
    public TodoItemId TodoItemId { get; private set; }

    public TodoItemReadCommand(
        Guid itemId
    ) {
        this.TodoItemId = new TodoItemId(itemId);
    }
}

public class TodoItemUpdateCommand
{
    public TodoItemId TodoItemId { get; private set; }

    public TodoItemUpdateCommand(
        Guid itemId
    ) {
        this.TodoItemId = new TodoItemId(itemId);
    }
}

public class TodoItemDeleteCommand
{
    public TodoItemId TodoItemId { get; private set; }

    public TodoItemDeleteCommand(
        Guid itemId
    ) {
        this.TodoItemId = new TodoItemId(itemId);
    }
}