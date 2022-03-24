
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Eisenhower.Todo.Infrastructure.EF.MigrationStartup;
public class EisenhowerTodoDbContextDesignTimeDbContextFactory : IDesignTimeDbContextFactory<EisenhowerTodoDbContext>
{
public EisenhowerTodoDbContext CreateDbContext(string[] args)
   {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

       
        var host = configuration.GetValue<string>("DbOptions:Host", string.Empty);
        var port = configuration.GetValue<int>("DbOptions:Port", 0);
        var dbName = configuration.GetValue<string>("DbOptions:DatabaseName", string.Empty);
        var userName = configuration.GetValue<string>("DbOptions:UserName", string.Empty);
        var password = configuration.GetValue<string>("DbOptions:Password", string.Empty);
        var defaultSchema = configuration.GetValue<string>("DbOptions:DefaultSchema", string.Empty);
        var pooling = configuration.GetValue<bool>("DbOptions:Pooling", true);
        var minPoolSize = configuration.GetValue<int>("DbOptions:MinPoolSize", -1);
        var maxPoolSize = configuration.GetValue<int>("DbOptions:MaxPoolSize", -1);
        var connectionIdleLifeTime = configuration.GetValue<int>("DbOptions:ConnectionIdleLifeTime", -1);
        var connectionPruningInterval = configuration.GetValue<int>("DbOptions:ConnectionPruningInterval", -1);
        var connectionLifeTime = configuration.GetValue<int>("DbOptions:ConnectionLifetime", -1);
        var keepalive = configuration.GetValue<int>("DbOptions:Keepalive", -1);

        var dbOptions = new EisenhowerTodoDbOptions(
            host,
            port, 
            dbName,
            userName,
            password,
            defaultSchema,
            pooling,
            minPoolSize,
            maxPoolSize,
            connectionIdleLifeTime,
            connectionPruningInterval,
            connectionLifeTime,
            keepalive);

        return new EisenhowerTodoDbContext(NullLoggerFactory.Instance, dbOptions);
    }
}