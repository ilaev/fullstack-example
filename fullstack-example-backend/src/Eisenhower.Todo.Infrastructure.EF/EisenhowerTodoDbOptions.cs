namespace Eisenhower.Todo.Infrastructure.EF;

public class EisenhowerTodoDbOptions 
{
    public string Host { get; private set; }
    public int Port { get; private set; }
    public string DatabaseName { get; private set;}
    public string UserName { get; private set; }
    public string Password { get; private set; }
    public string DefaultSchema { get; private set; }
    public bool Pooling { get; private set; }
    public int MinPoolSize { get; private set; }
    public int MaxPoolSize { get; private set; }
    public int ConnectionIdleLifeTime { get; private set; }
    public int ConnectionPruningInterval { get; private set; }
    public int ConnectionLifetime { get; private set; }
    public int Keepalive { get; private set; }

    public EisenhowerTodoDbOptions(
        string host,
        int port,
        string databaseName,
        string userName,
        string password,
        string defaultSchema,
        bool pooling,
        int minPoolSize,
        int maxPoolSize,
        int connectionIdleLifeTime,
        int connectionPruningInterval,
        int connectionLifeTime,
        int keepalive
    ) {
        if (string.IsNullOrEmpty(host))
            throw new ArgumentNullException(nameof(host));
        if (string.IsNullOrEmpty(databaseName))
            throw new ArgumentNullException(nameof(databaseName));
        if (string.IsNullOrEmpty(userName))
            throw new ArgumentNullException(nameof(userName));
        if (string.IsNullOrEmpty(defaultSchema))
            throw new ArgumentNullException(nameof(defaultSchema));
        if (port < 0)
            throw new ArgumentOutOfRangeException(nameof(port));
        if (minPoolSize < 0)
            throw new ArgumentOutOfRangeException(nameof(minPoolSize));
        if (maxPoolSize < 0)
            throw new ArgumentOutOfRangeException(nameof(maxPoolSize));
        if (connectionIdleLifeTime < 0)
            throw new ArgumentOutOfRangeException(nameof(connectionIdleLifeTime));
        if (connectionPruningInterval < 0)
            throw new ArgumentOutOfRangeException(nameof(connectionPruningInterval));
        if (connectionLifeTime < 0)
            throw new ArgumentOutOfRangeException(nameof(connectionLifeTime));
        if (keepalive < 0)
            throw new ArgumentOutOfRangeException(nameof(keepalive));

        this.Host = host;
        this.Port = port;
        this.DatabaseName = databaseName;
        this.UserName = userName;
        this.Password = password;
        this.DefaultSchema = defaultSchema;
        this.Pooling = pooling;
        this.MinPoolSize = minPoolSize;
        this.MaxPoolSize = maxPoolSize;
        this.ConnectionIdleLifeTime = connectionIdleLifeTime;
        this.ConnectionPruningInterval = connectionPruningInterval;
        this.ConnectionLifetime = connectionLifeTime;
        this.Keepalive = keepalive;
    }
}