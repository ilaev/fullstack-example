namespace Eisenhower.Todo.Api.Dto;

public record UserDto(
    Guid id,
    string email,
    string name
    );