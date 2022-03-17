namespace Eisenhower.Todo.Domain;


public class User 
{
// think about user something like DisplayName class instead of name
    public UserId UserId { get; private set; }

    public User(
        UserId id
    ) {
        this.UserId = id;
    }
}