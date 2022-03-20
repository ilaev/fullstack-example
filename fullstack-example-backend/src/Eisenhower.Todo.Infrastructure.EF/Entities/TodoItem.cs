namespace Eisenhower.Todo.Infrastructure.EF.Entities;

public class TodoItem : Entity 
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int MatrixX { get; set; }
    public int MatrixY { get; set; }
    public string Note { get; set; }
    public bool MarkedAsDone { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public long TodoListDbId { get; set; }
    public TodoList TodoList { get; set; }

    public TodoItem()
    {
        this.Name = string.Empty;
        this.Note = string.Empty;
    }

    public TodoItem(
        long dbId,
        Guid id,
        string name,
        int matrixX,
        int matrixY,
        string note,
        DateTime? dueDate,
        DateTime createdAt,
        DateTime modifiedAt,
        DateTime? deletedAt,
        bool markedAsDone) : base(dbId) {
            this.Id = id;
            this.Name = name;
            this.MatrixX = matrixX;
            this.MatrixY = matrixY;
            this.Note = note;
            this.DueDate = dueDate;
            this.CreatedAt = createdAt;
            this.ModifiedAt = modifiedAt;
            this.DeletedAt = deletedAt;
            this.MarkedAsDone = markedAsDone;
        }
}
