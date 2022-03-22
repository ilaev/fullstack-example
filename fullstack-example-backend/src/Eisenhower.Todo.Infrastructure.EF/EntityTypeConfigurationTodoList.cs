using Microsoft.EntityFrameworkCore;
using Eisenhower.Todo.Infrastructure.EF.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eisenhower.Todo.Infrastructure.EF;

public class EntityTypeConfigurationTodoList : IEntityTypeConfiguration<TodoList>
{
    public void Configure(EntityTypeBuilder<TodoList> builder)
    {
        // TODO: concurrency https://docs.microsoft.com/en-us/ef/core/modeling/concurrency?tabs=fluent-api
        builder.ToTable("Lists");
        builder.HasKey(l => l.DbId);
        builder.Property(l => l.Color).HasMaxLength(64);
        builder.Property(l => l.CreatedAt);
        builder.Property(l => l.DeletedAt);
        builder.Property(l => l.Description).HasMaxLength(2048);
        builder.Property(l => l.Id);
        builder.HasIndex(l => l.Id);
        builder.Property(l => l.ModifiedAt);
        builder.Property(l => l.Name).HasMaxLength(128);
        builder.HasOne(l => l.User)
            .WithMany(u => u.TodoLists)
            .HasForeignKey(l => l.UserDbId);
    }
}