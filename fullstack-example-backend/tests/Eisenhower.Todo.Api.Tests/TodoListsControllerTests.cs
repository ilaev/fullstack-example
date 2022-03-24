using NUnit.Framework;
using Eisenhower.Todo.Api.Controllers;
using Moq;
using Microsoft.Extensions.Logging;
using Eisenhower.Todo.ApplicationCore.Service;
using System;
using System.Threading.Tasks;
using Eisenhower.Todo.Api.Dto;
using Eisenhower.Todo.ApplicationCore.Command;
using System.Threading;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Eisenhower.Todo.Api.Tests;

public class TodoListsControllerTests
{
    private Mock<ILogger<TodoListsController>> _mockLogger;
    private Mock<ITodoListReadApplicationService> _mockReadTodoListApplicationService;
    private Mock<ITodoListWriteApplicationService> _mockWriteTodoListApplicationService;
    private Mock<ICurrentUserAccessor> _mockCurrentUserAccessor;
    private TodoListsController _testSubject;
    [SetUp]
    public void Setup()
    {
        _mockLogger = new Mock<ILogger<TodoListsController>>();
        _mockReadTodoListApplicationService = new Mock<ITodoListReadApplicationService>();
        _mockWriteTodoListApplicationService = new Mock<ITodoListWriteApplicationService>();
        _mockCurrentUserAccessor = new Mock<ICurrentUserAccessor>();
        _mockCurrentUserAccessor.Setup(ua => ua.GetCurrentUserId()).Returns(new Guid("5b3a67e2-adad-4582-8e81-115513f6a917"));
        _testSubject = new TodoListsController(
            _mockLogger.Object,
            _mockReadTodoListApplicationService.Object,
            _mockWriteTodoListApplicationService.Object,
            _mockCurrentUserAccessor.Object
        );
    }

    [Test]
    public void Should_Create_Controller()
    {
        Assert.IsNotNull(_testSubject);
    }

    [Test]
    public async Task Should_Return_TodoList()
    {
        // arrange
        var todoListId = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;
        var modifiedAt = DateTime.UtcNow;
        var todoList = new Domain.TodoList(new Domain.TodoListId(todoListId), new Domain.UserId(_mockCurrentUserAccessor.Object.GetCurrentUserId()), "list1", "description", "#ffffff", createdAt, modifiedAt, null, new Domain.TodoItemId[0]);
        _mockReadTodoListApplicationService.Setup(s => s.GetAsync(It.IsAny<TodoListReadCommand[]>(), It.IsAny<CancellationToken>()).Result).Returns(new Domain.TodoList[1] { todoList });
        // act
        var result = await _testSubject.GetTodoList(todoListId);
        // assert
        var expectedListDto = new TodoListDto(todoListId, "list1", "description", createdAt, modifiedAt, null, "#ffffff");
        Assert.AreEqual(expectedListDto, result.Value);
    }

    [Test]
    public async Task Should_Create_TodoLists()
    {
        // arrange
        var todoListId = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;
        var modifiedAt = DateTime.UtcNow;
        var listDto = new TodoListDto(todoListId, "list1", "description", createdAt, modifiedAt, null, "#ffffff");

        var httpContext = new DefaultHttpContext();
        var controllerContext = new ControllerContext()
        {
            HttpContext = httpContext,
        };
        _testSubject.ControllerContext = controllerContext;
        var expectedCreateCmd = new TodoListCreateCommand(todoListId, _mockCurrentUserAccessor.Object.GetCurrentUserId(), "list1", "description", "#ffffff");
        var expectedCmds = new TodoListCreateCommand[1] { expectedCreateCmd };
        TodoListCreateCommand[] createCmdParam = null;
        _mockWriteTodoListApplicationService.Setup(wap => wap.CreateAsync(It.IsAny<TodoListCreateCommand[]>(), It.IsAny<CancellationToken>())).Callback<TodoListCreateCommand[], CancellationToken>( (cmds, token) => {
            createCmdParam = cmds;
        }).Returns(Task.CompletedTask).Verifiable();
        
        // act
        await _testSubject.CreateTodoLists(new TodoListDto[1] { listDto });

        // assert
        // TODO: adjust test when Guid.NewGuid() has been removed from the controller
        _mockWriteTodoListApplicationService.Verify(wap => wap.CreateAsync(It.IsAny<TodoListCreateCommand[]>(), It.Is<CancellationToken>(p => p.Equals(httpContext.RequestAborted))), Times.Once);

    }

    [Test]
    public async Task Should_Update_TodoLists()
    {
        // arrange
        var todoListId = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;
        var modifiedAt = DateTime.UtcNow;
        var listDto = new TodoListDto(todoListId, "list1", "description", createdAt, modifiedAt, null, "#ffffff");

        var httpContext = new DefaultHttpContext();
        var controllerContext = new ControllerContext()
        {
            HttpContext = httpContext,
        };
        _testSubject.ControllerContext = controllerContext;
        var expectedCreateCmd = new TodoListUpdateCommand(todoListId, _mockCurrentUserAccessor.Object.GetCurrentUserId(), "list1", "description", "#ffffff");
        var expectedCmds = new TodoListUpdateCommand[1] { expectedCreateCmd };
        _mockWriteTodoListApplicationService.Setup(wap => wap.UpdateAsync(It.IsAny<TodoListUpdateCommand[]>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask).Verifiable();
        
        // act
        await _testSubject.UpdateTodoLists(new TodoListDto[1] { listDto });

        // assert
        _mockWriteTodoListApplicationService.Verify(wap => wap.UpdateAsync(It.Is<TodoListUpdateCommand[]>(p => p.SequenceEqual(expectedCmds)), It.Is<CancellationToken>(p => p.Equals(httpContext.RequestAborted))), Times.Once);

    }
}