namespace Eisenhower.Todo.Domain;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    ///
    // Commits any outstanding changes.
    ///
    Task CommitAsync(CancellationToken cancellationToken = default);
}