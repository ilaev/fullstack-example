using Eisenhower.Todo.ApplicationCore.Service;
using Microsoft.AspNetCore.Mvc;
namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoItemController : ControllerBase
{
    private readonly ILogger<TodoItemController> _logger;
    private readonly ITodoItemReadApplicationService _todoItemReadApplicationService;

    public TodoItemController(
        ILogger<TodoItemController> logger,
        ITodoItemReadApplicationService todoItemReadApplicationService)
    {
        _logger = logger;
        _todoItemReadApplicationService = todoItemReadApplicationService;
    }

    [HttpGet(Name = "user/{user-id:guid}")]
    public string GetAllItemsOfUser()
    {
        return string.Empty;
    }
}
