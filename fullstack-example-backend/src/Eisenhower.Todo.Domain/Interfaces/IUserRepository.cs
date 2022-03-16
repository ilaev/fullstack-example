namespace Eisenhower.Todo.Domain;

public interface IUserRepository 
{
    Task<User[]> LoadAsync(params UserId[] ids);
    Task AddAsync(params User[] models);
    Task RemoveAsync(params UserId[] ids);
    Task UpdateAsync(params IEnumerable<User>[] models);
    Task<Dictionary<UserId, bool>> ExistsAsync(params UserId[] ids);
}