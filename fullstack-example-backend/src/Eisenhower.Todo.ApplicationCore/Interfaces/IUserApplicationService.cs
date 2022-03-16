using Eisenhower.Todo.ApplicationCore.Command;

namespace Eisenhower.Todo.ApplicationCore.Service;

public interface IUserReadApplicationService 
{
    Task GetAsync(params UserReadCommand[] readCommands);
}

public interface IUserWriteApplicationService 
{
    Task CreateAsync(params UserCreateCommand[] createCommands);
    Task UpdateAsync(params UserUpdateCommand[] updateCommands);
    Task DeleteAsync(params UserDeleteCommand[] deleteCommands);
}