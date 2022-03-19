using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class TodoItemWriteCommand 
{
    public TodoItemId TodoItemId { get; private set; }
    public UserId UserId { get; private set; }
    public TodoListId TodoListId { get; private set; }
    public string Name { get; private set;}
    public MatrixX MatrixX { get; private set; }
    public MatrixY MatrixY { get; private set; }
    public string Note { get; private set; }
    public bool MarkedAsDone { get; private set; }
    public DateTime? DueDate { get; private set; }

    public TodoItemWriteCommand(
        Guid itemId,
        Guid userId,
        Guid listId,
        string name,
        MatrixX matrixX,
        MatrixY matrixY,
        string note,
        bool markedAsDone,
        DateTime? dueDate
    ) {
        this.TodoItemId = new TodoItemId(itemId);
        this.UserId = new UserId(userId);
        this.TodoListId = new TodoListId(listId);
        this.Name = name;
        this.MatrixX = matrixX;
        this.MatrixY = matrixY;
        this.Note = note;
        this.MarkedAsDone = markedAsDone;
        this.DueDate = dueDate;
    }
}

public class TodoItemCreateCommand : TodoItemWriteCommand
{
    public TodoItemCreateCommand(
        Guid itemId,
        Guid userId,
        Guid listId,
        string name,
        MatrixX matrixX,
        MatrixY matrixY,
        string note,
        bool markedAsDone,
        DateTime? dueDate) : 
        base(itemId, userId, listId, name, matrixX, matrixY, note, markedAsDone, dueDate) 
    {
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

public class TodoItemUpdateCommand : TodoItemWriteCommand
{
    public TodoItemUpdateCommand(
        Guid itemId,
        Guid userId,
        Guid listId,
        string name,
        MatrixX matrixX,
        MatrixY matrixY,
        string note,
        bool markedAsDone,
        DateTime? dueDate) : 
        base(itemId, userId, listId, name, matrixX, matrixY, note, markedAsDone, dueDate) 
    {
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