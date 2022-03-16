using Eisenhower.Todo.ApplicationCore.Command;

namespace Eisenhower.Todo.ApplicationCore.Service;

public interface ITodoListReadApplicationService 
{
    Task GetAsync(params TodoListReadCommand[] readCommands);
}

public interface ITodoListWriteApplicationService 
{
    Task CreateAsync(params TodoListCreateCommand[] createCommands);
    Task UpdateAsync(params TodoListUpdateCommand[] updateCommands);
    Task DeleteAsync(params TodoListDeleteCommand[] deleteCommands);
}