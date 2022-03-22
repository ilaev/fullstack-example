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

    public async Task CreateAsync(TodoListCreateCommand[] createCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(createCommands.Select(c => c.TodoListId).ToArray(), cancellationToken);
        var invalidExistingIds = createCommands.Where(cmd => dictOfExistingKeys[cmd.TodoListId]).ToArray();
        if (invalidExistingIds.Length > 0)
        {
            throw new InvalidOperationException(string.Format("Lists can't be created because you provided some existing ids: {0}", invalidExistingIds.ToString()));
        }

        var todoListToAdd = createCommands.Select(cmd => new TodoList(
            new TodoListId(cmd.TodoListId.Id),
            new UserId(cmd.UserId.Id),
            cmd.Name,
            cmd.Description,
            cmd.Color,
            DateTime.UtcNow,
            DateTime.UtcNow,
            null,
            new TodoItemId[0])).ToArray();
        await _repository.AddAsync(todoListToAdd, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
    }

    public async Task DeleteAsync(TodoListDeleteCommand[] deleteCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        // TODO: forbid deletion of default list here and in client
        var existingLists = await _repository.LoadAsync(deleteCommands.Select(cmd => cmd.TodoListId).ToArray(), cancellationToken);
        var nonNullExistingLists = existingLists.Where(list => list is not null).ToDictionary(keySelector => keySelector.TodoListId);
        var keysOfInvalidDeleteCmds = deleteCommands.Where(cmd => !nonNullExistingLists.ContainsKey(cmd.TodoListId)).Select(cmd => cmd.TodoListId).ToArray();
        if (keysOfInvalidDeleteCmds.Length > 0) { 
            throw new InvalidOperationException(string.Format("Lists can't be deleted because you provided some non-existing ids: {0}", keysOfInvalidDeleteCmds.ToString()));
        }

        var listsToDelete = new List<TodoList>(nonNullExistingLists.Count);

        foreach(var existingList in nonNullExistingLists)
        {
            // delete through "soft-delete" by setting deletedAt datetime
            var listToDelete = new TodoList(
                new TodoListId(existingList.Value.TodoListId.Id),
                new UserId(existingList.Value.UserId.Id),
                existingList.Value.Name,
                existingList.Value.Description,
                existingList.Value.Color,
                existingList.Value.CreatedAt,
                existingList.Value.ModifiedAt,
                DateTime.UtcNow,
                existingList.Value.TodoItemIds);
            listsToDelete.Add(listToDelete);
        }

        await _repository.RemoveAsync(listsToDelete, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
    }

    public Task<Domain.TodoList[]> GetAsync(TodoListReadCommand[] readCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        return _repository.LoadAsync(readCommands.Select(cmd => cmd.TodoListId).ToArray(),cancellationToken);
    }

    public async Task UpdateAsync(TodoListUpdateCommand[] updateCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        if (updateCommands.Length == 0)
            return;
        var lists = await _repository.LoadAsync(updateCommands.Select(cmd => cmd.TodoListId).ToArray(), cancellationToken);
        
        if (lists.Length > 0) {
            var listsToUpdate = new List<TodoList>();
            for(int i = 0; i < updateCommands.Length; i++) {
                var cmd = updateCommands[i];
                var existingList = lists[i];
                if (existingList != null) {
                    // update
                    var list = new TodoList(
                        new TodoListId(existingList.TodoListId.Id),
                        new UserId(existingList.UserId.Id),
                        cmd.Name,
                        cmd.Description,
                        cmd.Color,
                        existingList.CreatedAt,
                        DateTime.UtcNow,
                        existingList.DeletedAt,
                        existingList.TodoItemIds);
                    listsToUpdate.Add(list);
                } else {
                    throw new InvalidOperationException(string.Format("List can't be updated. Model with provided id {0} does not exist.", cmd.TodoListId.Id.ToString()));
                }
            }
            await _repository.UpdateAsync(listsToUpdate, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
        }
    }
}