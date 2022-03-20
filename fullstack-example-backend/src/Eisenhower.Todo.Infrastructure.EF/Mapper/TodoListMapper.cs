namespace Eisenhower.Todo.Infrastructure.EF;

// TODO: evaluate use of AutoMapper at some point.
public static class TodoListMapper
{
    public static Domain.TodoList toDomain(Entities.TodoList entity) 
    {
        var domainItem = new Domain.TodoList(
            new Domain.TodoListId(entity.Id),
            new Domain.UserId(entity.User.Id),
            entity.Name,
            entity.Description,
            entity.Color,
            entity.CreatedAt,
            entity.ModifiedAt,
            entity.DeletedAt,
            entity.TodoItems.Select(item => new Domain.TodoItemId(item.Id)).ToList());

        return domainItem;
    }

    public static Entities.TodoList toEntity(Domain.TodoList domain)
    {
        var entityItem = new Entities.TodoList();
        entityItem.Color = domain.Color;
        entityItem.CreatedAt = domain.CreatedAt;
        entityItem.DeletedAt = domain.DeletedAt;
        entityItem.Description = domain.Description;
        entityItem.Id = domain.TodoListId.Id;
        entityItem.ModifiedAt = domain.ModifiedAt;
        entityItem.Name = domain.Name;
        // navigation properties are set inside the repositories

        return entityItem;
    }
}