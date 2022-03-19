using Eisenhower.Todo.Domain;
using Microsoft.EntityFrameworkCore;

namespace Eisenhower.Todo.Infrastructure.EF;

public class TodoItemRepository : ITodoItemRepository 
{
    private readonly EisenhowerTodoDbContext _dbContext;
    private bool disposedValue;

    public TodoItemRepository(
        EisenhowerTodoDbContext dbContext
    ) {
        this._dbContext = dbContext;
    }

    public Task<Entities.TodoItem[]> LoadEntitiesAsync(IEnumerable<TodoItemId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var guids = ids.Select(tid => tid.Id);
        return _dbContext.TodoItems.Where(item => guids.Contains(item.Id) && item.DeletedAt == null).OrderBy(item => item.CreatedAt).ToArrayAsync(cancellationToken);  
    }

    public async Task<Domain.TodoItem[]> LoadAsync(IEnumerable<TodoItemId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var result = await LoadEntitiesAsync(ids, cancellationToken);
        return result.Select(entityItem => TodoItemMapper.toDomain(entityItem)).ToArray();
    }

    public Task AddAsync(IEnumerable<Domain.TodoItem> models, CancellationToken cancellationToken = default(CancellationToken))
    {
        var entities = models.Select(m => TodoItemMapper.toEntity(m)).ToArray();
        return _dbContext.TodoItems.AddRangeAsync(entities, cancellationToken);
    }

    public Task RemoveAsync(IEnumerable<Domain.TodoItem> models, CancellationToken cancellationToken = default(CancellationToken))
    {
        return UpdateAsync(models, cancellationToken);
    }

    public async Task UpdateAsync(IEnumerable<Domain.TodoItem> models, CancellationToken cancellationToken = default(CancellationToken))
    {
        var clientEntities = models.Select(m => TodoItemMapper.toEntity(m));
        var existingEntities = await LoadEntitiesAsync(models.Select(item => item.TodoItemId).ToArray(), cancellationToken);
        var existingEntitiesDict = existingEntities.ToDictionary(item => item.Id);
        for(int i = 0; i < clientEntities.Count(); i++) 
        {
            var clientEntity = clientEntities.ElementAt(i);
            if (existingEntitiesDict.ContainsKey(clientEntity.Id)) 
            {
                _dbContext.Entry(existingEntitiesDict[clientEntity.Id]).CurrentValues.SetValues(clientEntity);
            } else 
            {
                throw new InvalidOperationException(String.Format("Entity can't be updated because it does not exist, add the entity first. {0} - {1}", clientEntity, clientEntity.Id.ToString()));
                // TODO: throw? if atleast one is missing, throw for all? else I will need again a weird result return value
                // I could also add if it's missing, but it's an update, so the caller has to be making an error using this function to add new 
            }
        }
    }

    public async Task<Dictionary<TodoItemId, bool>> ExistsAsync(IEnumerable<TodoItemId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var loadedEntities = await LoadEntitiesAsync(ids, cancellationToken);
        var resultDict = new Dictionary<TodoItemId, bool>();
        foreach(var id in ids)
        {
            var entityItem = loadedEntities.FirstOrDefault(i => i is not null && i.Id == id.Id);
            if (entityItem is not null)
                resultDict[id] = true;
            else
                resultDict[id] = false;
        }
        return resultDict;
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