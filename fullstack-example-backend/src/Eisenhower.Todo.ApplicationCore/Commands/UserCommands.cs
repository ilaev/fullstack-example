using Eisenhower.Todo.Domain;

namespace Eisenhower.Todo.ApplicationCore.Command;

public class UserWriteCommand 
{
    public UserId UserId { get; private set; }
    public string Email { get; private set; }
    public string Name { get; private set; }

    public UserWriteCommand(
        Guid userId,
        string email,
        string name
    ) {
        this.UserId = new UserId(userId);
        this.Email = email;
        this.Name = name;
    }
}

public class UserCreateCommand : UserWriteCommand
{
    public UserCreateCommand(
        Guid userId,
        string email,
        string name
    ) : base (userId, email, name)
    {

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

public class UserUpdateCommand : UserWriteCommand
{
    public UserUpdateCommand(
        Guid userId,
        string email,
        string name
    ) : base (userId, email, name)
    {
        
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