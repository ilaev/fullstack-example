using Eisenhower.Todo.ApplicationCore.Service;
using Microsoft.AspNetCore.Mvc;

namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoListController : ControllerBase
{
    private readonly ILogger<TodoListController> _logger;
    private readonly ITodoListReadApplicationService _todoListReadApplicationService;

    public TodoListController(
        ILogger<TodoListController> logger,
        ITodoListReadApplicationService todoListReadApplicationService)
    {
        _logger = logger;
        _todoListReadApplicationService = todoListReadApplicationService;
    }

    [HttpGet(Name = "")]
    public string GetListsOfUser()
    {
        return string.Empty;
    }
}
