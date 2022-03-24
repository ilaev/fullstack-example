namespace Eisenhower.Todo.Api;

public interface ICurrentUserAccessor 
{
    Guid GetCurrentUserId();
}