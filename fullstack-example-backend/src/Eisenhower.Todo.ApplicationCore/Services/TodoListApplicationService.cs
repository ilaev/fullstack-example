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
        var todoListToAdd = nonExistingCreateCmds.Select(cmd => new TodoList(new TodoListId(cmd.TodoListId.Id), null)).ToArray();
        await _repository.AddAsync(todoListToAdd);
        await _unitOfWork.CommitAsync();
        // TODO: throw expection if one object exists ? or have some kind of CreateTodoItemResult ?
        // if result
    }

    public async Task DeleteAsync(params TodoListDeleteCommand[] deleteCommands)
    {
        var existingLists = await _repository.LoadAsync(deleteCommands.Select(cmd => cmd.TodoListId).ToArray());
        var nonNullExistingLists = existingLists.Where(list => list is not null).ToDictionary(keySelector => keySelector.TodoListId);
        var keysOfInvalidDeleteCmds = deleteCommands.Where(cmd => !nonNullExistingLists.ContainsKey(cmd.TodoListId)).Select(cmd => cmd.TodoListId).ToArray();
        // TODO: Could return result or throw if cmd is invalid. Need a decision on a concept soon since this question pops up everywhere.
        var listsToDelete = new List<TodoList>(nonNullExistingLists.Count);

        foreach(var existingList in nonNullExistingLists)
        {
            // delete through "soft-delete" by settng deletedAt datetime
            var listToDelete = new TodoList(
                new TodoListId(existingList.Value.TodoListId.Id),
                DateTime.UtcNow);
            listsToDelete.Add(listToDelete);
        }

        await _repository.RemoveAsync(listsToDelete);
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
                    var list = new TodoList(new TodoListId(existingList.TodoListId.Id), existingList.DeletedAt); // TODO: update relevant properties by creating a new object with the same id
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