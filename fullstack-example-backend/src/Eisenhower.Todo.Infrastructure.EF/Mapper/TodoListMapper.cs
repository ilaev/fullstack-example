namespace Eisenhower.Todo.Infrastructure.EF;

// TODO: evaluate use of AutoMapper at some point.
public static class TodoListMapper
{
    public static Domain.TodoList toDomain(Entities.TodoList entity) 
    {
        var domainItem = new Domain.TodoList(new Domain.TodoListId(entity.Id), entity.DeletedAt);

        return domainItem;
    }

    public static Entities.TodoList toEntity(Domain.TodoList domain)
    {
        var entityItem = new Entities.TodoList();

        return entityItem;
    }
}