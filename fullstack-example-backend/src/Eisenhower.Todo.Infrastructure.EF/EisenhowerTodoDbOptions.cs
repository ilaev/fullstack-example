namespace Eisenhower.Todo.Infrastructure.EF;

public class EisenhowerTodoDbOptions 
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string DatabaseName { get; set;}
    public string UserName { get; set; }
    public string Password { get; set; }
    public bool Pooling { get; set; }
    public int MinPoolSize { get; set; }
    public int MaxPoolSize { get; set; }
    public int ConnectionIdleLifeTime { get; set; }
    public int ConnectionPruningInterval { get; set; }
    public int ConnectionLifetime { get; set; }
    public int Keepalive { get; set; }

    public EisenhowerTodoDbOptions() {
        this.Host = "localhost";
        this.Port = 5432;
        this.DatabaseName = "EisenhowerTodo";
        this.UserName = "postgres";
        this.Password = "easypass1234";
        this.Pooling = true;
        this.MinPoolSize = 10;
        this.MaxPoolSize = 20;
        this.ConnectionIdleLifeTime = 30;
        this.ConnectionPruningInterval = 20;
        this.ConnectionLifetime = 0; // disabled
        this.Keepalive = 10;

    }
}