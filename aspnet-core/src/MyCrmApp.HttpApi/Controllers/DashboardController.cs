using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using MyCrmApp.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyCrmApp.Controllers
{
    [Route("api/dashboard")]
    public class DashboardController : MyCrmAppController
    {
        private readonly MyCrmAppDbContext _dbContext;

        public DashboardController(MyCrmAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // ---------------- DASHBOARD STATS ----------------
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStatsAsync()
        {
            var totalCustomers = await _dbContext.Customers.CountAsync();
            var totalEmployees = await _dbContext.Employees.CountAsync();
            var totalProductionOrders = await _dbContext.ProductionOrders.CountAsync();
            var totalInventoryItems = await _dbContext.InventoryItems.CountAsync();
            var totalLeads = await _dbContext.Leads.CountAsync();
            var totalSalesOpportunities = await _dbContext.SalesOpportunities.CountAsync();
            var totalPayslips = await _dbContext.Payslips.CountAsync();

            var totalRevenue = await _dbContext.SalesOpportunities.SumAsync(o => o.Value);
            var totalInventoryValue = await _dbContext.InventoryItems.SumAsync(i => i.TotalValue);
            var totalPayroll = await _dbContext.Payslips.SumAsync(p => p.NetPay);

            return Ok(new
            {
                totalCustomers,
                totalEmployees,
                totalProductionOrders,
                totalInventoryItems,
                totalLeads,
                totalSalesOpportunities,
                totalPayslips,
                totalRevenue,
                totalInventoryValue,
                totalPayroll
            });
        }

        // ---------------- SALES CHART ----------------
        [HttpGet("sales-data")]
        public IActionResult GetSalesData()
        {
            var data = Enumerable.Range(0, 30).Select(i => new
            {
                date = DateTime.Today.AddDays(-i).ToString("yyyy-MM-dd"),
                amount = Random.Shared.Next(5000, 25000)
            });

            return Ok(new { sales = data });
        }

        // ---------------- PRODUCTION CHART ----------------
        [HttpGet("production-data")]
        public IActionResult GetProductionData()
        {
            var data = Enumerable.Range(0, 30).Select(i => new
            {
                date = DateTime.Today.AddDays(-i).ToString("yyyy-MM-dd"),
                completed = Random.Shared.Next(5, 25),
                pending = Random.Shared.Next(1, 10)
            });

            return Ok(new { production = data });
        }

        // ---------------- PERFORMANCE ----------------
        [HttpGet("performance-data")]
        public IActionResult GetPerformanceData()
        {
            return Ok(new
            {
                performance = new[]
                {
                    new { category = "Quality", value = new Random().Next(70, 95) },
                    new { category = "Efficiency", value = new Random().Next(65, 90) },
                    new { category = "Safety", value = new Random().Next(80, 98) },
                    new { category = "Cost Control", value = new Random().Next(60, 85) },
                    new { category = "Delivery", value = new Random().Next(70, 92) },
                    new { category = "Innovation", value = new Random().Next(55, 80) }
                }
            });
        }

        // ---------------- NOTIFICATIONS ----------------
        [HttpGet("notifications")]
        public IActionResult GetNotifications()
        {
            return Ok(new[]
            {
                new {
                    id = Guid.NewGuid(),
                    title = "Low Stock Alert",
                    message = "Steel inventory is low",
                    type = "warning",
                    timestamp = DateTime.Now,
                    isRead = false
                }
            });
        }

        // ---------------- METRICS ----------------
        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetricsAsync()
        {
            var totalCustomers = await _dbContext.Customers.CountAsync();
            var activeCustomers = await _dbContext.Customers.CountAsync(c => c.Status == MyCrmApp.CRM.CustomerStatus.Active);

            var totalEmployees = await _dbContext.Employees.CountAsync();
            var activeEmployees = await _dbContext.Employees.CountAsync(e => e.IsActive);

            var totalOrders = await _dbContext.ProductionOrders.CountAsync();
            var completedOrders = await _dbContext.ProductionOrders.CountAsync(
                o => o.Status == MyCrmApp.Manufacturing.ProductionOrderStatus.Completed);

            return Ok(new
            {
                customerMetrics = new
                {
                    total = totalCustomers,
                    active = activeCustomers
                },
                employeeMetrics = new
                {
                    total = totalEmployees,
                    active = activeEmployees
                },
                productionMetrics = new
                {
                    total = totalOrders,
                    completed = completedOrders
                }
            });
        }
    }
}
