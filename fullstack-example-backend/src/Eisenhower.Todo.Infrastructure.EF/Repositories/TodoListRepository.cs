using Eisenhower.Todo.Domain;
using Microsoft.EntityFrameworkCore;

namespace Eisenhower.Todo.Infrastructure.EF;

public class TodoListRepository : ITodoListRepository
{
    private readonly EisenhowerTodoDbContext _dbContext;
    private bool disposedValue; 
    public TodoListRepository(
        EisenhowerTodoDbContext dbContext
    ) {
        this._dbContext = dbContext;
    }

    public Task<Entities.TodoList[]> LoadEntitiesAsync(IEnumerable<TodoListId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var guids = ids.Select(lid => lid.Id);
        return _dbContext.TodoLists.Where(list => guids.Contains(list.Id) && list.DeletedAt == null).OrderBy(list => list.CreatedAt).ToArrayAsync(cancellationToken);  
    }

    public async Task<Domain.TodoList[]> LoadAsync(IEnumerable<TodoListId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var result = await LoadEntitiesAsync(ids, cancellationToken);
        return result.Select(entityList => TodoListMapper.toDomain(entityList)).ToArray();
    }

    public Task AddAsync(IEnumerable<TodoList> models, CancellationToken cancellationToken = default(CancellationToken))
    {
        var entities = models.Select(m => TodoListMapper.toEntity(m)).ToArray();
        return _dbContext.TodoLists.AddRangeAsync(entities, cancellationToken);
    }

    public Task RemoveAsync(IEnumerable<TodoList> models, CancellationToken cancellationToken = default(CancellationToken))
    {
        return UpdateAsync(models, cancellationToken);
    }

    public async Task UpdateAsync(IEnumerable<TodoList> models, CancellationToken cancellationToken = default(CancellationToken))
    {
        var clientEntities = models.Select(m => TodoListMapper.toEntity(m));
        var existingEntities = await LoadEntitiesAsync(models.Select(item => item.TodoListId).ToArray(), cancellationToken);
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
            }
        }
    }

    public async Task<Dictionary<TodoListId, bool>> ExistsAsync(IEnumerable<TodoListId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var loadedEntities = await LoadEntitiesAsync(ids, cancellationToken);
        var resultDict = new Dictionary<TodoListId, bool>();
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