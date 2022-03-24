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

    public async Task CreateAsync(UserCreateCommand[] createCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(createCommands.Select(c => c.UserId).ToArray(), cancellationToken);
        var invalidExistingIds = createCommands.Where(cmd => dictOfExistingKeys[cmd.UserId]).ToArray();
        if (invalidExistingIds.Length > 0)
        { 
            throw new InvalidOperationException(string.Format("Users can't be created because you provided some existing ids: {0}", invalidExistingIds.ToString()));
        }
        var usersToAdd = createCommands.Select(cmd => new User(
            new UserId(cmd.UserId.Id),
            cmd.Email,
            cmd.Name,
            DateTime.UtcNow,
            DateTime.UtcNow,
            new TodoListId[0]
            )).ToArray();
        await _repository.AddAsync(usersToAdd, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
    }

    public async Task DeleteAsync(UserDeleteCommand[] deleteCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        var dictOfExistingKeys = await _repository.ExistsAsync(deleteCommands.Select(cmd => cmd.UserId).ToArray(), cancellationToken);
        var keysOfExistingToDelete = deleteCommands.Where(cmd => dictOfExistingKeys[cmd.UserId]).Select(cmd => cmd.UserId).ToArray();
        await _repository.RemoveAsync(keysOfExistingToDelete, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
    }

    public Task<User[]> GetAsync(UserReadCommand[] readCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        return _repository.LoadAsync(readCommands.Select(cmd => cmd.UserId).ToArray(), cancellationToken);
    }

    public async Task UpdateAsync(UserUpdateCommand[] updateCommands, CancellationToken cancellationToken = default(CancellationToken))
    {
        if (updateCommands.Length == 0)
            return;
        var users = await _repository.LoadAsync(updateCommands.Select(cmd => cmd.UserId).ToArray(), cancellationToken);
        
        if (users.Length > 0) {
            var usersToUpdate = new List<User>();
            for(int i = 0; i < updateCommands.Length; i++) {
                var cmd = updateCommands[i];
                var existingUser = users[i];
                if (existingUser != null) {
                    // update
                    var list = new User(
                        new UserId(existingUser.UserId.Id),
                        cmd.Email,
                        cmd.Name,
                        existingUser.CreatedAt,
                        DateTime.UtcNow,
                        existingUser.TodoListIds
                        );

                    usersToUpdate.Add(list);
                } else {
                    throw new InvalidOperationException(string.Format("User can't be updated. Model with provided id {0} does not exist.", cmd.UserId.Id.ToString()));
                }
            }
            await _repository.UpdateAsync(usersToUpdate, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);
        }
    }
}