using Eisenhower.Todo.ApplicationCore.Service;
using Microsoft.AspNetCore.Mvc;
using Eisenhower.Todo.Api.Dto;
using Eisenhower.Todo.ApplicationCore.Command;

namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IUserReadApplicationService _userReadApplicationService;
    private readonly IUserWriteApplicationService _userWriteApplicationService;
    private readonly ITodoListReadApplicationService _todoListReadApplicationService;
    private readonly ITodoItemReadApplicationService _todoItemReadApplicationService;
    private readonly ITodoListWriteApplicationService _todoListWriteApplicationService;
    private readonly ICurrentUserAccessor _currentUserAccessor;

    public UsersController(
        ILogger<UsersController> logger,
        IUserReadApplicationService userReadApplicationService,
        IUserWriteApplicationService userWriteApplicationService,
        ITodoListReadApplicationService todoListReadApplicationService,
        ITodoItemReadApplicationService todoItemReadApplicationService,
        ITodoListWriteApplicationService todoListWriteApplicationService,
        ICurrentUserAccessor currentUserAccessor)
    {
        _logger = logger;
        _userReadApplicationService = userReadApplicationService;
        _userWriteApplicationService = userWriteApplicationService;
        _todoListReadApplicationService = todoListReadApplicationService;
        _todoItemReadApplicationService = todoItemReadApplicationService;
        _todoListWriteApplicationService = todoListWriteApplicationService;
        _currentUserAccessor = currentUserAccessor;
    }

    [HttpGet("@me")]
    public async Task<UserDto> GetCurrentUser()
    {
        var currentUserId = _currentUserAccessor.GetCurrentUserId(); // define interface ICurrentUserAccessor and implementation in 
        var cmd = new UserReadCommand(currentUserId);
        var users = await _userReadApplicationService.GetAsync(new UserReadCommand[1] { cmd });
        return users.Select(u => UserApiDtoMapper.toApiDto(u)).First();
    }

    // I could load user and a lists of his todolistids , then load the lists and their todoitemids and with those ids load the items
    // or I could add these (/user/{user-id}/items and /user/{user-id}/lists api endpoints and load everything in parallel.
    // maybe it may even make sense to have /user/@me/items and user/@me/lists
    // user/@me/lists/{list-id}/items 
    [HttpGet("@me/items")]
    public async Task<TodoItemDto[]> GetItemsOfUser()
    {
        // TODO: replace with ICurrentUserAccessor to get the guid of the current user
        var userReadCmd = new UserReadCommand(_currentUserAccessor.GetCurrentUserId());
        // TODO: move into a IUserReadAppicationService later or a combi one.
        var users = await _userReadApplicationService.GetAsync(new UserReadCommand[1] { userReadCmd }, HttpContext.RequestAborted);
        var currentUser = users.First();
        var listReadCmds = currentUser.TodoListIds.Select(lid => new TodoListReadCommand(lid.Id)).ToArray();
        var lists = await _todoListReadApplicationService.GetAsync(listReadCmds, HttpContext.RequestAborted);
        var itemReadCmds = lists.SelectMany(list => list.TodoItemIds.Select(tid => new TodoItemReadCommand(tid.Id))).ToArray();
        var items = await _todoItemReadApplicationService.GetAsync(itemReadCmds, HttpContext.RequestAborted);
        return items.Select(item => TodoItemApiDtoMapper.toApiDto(item)).ToArray();
    }


    [HttpGet( "@me/lists")]
    public async Task<TodoListDto[]> GetListsOfUser()
    {
        // TODO: replace with ICurrentUserAccessor to get the guid of the current user
        var userReadCmd = new UserReadCommand(_currentUserAccessor.GetCurrentUserId());
        // TODO: move into a IUserReadAppicationService later or a combi one.
        var users = await _userReadApplicationService.GetAsync(new UserReadCommand[1] { userReadCmd }, HttpContext.RequestAborted);
        var currentUser = users.First();
        var listReadCmds = currentUser.TodoListIds.Select(lid => new TodoListReadCommand(lid.Id)).ToArray();
        var lists = await _todoListReadApplicationService.GetAsync(listReadCmds, HttpContext.RequestAborted);
        return lists.Select(list => TodoListApiDtoMapper.toApiDto(list)).ToArray();
    }

    // TODO: tmp for dev purposes
    [HttpPost(Name = "")]
    public async Task<IActionResult> CreateUser([FromBody] UserDto user)
    {
        // seed initial data -> when a user registers, the default list has to be seeded.
        var createUserCmd = new UserCreateCommand(_currentUserAccessor.GetCurrentUserId(), "ramil-ilaev@moon.com", "r.ilaev");
        await _userWriteApplicationService.CreateAsync(new UserCreateCommand[1] { createUserCmd }, this.HttpContext.RequestAborted);
        var createDefaultListCmd = new TodoListCreateCommand(
            Domain.TodoList.DefaultListGuid,
            createUserCmd.UserId.Id,
            "Default list",
            string.Empty,
            "#2a2a2a");
        await _todoListWriteApplicationService.CreateAsync(new TodoListCreateCommand[1] { createDefaultListCmd }, this.HttpContext.RequestAborted);
        return Ok();
    }

}
