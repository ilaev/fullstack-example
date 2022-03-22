namespace Eisenhower.Todo.Api.Dto;

public record TodoListDto(
    Guid Id,
    string Name,
    string Description,
    DateTime CreatedAt,
    DateTime ModifiedAt,
    DateTime? DeletedAt,
    string Color
);