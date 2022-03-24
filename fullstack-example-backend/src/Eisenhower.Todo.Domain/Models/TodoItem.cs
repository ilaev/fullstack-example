namespace Eisenhower.Todo.Domain;

// TODO: implement IEquatable
public class TodoItem
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
    public DateTime CreatedAt { get; private set; }
    public DateTime ModifiedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public TodoItem(
        TodoItemId id,
        UserId userId,
        TodoListId listId,
        string name,
        MatrixX matrixX,
        MatrixY matrixY,
        string note,
        bool markedAsDone,
        DateTime? duedate,
        DateTime createdAt,
        DateTime modifiedAt,
        DateTime? deletedAt
    ) {
        if (string.IsNullOrEmpty(name))
            throw new ArgumentNullException(nameof(name));

        this.TodoItemId =  id;
        this.UserId = userId;
        this.TodoListId = listId;
        this.Name = name;
        this.MatrixX = matrixX;
        this.MatrixY = matrixY;
        this.Note = note;
        this.MarkedAsDone = markedAsDone;
        this.DueDate = duedate;
        this.CreatedAt = createdAt;
        this.ModifiedAt = modifiedAt;
        this.DeletedAt = deletedAt;
    }
}
