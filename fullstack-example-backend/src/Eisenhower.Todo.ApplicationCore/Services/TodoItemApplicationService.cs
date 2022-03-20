using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;
using Microsoft.Extensions.Logging;

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

    public async Task CreateAsync(TodoItemCreateCommand[] createCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(createCommands.Select(c => c.TodoItemId).ToArray(), cancellationToken);
        var invalidExistingIds = createCommands.Where(tid => dictOfExistingKeys[tid.TodoItemId]).ToArray(); 
        if (invalidExistingIds.Length > 0)
        { 
            throw new InvalidOperationException(string.Format("Items can't be created because you provided some existing ids: {0}", invalidExistingIds.ToString()));
        }
        var todoItems = createCommands.Select(cmd => new TodoItem(
            new TodoItemId(cmd.TodoItemId.Id),
            new UserId(cmd.UserId.Id),
            new TodoListId(cmd.TodoListId.Id),
            cmd.Name,
            cmd.MatrixX,
            cmd.MatrixY,
            cmd.Note,
            cmd.MarkedAsDone,
            cmd.DueDate,
            DateTime.UtcNow,
            DateTime.UtcNow,
            null
        ));
        // TODO: add item to list
        await _repository.AddAsync(todoItems, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
    }

    // TODO: cancellationToken
    public async Task DeleteAsync(TodoItemDeleteCommand[] deleteCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        var existingItems = await _repository.LoadAsync(deleteCommands.Select(cmd => cmd.TodoItemId).ToArray(), cancellationToken);
        var nonNullExistingItems = existingItems.Where(item => item is not null).ToDictionary(keySelector => keySelector.TodoItemId);
        var keysOfInvalidDeleteCmds = deleteCommands.Where(cmd => !nonNullExistingItems.ContainsKey(cmd.TodoItemId)).Select(cmd => cmd.TodoItemId).ToArray();
        if (keysOfInvalidDeleteCmds.Length > 0) { 
            throw new InvalidOperationException(string.Format("Items can't be deleted because you provided some non-existing ids: {0}", keysOfInvalidDeleteCmds.ToString()));
        }

        var itemsToDelete = new List<TodoItem>(nonNullExistingItems.Count);

        foreach(var existingItem in nonNullExistingItems)
        {
            // delete through "soft-delete" by setting deletedAt datetime
            var itemToDelete = new TodoItem(
                new TodoItemId(existingItem.Value.TodoItemId.Id),
                new UserId(existingItem.Value.UserId.Id),
                new TodoListId(existingItem.Value.TodoListId.Id),
                existingItem.Value.Name,
                existingItem.Value.MatrixX,
                existingItem.Value.MatrixY,
                existingItem.Value.Note,
                existingItem.Value.MarkedAsDone,
                existingItem.Value.DueDate,
                existingItem.Value.CreatedAt,
                existingItem.Value.ModifiedAt,
                DateTime.UtcNow);
            itemsToDelete.Add(itemToDelete);
        }

        await _repository.RemoveAsync(itemsToDelete, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

    }

    public Task<TodoItem[]> GetAsync(TodoItemReadCommand[] readCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        return _repository.LoadAsync(readCommands.Select(cmd => cmd.TodoItemId).ToArray(), cancellationToken);
    }

    public async Task UpdateAsync(TodoItemUpdateCommand[] updateCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        if (updateCommands.Length == 0)
            return;
        var items = await _repository.LoadAsync(updateCommands.Select(cmd => cmd.TodoItemId).ToArray(), cancellationToken);
        
        if (items.Length > 0) {
            var itemsToUpdate = new List<TodoItem>();
            for(int i = 0; i < updateCommands.Length; i++) {
                var cmd = updateCommands[i];
                var existingItem = items[i];
                if (existingItem != null) {
                    // update
                    var todoItem = new TodoItem(
                        new TodoItemId(existingItem.TodoItemId.Id),
                        new UserId(existingItem.UserId.Id),
                        new TodoListId(existingItem.TodoListId.Id),
                        cmd.Name,
                        cmd.MatrixX,
                        cmd.MatrixY,
                        cmd.Note,
                        cmd.MarkedAsDone,
                        cmd.DueDate,
                        existingItem.CreatedAt,
                        DateTime.UtcNow,
                        existingItem.DeletedAt);
                    itemsToUpdate.Add(todoItem);
                } else {
                    throw new InvalidOperationException(string.Format("Item can't be updated. Model with provided id {0} does not exist.", cmd.TodoItemId.Id.ToString()));
                }
            }
            // TODO: add item to list
            await _repository.UpdateAsync(itemsToUpdate, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
        }
    }
}