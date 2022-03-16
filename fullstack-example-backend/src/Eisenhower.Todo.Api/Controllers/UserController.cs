using Eisenhower.Todo.ApplicationCore.Service;
using Microsoft.AspNetCore.Mvc;
using Eisenhower.Todo.Api.DTO;

namespace Eisenhower.Todo.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserReadApplicationService _userReadApplicationService;

    public UserController(
        ILogger<UserController> logger,
        IUserReadApplicationService userReadApplicationService)
    {
        _logger = logger;
        _userReadApplicationService = userReadApplicationService;
    }

    [HttpGet(Name = "@me")]
    public UserDTO Get()
    {
        return new UserDTO(Guid.Empty, string.Empty, string.Empty, DateTime.Today, DateTime.Today);
    }
}
