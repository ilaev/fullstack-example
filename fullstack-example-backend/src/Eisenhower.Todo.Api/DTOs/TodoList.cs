namespace Eisenhower.Todo.Api.Dto;

public record TodoListDto(
    Guid id,
    string name,
    string description,
    DateTime createdAt,
    DateTime modifiedAt,
    DateTime? deletedAt,
    string color
);