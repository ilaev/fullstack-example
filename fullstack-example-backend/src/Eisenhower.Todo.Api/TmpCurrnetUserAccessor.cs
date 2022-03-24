namespace Eisenhower.Todo.Api;

public class TmpCurrentUserAccessor : ICurrentUserAccessor
{
    public Guid GetCurrentUserId()
    {
        return new Guid("5b3a67e2-adad-4582-8e81-115513f6a917");
    }
}