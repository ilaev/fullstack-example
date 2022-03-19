

namespace Eisenhower.Todo.Api.Dto;

public static class TodoListApiDtoMapper 
{
    public static TodoListDto toApiDto(Domain.TodoList list)
    {
        return new TodoListDto(
            list.TodoListId.Id,
            list.Name,
            list.Description,
            list.CreatedAt,
            list.ModifiedAt,
            list.DeletedAt,
            list.Color);
    }
}