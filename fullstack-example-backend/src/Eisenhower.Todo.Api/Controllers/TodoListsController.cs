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
    private readonly ITodoListWriteApplicationService _todoListWriteApplicationService;
    private readonly ICurrentUserAccessor _currentUserAccessor;

    public TodoListsController(
        ILogger<TodoListsController> logger,
        ITodoListReadApplicationService todoListReadApplicationService,
        ITodoListWriteApplicationService todoListWriteApplicationService,
        ICurrentUserAccessor currentUserAccessor)
    {
        _logger = logger;
        _todoListReadApplicationService = todoListReadApplicationService;
        _todoListWriteApplicationService = todoListWriteApplicationService;
        _currentUserAccessor = currentUserAccessor;
    }

    [HttpGet("{list-id:guid}")]
    public async Task<ActionResult<TodoListDto>> GetTodoList([FromRoute] Guid listId)
    {
        // TODO: Authentication/Authorization - ICurrentUserAccesor
        var currentUserId = _currentUserAccessor.GetCurrentUserId();
        var listReadCmd = new TodoListReadCommand(listId);
        // TODO: either adjust load to include user id or place condition into application service? 
        var lists = await _todoListReadApplicationService.GetAsync(new TodoListReadCommand[1] { listReadCmd });
        var list = lists.First(list => list.UserId.Id == currentUserId);
        if (list is null)
            return Forbid();
        return TodoListApiDtoMapper.toApiDto(list);
    }

    [HttpPost("")]
    public async Task<IActionResult> CreateTodoLists([FromBody] TodoListDto[] listDtos)
    {
        // TODO: Authentication/Authorization 
        var currentUserId = _currentUserAccessor.GetCurrentUserId();
        var listCreateCmds = listDtos.Select(listDto => new TodoListCreateCommand(
            Guid.NewGuid(), // TODO: move to app service
            currentUserId,
            listDto.Name,
            listDto.Description,
            listDto.Color
            )).ToArray();
        await _todoListWriteApplicationService.CreateAsync(listCreateCmds, HttpContext.RequestAborted);
        return Ok();
    }


    [HttpPut("")]
    public async Task<IActionResult> UpdateTodoLists([FromBody] TodoListDto[] listDtos)
    {
        // TODO: Authentication/Authorization 
        var currentUserId = _currentUserAccessor.GetCurrentUserId();
        var listUpdateCmds = listDtos.Select(listDto => new TodoListUpdateCommand(
            listDto.Id == Guid.Empty ? Guid.NewGuid() : listDto.Id, // TODO: move to app service
            currentUserId,
            listDto.Name,
            listDto.Description,
            listDto.Color
        )).ToArray();
        await _todoListWriteApplicationService.UpdateAsync(listUpdateCmds, HttpContext.RequestAborted);
        return Ok();
    }
}
