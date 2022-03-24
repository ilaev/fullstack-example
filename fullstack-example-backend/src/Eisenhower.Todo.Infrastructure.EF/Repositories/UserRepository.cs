using Eisenhower.Todo.Domain;
using Microsoft.EntityFrameworkCore;

namespace Eisenhower.Todo.Infrastructure.EF;

public class UserRepository : IUserRepository
{
    private readonly EisenhowerTodoDbContext _dbContext;
    private bool disposedValue;

    public UserRepository(
        EisenhowerTodoDbContext dbContext
    ) {
        this._dbContext = dbContext;
    }

    public Task<Entities.User[]> LoadEntitiesAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default(CancellationToken))
    {
        var guids = ids.Select(uid => uid.Id);
        return _dbContext.Users.Include(u => u.TodoLists).Where(user => guids.Contains(user.Id)).OrderBy(item => item.CreatedAt).ToArrayAsync(cancellationToken);  
    }

    public async Task<User[]> LoadAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default)
    {
        var result = await LoadEntitiesAsync(ids, cancellationToken);
        return result.Select(entityItem => UserMapper.toDomain(entityItem)).ToArray();
    }

    public Task AddAsync(IEnumerable<User> models, CancellationToken cancellationToken = default)
    {
        var entities = models.Select(m => UserMapper.toEntity(m)).ToArray();
        return _dbContext.Users.AddRangeAsync(entities, cancellationToken);
    }

    public async Task RemoveAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default)
    {
        // TODO: implement real deletion + cascade - all items and all lists shall be deleted
        // https://docs.microsoft.com/en-us/ef/core/saving/cascade-delete
        var existingUsers = await LoadEntitiesAsync(ids);
        var nonNullExistingUsers = existingUsers.Where(user => user is not null);
        if (existingUsers.Length == nonNullExistingUsers.Count()) 
        {
            _dbContext.RemoveRange(nonNullExistingUsers);
        }
        else 
        {
            var invalidIds = ids.Where(uid => nonNullExistingUsers.FirstOrDefault(u => u.Id == uid.Id) is null); 
            throw new InvalidOperationException(string.Format("Entities can't be removed because you provided some non-existing ids: {0}", invalidIds.ToString()));
        }
    }

    public async Task UpdateAsync(IEnumerable<User> models, CancellationToken cancellationToken = default)
    {
        var clientEntities = models.Select(m => UserMapper.toEntity(m));
        var existingEntities = await LoadEntitiesAsync(models.Select(item => item.UserId).ToArray(), cancellationToken);
        var existingEntitiesDict = existingEntities.ToDictionary(item => item.Id);
        for(int i = 0; i < clientEntities.Count(); i++) 
        {
            var clientEntity = clientEntities.ElementAt(i);
            if (existingEntitiesDict.ContainsKey(clientEntity.Id)) 
            {
                var existingEntity = existingEntitiesDict[clientEntity.Id];
                existingEntity.Email = clientEntity.Email;
                existingEntity.ModifiedAt = clientEntity.ModifiedAt;
                existingEntity.Name = clientEntity.Name;
                _dbContext.Entry(existingEntity).State = EntityState.Modified;
            } 
            else 
            {
                throw new InvalidOperationException(String.Format("Entity can't be updated because it does not exist, add the entity first. {0} - {1}", clientEntity, clientEntity.Id.ToString()));
            }
        }
    }

    public async Task<Dictionary<UserId, bool>> ExistsAsync(IEnumerable<UserId> ids, CancellationToken cancellationToken = default)
    {
        var loadedEntities = await LoadEntitiesAsync(ids, cancellationToken);
        var resultDict = new Dictionary<UserId, bool>();
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
                if (_dbContext != null) 
                {
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