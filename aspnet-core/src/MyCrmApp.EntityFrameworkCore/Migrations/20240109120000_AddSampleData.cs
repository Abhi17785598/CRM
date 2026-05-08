using Microsoft.EntityFrameworkCore.Migrations;
using Volo.Abp.EntityFrameworkCore;
using MyCrmApp.SeedData;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Uow;

namespace MyCrmApp.Migrations
{
    public partial class AddSampleData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This migration will be used to seed sample data
            // The actual seeding will be done in the OnModelCreating or during application startup
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove sample data if needed
        }
    }
}
