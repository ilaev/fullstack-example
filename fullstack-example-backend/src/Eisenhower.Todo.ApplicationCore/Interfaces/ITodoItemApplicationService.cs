using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Service;

public interface ITodoItemReadApplicationService
{
    Task<TodoItem[]> GetAsync(params TodoItemReadCommand[] readCommands);
}

public interface ITodoItemWriteApplicationService
{
    Task CreateAsync(params TodoItemCreateCommand[] createCommands);
    Task UpdateAsync(params TodoItemUpdateCommand[] updateCommands);
    Task DeleteAsync(params TodoItemDeleteCommand[] deleteCommands);
}