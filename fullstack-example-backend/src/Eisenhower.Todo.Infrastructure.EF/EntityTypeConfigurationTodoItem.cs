using Microsoft.EntityFrameworkCore;
using Eisenhower.Todo.Infrastructure.EF.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eisenhower.Todo.Infrastructure.EF;

public class EntityTypeConfigurationTodoItem : IEntityTypeConfiguration<TodoItem>
{
    public void Configure(EntityTypeBuilder<TodoItem> builder)
    {
        builder.ToTable("Items");
        builder.HasKey(i => i.DbId);
        builder.Property(i => i.CreatedAt);
        builder.Property(i => i.DeletedAt);
        builder.Property(i => i.DueDate);
        builder.Property(i => i.ModifiedAt);
        builder.Property(i => i.Id);
        builder.HasIndex(i => i.Id).IsUnique();
        builder.Property(i => i.MarkedAsDone);
        builder.Property(i => i.MatrixX);
        builder.Property(i => i.MatrixY);
        builder.Property(i => i.Name).HasMaxLength(1024);
        builder.Property(i => i.Note).HasMaxLength(16384);
        builder.HasOne(i => i.TodoList)
            .WithMany(l => l.TodoItems)
            .HasForeignKey(i => i.TodoListDbId);
    }
}