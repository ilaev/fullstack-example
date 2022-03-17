namespace Eisenhower.Todo.Infrastructure.EF;

// TODO: evaluate use of AutoMapper at some point.
public static class TodoItemMapper
{
    public static Domain.TodoItem toDomain(Entities.TodoItem entity) 
    {
        var domainItem = new Domain.TodoItem(new Domain.TodoItemId(entity.Id), entity.DeletedAt);

        return domainItem;
    }

    public static Entities.TodoItem toEntity(Domain.TodoItem domain)
    {
        var entityItem = new Entities.TodoItem();

        return entityItem;
    }
}