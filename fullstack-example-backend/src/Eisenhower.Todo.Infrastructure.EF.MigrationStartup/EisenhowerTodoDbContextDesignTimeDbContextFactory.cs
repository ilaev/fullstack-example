
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Logging.Abstractions;
using Npgsql;

namespace Eisenhower.Todo.Infrastructure.EF.MigrationStartup;
public class EisenhowerTodoDbContextDesignTimeDbContextFactory : IDesignTimeDbContextFactory<EisenhowerTodoDbContext>
{
public EisenhowerTodoDbContext CreateDbContext(string[] args)
   {
        //   var configuration = new ConfigurationBuilder()
        //        .SetBasePath(Directory.GetCurrentDirectory())
        //        .AddJsonFile("appsettings.json")
        //        .Build();

        var dbContextBuilder = new DbContextOptionsBuilder();

        //   var connectionString = configuration
        //               .GetConnectionString("SqlConnectionString");


        // dbContextBuilder.UseNpgsql(npgsqlConnectionStringBuilder.ToString(), (options) => {
        //     options.EnableRetryOnFailure(3);
        // });  
        var dbOptions = new EisenhowerTodoDbOptions();
        return new EisenhowerTodoDbContext(NullLoggerFactory.Instance, dbOptions);
    }
}