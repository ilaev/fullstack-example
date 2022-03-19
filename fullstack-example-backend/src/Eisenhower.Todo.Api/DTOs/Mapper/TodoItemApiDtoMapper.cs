

namespace Eisenhower.Todo.Api.Dto;

public static class TodoItemApiDtoMapper 
{
    public static TodoItemDto toApiDto(Domain.TodoItem item)
    {
        return new TodoItemDto(
            item.TodoItemId.Id,
            item.TodoListId.Id,
            item.Name,
            (Api.Dto.MatrixX)item.MatrixX,
            (Api.Dto.MatrixY)item.MatrixY,
            item.Note,
            item.DueDate,
            item.CreatedAt,
            item.ModifiedAt,
            item.DeletedAt,
            item.MarkedAsDone);
    }
}