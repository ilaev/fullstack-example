using Eisenhower.Todo.Infrastructure.DI;
using Eisenhower.Todo.Api;

var builder = WebApplication.CreateBuilder(args);

var apiOptions = builder.Configuration.Get<ApiOptions>();

builder.Services.AddCors(options => {
    options.AddDefaultPolicy((corsPolicyBuilder) => 
        corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    );
});

builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true); 

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options => {
    options.JsonSerializerOptions.Converters.Add(new GuidConverter());
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// TODO: use tmp fake current user accessor
builder.Services.AddScoped<ICurrentUserAccessor, TmpCurrentUserAccessor>();
builder.Services.AddEisenhowerTodo(apiOptions.GetAppDependencyInjectionOptions());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
// TODO:
//app.UseAuthorization();

app.MapControllers();

app.Run();
