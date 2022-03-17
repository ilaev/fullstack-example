namespace Eisenhower.Todo.Infrastructure.EF;

// TODO: evaluate use of AutoMapper at some point.
public static class UserMapper
{
    public static Domain.User toDomain(Entities.User entity) 
    {
        var domainItem = new Domain.User(new Domain.UserId(entity.Id));

        return domainItem;
    }

    public static Entities.User toEntity(Domain.User domain)
    {
        var entityItem = new Entities.User();

        return entityItem;
    }
}