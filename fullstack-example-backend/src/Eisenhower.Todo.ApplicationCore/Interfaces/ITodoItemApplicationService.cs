using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Service;

public interface ITodoItemReadApplicationService
{
    Task<TodoItem[]> GetAsync(TodoItemReadCommand[] readCommands, CancellationToken cancellationToken = default(CancellationToken));
}

public interface ITodoItemWriteApplicationService
{
    Task CreateAsync(TodoItemCreateCommand[] createCommands, CancellationToken cancellationToken = default(CancellationToken));
    Task UpdateAsync(TodoItemUpdateCommand[] updateCommands, CancellationToken cancellationToken = default(CancellationToken));
    Task DeleteAsync(TodoItemDeleteCommand[] deleteCommands, CancellationToken cancellationToken = default(CancellationToken));
}