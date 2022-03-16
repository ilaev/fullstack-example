using Eisenhower.Todo.Infrastructure.EF.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace Eisenhower.Todo.Infrastructure.EF;

public class EisenhowerTodoDbContext : DbContext 
{
    private readonly ILoggerFactory _loggerFactory;
    private readonly EisenhowerTodoDbOptions _options;
    public DbSet<TodoItem> TodoItems { get; set;}
    public DbSet<TodoList> TodoLists { get; set; }
    public DbSet<User> Users { get; set; }

    public EisenhowerTodoDbContext(
        ILoggerFactory loggerFactory,
        EisenhowerTodoDbOptions options
    ): base() {
        _loggerFactory = loggerFactory;
        _options = options;
    }

    private string GetNpgsqlConnectionString() 
    {
        var npgsqlConnectionStringBuilder = new NpgsqlConnectionStringBuilder();
        npgsqlConnectionStringBuilder.Username = _options.UserName;
        npgsqlConnectionStringBuilder.Password = _options.Password;
        npgsqlConnectionStringBuilder.ApplicationName = "EisenhowerTodo";
        npgsqlConnectionStringBuilder.ConnectionIdleLifetime = _options.ConnectionIdleLifeTime;
        npgsqlConnectionStringBuilder.ConnectionLifetime = _options.ConnectionLifetime;
        npgsqlConnectionStringBuilder.ConnectionPruningInterval = _options.ConnectionPruningInterval;
        npgsqlConnectionStringBuilder.Database = _options.DatabaseName;
        npgsqlConnectionStringBuilder.Host = _options.Host;
        npgsqlConnectionStringBuilder.KeepAlive = _options.Keepalive;
        npgsqlConnectionStringBuilder.MaxPoolSize = _options.MaxPoolSize;
        npgsqlConnectionStringBuilder.MinPoolSize = _options.MinPoolSize;
        npgsqlConnectionStringBuilder.Pooling = _options.Pooling;
        npgsqlConnectionStringBuilder.Port = _options.Port;
        return npgsqlConnectionStringBuilder.ToString();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) 
    {
        optionsBuilder.UseLoggerFactory(_loggerFactory);  
        optionsBuilder.UseNpgsql(this.GetNpgsqlConnectionString(), optionsAction => { 
            optionsAction.EnableRetryOnFailure(3);
        });
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EntityTypeConfigurationUser).Assembly);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EntityTypeConfigurationTodoList).Assembly);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EntityTypeConfigurationTodoItem).Assembly);
    }
}

