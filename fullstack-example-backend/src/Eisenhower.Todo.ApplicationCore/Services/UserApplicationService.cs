using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.Domain;
using Microsoft.Extensions.Logging;

namespace Eisenhower.Todo.ApplicationCore.Service;

public class UserApplicationService : IUserReadApplicationService, IUserWriteApplicationService
{
    private readonly ILogger<UserApplicationService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRepository _repository;

    public UserApplicationService(
        ILogger<UserApplicationService> logger,
        IUnitOfWork unitOfWork,
        IUserRepository repository
    ) {
        this._logger = logger;
        this._unitOfWork = unitOfWork;
        this._repository = repository;
    }

    public async Task CreateAsync(params UserCreateCommand[] createCommands)
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(createCommands.Select(c => c.UserId).ToArray());
        var nonExistingCreateCmds = createCommands.Where(c => !dictOfExistingKeys[c.UserId]).ToArray();
        var usersToAdd = nonExistingCreateCmds.Select(cmd => new User(new UserId(cmd.UserId.Id))).ToArray();
        await _repository.AddAsync(usersToAdd);
        await _unitOfWork.CommitAsync();
        // TODO: throw expection if one object exists ? or have some kind of CreateTodoItemResult ?
        // if result
    }

    public async Task DeleteAsync(params UserDeleteCommand[] deleteCommands)
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(deleteCommands.Select(cmd => cmd.UserId).ToArray());
        var keysOfExistingToDelete = deleteCommands.Where(cmd => dictOfExistingKeys[cmd.UserId]).Select(cmd => cmd.UserId).ToArray();
        await _repository.RemoveAsync(keysOfExistingToDelete);
        await _unitOfWork.CommitAsync();
    }

    public Task GetAsync(params UserReadCommand[] readCommands)
    {
        return _repository.LoadAsync(readCommands.Select(cmd => cmd.UserId).ToArray());
    }

    public async Task UpdateAsync(params UserUpdateCommand[] updateCommands)
    {
        if (updateCommands.Length == 0)
            return;
        var users = await _repository.LoadAsync(updateCommands.Select(cmd => cmd.UserId).ToArray());
        
        if (users.Length > 0) {
            var usersToUpdate = new List<User>();
            for(int i = 0; i < updateCommands.Length; i++) {
                var cmd = updateCommands[i];
                var existingUser = users[i];
                if (existingUser != null) {
                    // update
                    var list = new User(new UserId(existingUser.UserId.Id)); // TODO: update relevant properties by creating a new object with the same id
                    usersToUpdate.Add(list);
                } else {
                    // err case, no item to update
                }
            }
            await _repository.UpdateAsync(usersToUpdate);
            await _unitOfWork.CommitAsync();
        }
    }
}