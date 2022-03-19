using Eisenhower.Todo.Api.Dto;
using Eisenhower.Todo.ApplicationCore.Service;
using Microsoft.AspNetCore.Mvc;
namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("items")]
public class TodoItemsController : ControllerBase
{
    private readonly ILogger<TodoItemsController> _logger;
    private readonly ITodoItemReadApplicationService _todoItemReadApplicationService;

    public TodoItemsController(
        ILogger<TodoItemsController> logger,
        ITodoItemReadApplicationService todoItemReadApplicationService)
    {
        _logger = logger;
        _todoItemReadApplicationService = todoItemReadApplicationService;
    }


    [HttpGet("{item-id:guid}")]
    public string GetTodoItems([FromRoute] Guid itemId)
    {
        // localhost:44444/todoitem/items
        return string.Empty;
    }

    [HttpPost("")]
    public string CreateTodoItems([FromBody] TodoItemDto[] items)
    {
        // localhost:44444/todoitem/items
        return string.Empty;
    }


    [HttpPut("")]
    public string UpdateTodoItems([FromBody] TodoItemDto[] items)
    {
        // localhost:44444/todoitem/items
        return string.Empty;
    }
}
