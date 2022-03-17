using Eisenhower.Todo.Infrastructure.DI;
using Eisenhower.Todo.Api;

var builder = WebApplication.CreateBuilder(args);

var apiOptions = builder.Configuration.Get<ApiOptions>();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddEisenhowerTodo(apiOptions.GetAppDependencyInjectionOptions());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// TODO:
//app.UseAuthorization();

app.MapControllers();

app.Run();
