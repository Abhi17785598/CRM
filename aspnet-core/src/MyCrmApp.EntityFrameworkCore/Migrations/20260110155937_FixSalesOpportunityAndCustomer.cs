using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCrmApp.Migrations
{
    /// <inheritdoc />
    public partial class FixSalesOpportunityAndCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "AppSalesOpportunities");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "AppSalesOpportunities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "AppSalesOpportunities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "AppSalesOpportunities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
