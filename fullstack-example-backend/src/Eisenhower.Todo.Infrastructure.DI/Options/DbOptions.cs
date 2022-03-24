namespace Eisenhower.Todo.Infrastructure.DI;

public class DbOptions
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string DatabaseName { get; set;}
    public string UserName { get; set; }
    public string Password { get; set; }
    public string DefaultSchema { get; set; }
    public bool Pooling { get; set; }
    public int MinPoolSize { get; set; }
    public int MaxPoolSize { get; set; }
    public int ConnectionIdleLifeTime { get; set; }
    public int ConnectionPruningInterval { get; set; }
    public int ConnectionLifetime { get; set; }
    public int Keepalive { get; set; }
}