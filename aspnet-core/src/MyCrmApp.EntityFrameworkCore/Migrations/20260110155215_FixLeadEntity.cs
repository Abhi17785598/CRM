using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCrmApp.Migrations
{
    /// <inheritdoc />
    public partial class FixLeadEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "AppLeads");

            migrationBuilder.DropColumn(
                name: "City",
                table: "AppLeads");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "AppLeads");

            migrationBuilder.DropColumn(
                name: "Industry",
                table: "AppLeads");

            migrationBuilder.DropColumn(
                name: "State",
                table: "AppLeads");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "AppLeads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "AppLeads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "AppLeads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Industry",
                table: "AppLeads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "AppLeads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
