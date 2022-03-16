namespace Eisenhower.Todo.Api.DTO;

public record UserDTO(
    Guid id,
    string email,
    string name,
    DateTime createdAt,
    DateTime modifiedAt
    );