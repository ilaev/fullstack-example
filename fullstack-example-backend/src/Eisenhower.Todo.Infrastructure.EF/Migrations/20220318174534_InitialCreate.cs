using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Eisenhower.Todo.Infrastructure.EF.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "Items",
                schema: "public",
                columns: table => new
                {
                    DbId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    MatrixX = table.Column<int>(type: "integer", nullable: false),
                    MatrixY = table.Column<int>(type: "integer", nullable: false),
                    Note = table.Column<string>(type: "character varying(16384)", maxLength: 16384, nullable: false),
                    MarkedAsDone = table.Column<bool>(type: "boolean", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.DbId);
                });

            migrationBuilder.CreateTable(
                name: "Lists",
                schema: "public",
                columns: table => new
                {
                    DbId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    Color = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lists", x => x.DbId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "public",
                columns: table => new
                {
                    DbId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.DbId);
                });

            migrationBuilder.CreateTable(
                name: "ListItems",
                schema: "public",
                columns: table => new
                {
                    TodoItemsDbId = table.Column<long>(type: "bigint", nullable: false),
                    TodoListsDbId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListItems", x => new { x.TodoItemsDbId, x.TodoListsDbId });
                    table.ForeignKey(
                        name: "FK_ListItems_Items_TodoItemsDbId",
                        column: x => x.TodoItemsDbId,
                        principalSchema: "public",
                        principalTable: "Items",
                        principalColumn: "DbId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListItems_Lists_TodoListsDbId",
                        column: x => x.TodoListsDbId,
                        principalSchema: "public",
                        principalTable: "Lists",
                        principalColumn: "DbId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLists",
                schema: "public",
                columns: table => new
                {
                    TodoListsDbId = table.Column<long>(type: "bigint", nullable: false),
                    UsersDbId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLists", x => new { x.TodoListsDbId, x.UsersDbId });
                    table.ForeignKey(
                        name: "FK_UserLists_Lists_TodoListsDbId",
                        column: x => x.TodoListsDbId,
                        principalSchema: "public",
                        principalTable: "Lists",
                        principalColumn: "DbId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLists_Users_UsersDbId",
                        column: x => x.UsersDbId,
                        principalSchema: "public",
                        principalTable: "Users",
                        principalColumn: "DbId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Items_Id",
                schema: "public",
                table: "Items",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ListItems_TodoListsDbId",
                schema: "public",
                table: "ListItems",
                column: "TodoListsDbId");

            migrationBuilder.CreateIndex(
                name: "IX_Lists_Id",
                schema: "public",
                table: "Lists",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserLists_UsersDbId",
                schema: "public",
                table: "UserLists",
                column: "UsersDbId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Id",
                schema: "public",
                table: "Users",
                column: "Id",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListItems",
                schema: "public");

            migrationBuilder.DropTable(
                name: "UserLists",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Items",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Lists",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "public");
        }
    }
}
