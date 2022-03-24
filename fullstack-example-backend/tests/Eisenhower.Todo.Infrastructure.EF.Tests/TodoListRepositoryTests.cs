using NUnit.Framework;
using Eisenhower.Todo.Infrastructure.EF;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Data.Common;
using Microsoft.Data.Sqlite;
using Eisenhower.Todo.Domain;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Eisenhower.Todo.Infrastructure.EF.Tests;

public class TodoListRepositoryTests : IDisposable
{
    private DbConnection _connection;
    private  DbContextOptions<EisenhowerTodoDbContext> _contextOptions;
    private EisenhowerTodoDbContext _inmemorySqlLiteDbContext;
    private TodoListRepository _testSubject;
    private bool disposedValue;
    [SetUp]
    public void Setup()
    {

        // Create and open a connection. This creates the SQLite in-memory database, which will persist until the connection is closed
        // at the end of the test (see Dispose below).
        _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();

        // These options will be used by the context instances in this test suite, including the connection opened above.
        _contextOptions = new DbContextOptionsBuilder<EisenhowerTodoDbContext>()
            .UseLoggerFactory(NullLoggerFactory.Instance)
            .UseSqlite(_connection)
            .Options;

        var eisenhowerTodoDbOptions = new EisenhowerTodoDbOptions("whatever",
        1, "SqlLite", "does not matter", "whatever", "public", true, 10, 10, 30, 10, 10, 0
        );
        _inmemorySqlLiteDbContext = new EisenhowerTodoDbContext(NullLoggerFactory.Instance, _contextOptions, eisenhowerTodoDbOptions);

        _inmemorySqlLiteDbContext.Database.EnsureCreated();

        _testSubject = new TodoListRepository(_inmemorySqlLiteDbContext);
    }

    [Test]
    public void Should_Create()
    {
        Assert.IsNotNull(_testSubject);
    }

    [Test]
    public async Task Should_Get_TodoList()
    {
        // arrange
        var userId = Guid.NewGuid();
        _inmemorySqlLiteDbContext.Users.Add(
            new Entities.User(0, userId, "test@test", "tester", DateTime.UtcNow, DateTime.UtcNow, new List<Entities.TodoList>())
        );
        _inmemorySqlLiteDbContext.SaveChanges();


        var listId = Guid.NewGuid();
        var listEntity = new Entities.TodoList(0, listId, "Test", "note", "#ffffff", DateTime.UtcNow, DateTime.UtcNow, null, new Entities.TodoItem[0]);
        var userEntity = await _inmemorySqlLiteDbContext.Users.FirstAsync();
        listEntity.User = userEntity;
        listEntity.UserDbId = userEntity.DbId;
        _inmemorySqlLiteDbContext.TodoLists.Add(
            listEntity
        );
        _inmemorySqlLiteDbContext.SaveChanges();

        // act
        var idsToLoad = new TodoListId[1]{ new TodoListId(listId) };
        var result = await _testSubject.LoadAsync(idsToLoad);
        // assert
        Assert.AreEqual(listId, result[0].TodoListId.Id);
        Assert.AreEqual("Test", result[0].Name);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!disposedValue)
        {
            if (disposing)
            {
                // TODO: dispose managed state (managed objects)
                if (_inmemorySqlLiteDbContext is not null)
                    _inmemorySqlLiteDbContext.Dispose();
                if (_connection is not null) {
                    _connection.Close();
                    _connection.Dispose();
                }   
                    
            }

            // TODO: free unmanaged resources (unmanaged objects) and override finalizer
            // TODO: set large fields to null
            disposedValue = true;
        }
    }

    // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
    // ~TodoListRepositoryTests()
    // {
    //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
    //     Dispose(disposing: false);
    // }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
}