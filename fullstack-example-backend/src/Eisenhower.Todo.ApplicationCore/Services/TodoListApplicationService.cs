using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;
using Microsoft.Extensions.Logging;
namespace Eisenhower.Todo.ApplicationCore.Service;

public class TodoListApplicationService : ITodoListReadApplicationService, ITodoListWriteApplicationService
{
    private readonly ILogger<TodoListApplicationService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITodoListRepository _repository;

    public TodoListApplicationService(
        ILogger<TodoListApplicationService> logger,
        IUnitOfWork unitOfWork,
        ITodoListRepository repository
    ) {
        this._logger = logger;
        this._unitOfWork = unitOfWork;
        this._repository = repository;
    }

    public async Task CreateAsync(params TodoListCreateCommand[] createCommands)
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(createCommands.Select(c => c.TodoListId).ToArray());
        var nonExistingCreateCmds = createCommands.Where(c => !dictOfExistingKeys[c.TodoListId]).ToArray();
        var todoListToAdd = nonExistingCreateCmds.Select(cmd => new TodoList()).ToArray();
        await _repository.AddAsync(todoListToAdd);
        await _unitOfWork.CommitAsync();
        // TODO: throw expection if one object exists ? or have some kind of CreateTodoItemResult ?
        // if result
    }

    public async Task DeleteAsync(params TodoListDeleteCommand[] deleteCommands)
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(deleteCommands.Select(cmd => cmd.TodoListId).ToArray());
        var keysOfExistingListsToDelete = deleteCommands.Where(cmd => dictOfExistingKeys[cmd.TodoListId]).Select(cmd => cmd.TodoListId).ToArray();
        await _repository.RemoveAsync(keysOfExistingListsToDelete);
        await _unitOfWork.CommitAsync();
    }

    public Task GetAsync(params TodoListReadCommand[] readCommands)
    {
        return _repository.LoadAsync(readCommands.Select(cmd => cmd.TodoListId).ToArray());
    }

    public async Task UpdateAsync(params TodoListUpdateCommand[] updateCommands)
    {
        if (updateCommands.Length == 0)
            return;
        var lists = await _repository.LoadAsync(updateCommands.Select(cmd => cmd.TodoListId).ToArray());
        
        if (lists.Length > 0) {
            var listsToUpdate = new List<TodoList>();
            for(int i = 0; i < updateCommands.Length; i++) {
                var cmd = updateCommands[i];
                var existingList = lists[i];
                if (existingList != null) {
                    // update
                    var list = new TodoList(); // TODO: update relevant properties by creating a new object with the same id
                    listsToUpdate.Add(list);
                } else {
                    // err case, no item to update
                }
            }
            await _repository.UpdateAsync(listsToUpdate);
            await _unitOfWork.CommitAsync();
        }
    }
}