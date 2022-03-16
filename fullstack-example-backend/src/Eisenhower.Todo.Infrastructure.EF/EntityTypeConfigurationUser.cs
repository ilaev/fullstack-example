using Microsoft.EntityFrameworkCore;
using Eisenhower.Todo.Infrastructure.EF.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eisenhower.Todo.Infrastructure.EF;

public class EntityTypeConfigurationUser : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.DbId);
        builder.Property(u => u.CreatedAt);
        builder.Property(u => u.Email).HasMaxLength(254);
        builder.Property(u => u.Id);
        builder.HasIndex(u => u.Id).IsUnique();
        builder.Property(u => u.ModifiedAt);
        builder.Property(u => u.Name).HasMaxLength(64);
        builder.HasMany(u => u.TodoLists)
            .WithMany(u => u.Users)
            .UsingEntity(join => join.ToTable("UserLists"));
    }
}