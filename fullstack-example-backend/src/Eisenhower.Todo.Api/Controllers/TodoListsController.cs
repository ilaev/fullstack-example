using Eisenhower.Todo.Api.Dto;
using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.ApplicationCore.Service;
using Microsoft.AspNetCore.Mvc;

namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("lists")]
public class TodoListsController : ControllerBase
{
    private readonly ILogger<TodoListsController> _logger;
    private readonly ITodoListReadApplicationService _todoListReadApplicationService;

    public TodoListsController(
        ILogger<TodoListsController> logger,
        ITodoListReadApplicationService todoListReadApplicationService)
    {
        _logger = logger;
        _todoListReadApplicationService = todoListReadApplicationService;
    }

    [HttpGet("{list-id:guid}")]
    public async Task<ActionResult<TodoListDto>> GetTodoList([FromRoute] Guid listId)
    {
        // TODO: Authentication/Authorization - ICurrentUserAccesor
        var userReadCmd = new UserReadCommand(new Guid("5b3a67e2-adad-4582-8e81-115513f6a917"));
        var listReadCmd = new TodoListReadCommand(listId);
        // TODO: either adjust load to include user id or place condition into application service? 
        var lists = await _todoListReadApplicationService.GetAsync(new TodoListReadCommand[1] { listReadCmd });
        var list = lists.First(list => list.UserId.Id == userReadCmd.UserId.Id);
        if (list is null)
            return Forbid();
        return TodoListApiDtoMapper.toApiDto(list);
    }

    [HttpPost("")]
    public string CreateTodoLists([FromBody] TodoListDto[] lists)
    {
        return string.Empty;
    }


    [HttpPut("")]
    public string UpdateTodoLists([FromBody] TodoListDto[] lists)
    {
        // localhost:44444/todoitem/items
        return string.Empty;
    }
}
