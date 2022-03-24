using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.Infrastructure.EF;

public class EfCoreUnitOfWork : IUnitOfWork
{
    private readonly EisenhowerTodoDbContext _dbContext;
    private bool disposedValue;

    public EfCoreUnitOfWork(EisenhowerTodoDbContext dbContext) 
    {
        this._dbContext = dbContext;
    }

    public Task CommitAsync(CancellationToken cancellationToken = default)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }

    protected virtual async ValueTask DisposeAsyncCore()
    {
        if(_dbContext is not null)
        {
            await _dbContext.DisposeAsync().ConfigureAwait(false);
        }
    }

    public async ValueTask DisposeAsync()
    {
        // perform async cleanup
        await DisposeAsyncCore();

        // dispose of unmanaged resources
        Dispose(false);

        // Suppress finalization
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!disposedValue)
        {
            if (disposing)
            {
                // dispose managed state (managed objects).
                if (_dbContext != null) {
                   _dbContext.Dispose();
                }
 
            }

            // TODO: free unmanaged resources (unmanaged objects) and override finalizer
            // TODO: set large fields to null
            disposedValue = true;
        }
    }

    // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
    // ~EfCoreUnitOfWork()
    // {
    //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
    //     Dispose(disposing: false);
    // }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
}