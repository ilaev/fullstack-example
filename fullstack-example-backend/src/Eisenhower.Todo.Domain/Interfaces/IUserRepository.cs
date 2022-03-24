namespace Eisenhower.Todo.Domain;

public interface IUserRepository : IDisposable, IAsyncDisposable
{
    Task<User[]> LoadAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default(CancellationToken));
    Task AddAsync(IEnumerable<User> models, CancellationToken cancellationToken = default(CancellationToken));
    Task RemoveAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default(CancellationToken));
    Task UpdateAsync(IEnumerable<User> models, CancellationToken cancellationToken = default(CancellationToken));
    Task<Dictionary<UserId, bool>> ExistsAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default(CancellationToken));
}