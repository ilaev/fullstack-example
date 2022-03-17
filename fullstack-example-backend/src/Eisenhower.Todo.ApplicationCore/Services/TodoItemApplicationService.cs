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
        var todoItemsToAdd = nonExistingCreateCmds.Select(cmd => new TodoItem(new TodoItemId(cmd.TodoItemId.Id), null)).ToArray();
        await _repository.AddAsync(todoItemsToAdd);
        await _unitOfWork.CommitAsync();
        // TODO: throw expection if one object exists ? or have some kind of CreateTodoItemResult ?
        // if result
    }

    // TODO: cancellationToken
    public async Task DeleteAsync(params TodoItemDeleteCommand[] deleteCommands)
    {
        var existingItems = await _repository.LoadAsync(deleteCommands.Select(cmd => cmd.TodoItemId).ToArray());
        var nonNullExistingItems = existingItems.Where(item => item is not null).ToDictionary(keySelector => keySelector.TodoItemId);
        var keysOfInvalidDeleteCmds = deleteCommands.Where(cmd => !nonNullExistingItems.ContainsKey(cmd.TodoItemId)).Select(cmd => cmd.TodoItemId).ToArray();
        // TODO: Could return result or throw if cmd is invalid. Need a decision on a concept soon since this question pops up everywhere.
        var itemsToDelete = new List<TodoItem>(nonNullExistingItems.Count);

        foreach(var existingItem in nonNullExistingItems)
        {
            // delete through "soft-delete" by settng deletedAt datetime
            var itemToDelete = new TodoItem(
                new TodoItemId(existingItem.Value.TodoItemId.Id),
                DateTime.UtcNow);
            itemsToDelete.Add(itemToDelete);
        }

        await _repository.RemoveAsync(itemsToDelete);
        await _unitOfWork.CommitAsync();

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
                    var todoItem = new TodoItem(new TodoItemId(cmd.TodoItemId.Id), existingItem.DeletedAt); // TODO: update relevant properties by creating a new object with the same id
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