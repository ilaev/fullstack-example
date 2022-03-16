namespace Eisenhower.Todo.Api.DTO;

public record TodoList(
    Guid id,
    string name,
    string description,
    DateTime createdAt,
    DateTime modifiedAt,
    DateTime? deletedAt,
    string color
);