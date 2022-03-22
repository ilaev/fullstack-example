using Eisenhower.Todo.Api.Dto;
using Eisenhower.Todo.ApplicationCore.Command;
using Eisenhower.Todo.ApplicationCore.Service;
using Eisenhower.Todo.Domain;
using Microsoft.AspNetCore.Mvc;
namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("items")]
public class TodoItemsController : ControllerBase
{
    private readonly ILogger<TodoItemsController> _logger;
    private readonly ITodoItemReadApplicationService _todoItemReadApplicationService;
    private readonly ITodoItemWriteApplicationService _todoItemWriteApplicationService;

    public TodoItemsController(
        ILogger<TodoItemsController> logger,
        ITodoItemReadApplicationService todoItemReadApplicationService,
        ITodoItemWriteApplicationService todoItemWriteApplicationService)
    {
        _logger = logger;
        _todoItemReadApplicationService = todoItemReadApplicationService;
        _todoItemWriteApplicationService = todoItemWriteApplicationService;
    }


    [HttpGet("{item-id:guid}")]
    public async Task<ActionResult<TodoItemDto>> GetTodoItems([FromRoute] Guid itemId)
    {
        // TODO: Authentication/Authorization - ICurrentUserAccesor
        var currentUserId = new Guid("5b3a67e2-adad-4582-8e81-115513f6a917");
        var itemReadCmd = new TodoItemReadCommand(itemId);
        // TODO: either adjust load to include user id or place condition into application service? 
        var items = await _todoItemReadApplicationService.GetAsync(new TodoItemReadCommand[1] { itemReadCmd });
        var item = items.First(item => item.UserId.Id == currentUserId);
        if (item is null)
            return Forbid();
        return TodoItemApiDtoMapper.toApiDto(item);
    }

    [HttpPost("")]
    public async Task<IActionResult> CreateTodoItems([FromBody] TodoItemDto[] itemDtos)
    {
        // TODO: Authentication/Authorization 
        var currentUserId = new Guid("5b3a67e2-adad-4582-8e81-115513f6a917");
        var itemCreateCmds = itemDtos.Select(item => new TodoItemCreateCommand(
            Guid.NewGuid(),
            currentUserId,
            item.ListId,
            item.Name,
            (Domain.MatrixX)item.MatrixX,
            (Domain.MatrixY)item.MatrixY,
            item.Note,
            item.MarkedAsDone,
            item.DueDate
        )).ToArray();
        await _todoItemWriteApplicationService.CreateAsync(itemCreateCmds, HttpContext.RequestAborted);
        return Ok();
    }


    [HttpPut("")]
    public async Task<IActionResult> UpdateTodoItems([FromBody] TodoItemDto[] itemDtos)
    {
        // TODO: Authentication/Authorization 
        var currentUserId = new Guid("5b3a67e2-adad-4582-8e81-115513f6a917");
        var itemCreateCmds = itemDtos.Select(item => new TodoItemUpdateCommand(
            item.Id,
            currentUserId,
            item.ListId,
            item.Name,
            (Domain.MatrixX)item.MatrixX,
            (Domain.MatrixY)item.MatrixY,
            item.Note,
            item.MarkedAsDone,
            item.DueDate
        )).ToArray();
        await _todoItemWriteApplicationService.UpdateAsync(itemCreateCmds, HttpContext.RequestAborted);
        return Ok();
    }
}
