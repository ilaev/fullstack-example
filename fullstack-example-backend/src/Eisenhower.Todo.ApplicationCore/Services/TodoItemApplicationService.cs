using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;
using Microsoft.Extensions.Logging; // This means we have a dependency on Microsoft or rather their interfaces in our core, which I will take since I don't want to implement this myself. 

namespace Eisenhower.Todo.ApplicationCore.Service;

public class TodoItemApplicationService : ITodoItemReadApplicationService, ITodoItemWriteApplicationService
{
    private readonly ILogger<TodoItemApplicationService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITodoItemRepository _repository;

    public TodoItemApplicationService(
        ILogger<TodoItemApplicationService> logger,
        IUnitOfWork unitOfWork,
        ITodoItemRepository repository
    ) {
        this._logger = logger;
        this._unitOfWork = unitOfWork;
        this._repository = repository;
    }
    
    public async Task CreateAsync(params TodoItemCreateCommand[] createCommands)
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(createCommands.Select(c => c.TodoItemId).ToArray());
        var nonExistingCreateCmds = createCommands.Where(c => !dictOfExistingKeys[c.TodoItemId]).ToArray();
        var todoItemsToAdd = nonExistingCreateCmds.Select(cmd => new TodoItem()).ToArray();
        await _repository.AddAsync(todoItemsToAdd);
        await _unitOfWork.CommitAsync();
        // TODO: throw expection if one object exists ? or have some kind of CreateTodoItemResult ?
        // if result
    }

    public async Task DeleteAsync(params TodoItemDeleteCommand[] deleteCommands)
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(deleteCommands.Select(cmd => cmd.TodoItemId).ToArray());
        var keysOfExistingItemsToDelete = deleteCommands.Where(cmd => dictOfExistingKeys[cmd.TodoItemId]).Select(cmd => cmd.TodoItemId).ToArray();
        await _repository.RemoveAsync(keysOfExistingItemsToDelete);
        await _unitOfWork.CommitAsync();
        // TODO: what to do with items that can't be deleted, with errors 
    }

    public Task<TodoItem[]> GetAsync(params TodoItemReadCommand[] readCommands)
    {
        return _repository.LoadAsync(readCommands.Select(cmd => cmd.TodoItemId).ToArray());
    }

    public async Task UpdateAsync(params TodoItemUpdateCommand[] updateCommands)
    {
        if (updateCommands.Length == 0)
            return;
        var items = await _repository.LoadAsync(updateCommands.Select(cmd => cmd.TodoItemId).ToArray());
        
        if (items.Length > 0) {
            var itemsToUpdate = new List<TodoItem>();
            for(int i = 0; i < updateCommands.Length; i++) {
                var cmd = updateCommands[i];
                var existingItem = items[i];
                if (existingItem != null) {
                    // update
                    var todoItem = new TodoItem(); // TODO: update relevant properties by creating a new object with the same id
                    itemsToUpdate.Add(todoItem);
                } else {
                    // err case, no item to update
                }
            }
            await _repository.UpdateAsync(itemsToUpdate);
            await _unitOfWork.CommitAsync();
        }
        // TODO: Result
    }
}