namespace Eisenhower.Todo.Infrastructure.EF;

// TODO: evaluate use of AutoMapper at some point.
public static class TodoItemMapper
{
    public static Domain.TodoItem toDomain(Entities.TodoItem entity) 
    {
        var listEntity = entity.TodoLists.First();
        var userEntity = listEntity.Users.First();
        var domainItem = new Domain.TodoItem(
            new Domain.TodoItemId(entity.Id),
            new Domain.UserId(userEntity.Id),
            new Domain.TodoListId(listEntity.Id),
            entity.Name,
            (Domain.MatrixX)entity.MatrixX,
            (Domain.MatrixY)entity.MatrixY,
            entity.Note,
            entity.MarkedAsDone,
            entity.DueDate,
            entity.CreatedAt,
            entity.ModifiedAt,
            entity.DeletedAt);

        return domainItem;
    }

    public static Entities.TodoItem toEntity(Domain.TodoItem domain)
    {
        var entityItem = new Entities.TodoItem();
        entityItem.CreatedAt = domain.CreatedAt;
        entityItem.DeletedAt = domain.DeletedAt;
        entityItem.DueDate = domain.DueDate;
        entityItem.Id = domain.TodoItemId.Id;
        entityItem.MarkedAsDone = domain.MarkedAsDone;
        entityItem.MatrixX = ((int)domain.MatrixX);
        entityItem.MatrixY = ((int)domain.MatrixY);
        entityItem.ModifiedAt = domain.ModifiedAt;
        entityItem.Name = domain.Name;
        entityItem.Note = domain.Note;
        return entityItem;
    }
}