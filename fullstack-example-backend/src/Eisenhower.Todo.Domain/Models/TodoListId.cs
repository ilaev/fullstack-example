namespace Eisenhower.Todo.Domain;

public class TodoListId
{
    public Guid Id { get; private set; }

    public TodoListId(Guid id) 
    {
        if (id == null || id == Guid.Empty)
            throw new ArgumentNullException("TodoItem id can't be null. Specify id.");
        this.Id = id;
    }
}