using NUnit.Framework;
using Moq;
using Microsoft.Extensions.Logging;
using Eisenhower.Todo.ApplicationCore.Service;
using Eisenhower.Todo.Domain;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Eisenhower.Todo.ApplicationCore.Command;

namespace Eisenhower.Todo.ApplicationCore.Tests;

public class TodoListApplicationServiceTests
{
    private Mock<ILogger<TodoListApplicationService>> _mockLogger;
    private Mock<IUnitOfWork> _mockUnitOfWork;
    private Mock<ITodoListRepository> _mockTodoListRepository;
    private TodoListApplicationService _testSubject;

    [SetUp]
    public void Setup()
    {
        _mockLogger = new Mock<ILogger<TodoListApplicationService>>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockUnitOfWork.Setup(uof => uof.CommitAsync(It.IsAny<CancellationToken>())).Returns(Task.CompletedTask).Verifiable();
        _mockTodoListRepository = new Mock<ITodoListRepository>();
        _mockTodoListRepository.Setup(repo => repo.AddAsync(It.IsAny<IEnumerable<TodoList>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask).Verifiable();
        _mockTodoListRepository.Setup(repo => repo.RemoveAsync(It.IsAny<IEnumerable<TodoList>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask).Verifiable();
         _mockTodoListRepository.Setup(repo => repo.UpdateAsync(It.IsAny<IEnumerable<TodoList>>(), It.IsAny<CancellationToken>())).Returns(Task.CompletedTask).Verifiable();
        
        _testSubject = new TodoListApplicationService(
            _mockLogger.Object,
            _mockUnitOfWork.Object,
            _mockTodoListRepository.Object
        );
    }

    [Test]
    public void Should_Create()
    {
        Assert.IsNotNull(_testSubject);
    }

    [Test]
    public async Task Should_Get_TodoLists()
    {
        // arrange
        var todoListId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;
        var modifiedAt = DateTime.UtcNow;
        var existingLists = new TodoList[1] { new Domain.TodoList(new TodoListId(todoListId), new UserId(userId), "list#1", "test", "#ffffff", createdAt, modifiedAt, null, new TodoItemId[0]) };

        _mockTodoListRepository.Setup(repo => repo.LoadAsync(It.IsAny<IEnumerable<TodoListId>>(), It.IsAny<CancellationToken>()).Result).Returns(existingLists).Verifiable();
        var readCmd = new TodoListReadCommand(todoListId);
        // act
        var result = await _testSubject.GetAsync(new TodoListReadCommand[1] { readCmd });
        // assert
        Assert.AreEqual(1, result.Length);
        Assert.AreEqual(existingLists[0], result[0]);
    }

    // TODO: add other missing tests


}