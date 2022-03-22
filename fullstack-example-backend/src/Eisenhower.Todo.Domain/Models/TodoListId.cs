namespace Eisenhower.Todo.Domain;

public class TodoListId
{
    public Guid Id { get; private set; }

    public TodoListId(Guid id) 
    {
        this.Id = id;
    }
}