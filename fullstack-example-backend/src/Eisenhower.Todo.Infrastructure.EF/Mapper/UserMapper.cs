namespace Eisenhower.Todo.Infrastructure.EF;

// TODO: evaluate use of AutoMapper at some point.
public static class UserMapper
{
    public static Domain.User toDomain(Entities.User entity) 
    {
        var domainItem = new Domain.User(
            new Domain.UserId(entity.Id),
            entity.Email,
            entity.Name,
            entity.CreatedAt,
            entity.ModifiedAt,
            entity.TodoLists.Select(list => new Domain.TodoListId(list.Id)).ToList()
            );

        return domainItem;
    }

    public static Entities.User toEntity(Domain.User domain)
    {
        var entityItem = new Entities.User();
            entityItem.CreatedAt = domain.CreatedAt;
            entityItem.Email = domain.Email;
            entityItem.Id = domain.UserId.Id;
            entityItem.ModifiedAt = domain.ModifiedAt;
            entityItem.Name = domain.Name;
        return entityItem;
    }
}