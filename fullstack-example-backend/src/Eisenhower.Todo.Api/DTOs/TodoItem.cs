namespace Eisenhower.Todo.Api.Dto;

public record TodoItemDto(
    Guid id,
    Guid listId,
    string name,
    MatrixX matrixX,
    MatrixY matrixY,
    string note,
    DateTime? dueDate,
    DateTime createdAt,
    DateTime modifiedAt,
    DateTime? deletedAt,
    bool markedAsDone
);