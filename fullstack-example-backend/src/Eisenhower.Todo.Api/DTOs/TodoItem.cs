namespace Eisenhower.Todo.Api.Dto;

public record TodoItemDto(
    Guid Id,
    Guid ListId,
    string Name,
    MatrixX MatrixX,
    MatrixY MatrixY,
    string Note,
    DateTime? DueDate,
    DateTime CreatedAt,
    DateTime ModifiedAt,
    DateTime? DeletedAt,
    bool MarkedAsDone
);