using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Service;

public interface IUserReadApplicationService 
{
    Task<User[]> GetAsync(UserReadCommand[] readCommands, CancellationToken cancellationToken = default(CancellationToken));
}

public interface IUserWriteApplicationService 
{
    Task CreateAsync(UserCreateCommand[] createCommands, CancellationToken cancellationToken = default(CancellationToken));
    Task UpdateAsync(UserUpdateCommand[] updateCommands, CancellationToken cancellationToken = default(CancellationToken));
    Task DeleteAsync(UserDeleteCommand[] deleteCommands, CancellationToken cancellationToken = default(CancellationToken));
}