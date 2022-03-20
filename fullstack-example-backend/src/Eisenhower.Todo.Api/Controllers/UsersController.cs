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

    public UsersController(
        ILogger<UsersController> logger,
        IUserReadApplicationService userReadApplicationService,
        IUserWriteApplicationService userWriteApplicationService,
        ITodoListReadApplicationService todoListReadApplicationService,
        ITodoItemReadApplicationService todoItemReadApplicationService)
    {
        _logger = logger;
        _userReadApplicationService = userReadApplicationService;
        _userWriteApplicationService = userWriteApplicationService;
        _todoListReadApplicationService = todoListReadApplicationService;
        _todoItemReadApplicationService = todoItemReadApplicationService;
    }

    [HttpGet("@me")]
    public async Task<UserDto> GetCurrentUser()
    {
        var currentUserId = new Guid("5b3a67e2-adad-4582-8e81-115513f6a917"); // define interface ICurrentUserAccessor and implementation in 
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
        var userReadCmd = new UserReadCommand(new Guid("5b3a67e2-adad-4582-8e81-115513f6a917"));
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
        var userReadCmd = new UserReadCommand(new Guid("5b3a67e2-adad-4582-8e81-115513f6a917"));
        // TODO: move into a IUserReadAppicationService later or a combi one.
        var users = await _userReadApplicationService.GetAsync(new UserReadCommand[1] { userReadCmd }, HttpContext.RequestAborted);
        var currentUser = users.First();
        var listReadCmds = currentUser.TodoListIds.Select(lid => new TodoListReadCommand(lid.Id)).ToArray();
        var lists = await _todoListReadApplicationService.GetAsync(listReadCmds, HttpContext.RequestAborted);
        return lists.Select(list => TodoListApiDtoMapper.toApiDto(list)).ToArray();
    }

    [HttpPost(Name = "")]
    public async Task<IActionResult> CreateUser([FromBody] UserDto user)
    {
        var createCmd = new UserCreateCommand(Guid.NewGuid(), "ramil-ilaev@outlook.com", "r.ilaev");
        await _userWriteApplicationService.CreateAsync(new UserCreateCommand[1] { createCmd }, this.HttpContext.RequestAborted);
        return Ok();
    }

}
