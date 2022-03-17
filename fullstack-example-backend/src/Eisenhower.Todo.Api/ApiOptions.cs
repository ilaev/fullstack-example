using Eisenhower.Todo.Infrastructure.DI;

namespace Eisenhower.Todo.Api;

public class ApiOptions
{
    // TODO: most of these options have to be set through environment vars on other environments like testing/staging/production
    // some even through a key-vault. But since this is just a prototype, they will come from the appsettings for faster development 
    public DbOptions DbOptions { get; set; }
}

public static class ApiOptionsExtensions
{
    public static EisenhowerTodoAppDIOptions GetAppDependencyInjectionOptions(this ApiOptions apiOptions)
    {
        var result = new EisenhowerTodoAppDIOptions();
        result.DbOptions = apiOptions.DbOptions;
        return result;
    } 
}