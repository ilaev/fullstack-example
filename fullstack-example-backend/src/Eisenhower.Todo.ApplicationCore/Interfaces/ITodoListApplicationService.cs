using Eisenhower.Todo.ApplicationCore.Command;

namespace Eisenhower.Todo.ApplicationCore.Service;

public interface ITodoListReadApplicationService 
{
    Task<Domain.TodoList[]> GetAsync(TodoListReadCommand[] readCommands, CancellationToken cancellationToken = default(CancellationToken));
}

public interface ITodoListWriteApplicationService 
{
    Task CreateAsync(TodoListCreateCommand[] createCommands, CancellationToken cancellationToken = default(CancellationToken));
    Task UpdateAsync(TodoListUpdateCommand[] updateCommands, CancellationToken cancellationToken = default(CancellationToken));
    Task DeleteAsync(TodoListDeleteCommand[] deleteCommands, CancellationToken cancellationToken = default(CancellationToken));
}