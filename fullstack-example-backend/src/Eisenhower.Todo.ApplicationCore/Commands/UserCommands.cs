using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class UserCreateCommand 
{
    public UserId UserId { get; private set; }

    public UserCreateCommand(
        Guid userId
    ) {
        this.UserId = new UserId(userId);
    }
}

public class UserReadCommand 
{
    public UserId UserId { get; private set; }

    public UserReadCommand(
        Guid userId
    ) {
        this.UserId = new UserId(userId);
    }
}

public class UserUpdateCommand
{
    public UserId UserId { get; private set; }

    public UserUpdateCommand(
        Guid userId
    ) {
        this.UserId = new UserId(userId);
    }
}

public class UserDeleteCommand
{
    public UserId UserId { get; private set; }

    public UserDeleteCommand(
        Guid userId
    ) {
        this.UserId = new UserId(userId);
    }
}