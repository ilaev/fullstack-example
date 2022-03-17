
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

        var dbOptions = configuration.GetSection("DbOptions").Get<EisenhowerTodoDbOptions>();
        if (dbOptions is null)
            throw new ArgumentNullException(nameof(dbOptions));

        return new EisenhowerTodoDbContext(NullLoggerFactory.Instance, dbOptions);
    }
}