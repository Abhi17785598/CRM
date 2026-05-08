using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using MyCrmApp.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using MyCrmApp.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MyCrmApp.Controllers
{
    [Route("api/manufacturing")]
    public class ManufacturingController : MyCrmAppController
    {
        private readonly MyCrmAppDbContext _dbContext;

        public ManufacturingController(MyCrmAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Production Orders
        [HttpGet]
        [Route("production-orders")]
        public async Task<PagedResultDto<object>> GetProductionOrdersAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var orders = await _dbContext.ProductionOrders
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.ProductId,
                    o.ProductName,
                    o.Quantity,
                    o.Unit,
                    o.Status,
                    o.Priority,
                    o.StartDate,
                    o.ExpectedEndDate,
                    o.ActualEndDate,
                    o.AssignedTo,
                    o.Progress,
                    o.Notes,
                    o.CreationTime,
                    o.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.ProductionOrders.CountAsync();

            return new PagedResultDto<object>
            {
                Items = orders,
                TotalCount = totalCount
            };
        }

        [HttpGet]
        [Route("production-orders/{id}")]
        public async Task<object> GetProductionOrderAsync(Guid id)
        {
            var order = await _dbContext.ProductionOrders
                .Where(o => o.Id == id)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.ProductId,
                    o.ProductName,
                    o.Quantity,
                    o.Unit,
                    o.Status,
                    o.Priority,
                    o.StartDate,
                    o.ExpectedEndDate,
                    o.ActualEndDate,
                    o.AssignedTo,
                    o.Progress,
                    o.Notes,
                    o.CreationTime,
                    o.LastModificationTime
                })
                .FirstOrDefaultAsync();

            return order;
        }

        [HttpPost]
        [Route("production-orders")]
        public async Task<object> CreateProductionOrderAsync([FromBody] CreateProductionOrderRequest input)
        {
            var order = new MyCrmApp.Manufacturing.ProductionOrder
            {
                OrderNumber = input.OrderNumber,
                ProductId = input.ProductId,
                ProductName = input.ProductName,
                Quantity = input.Quantity,
                Unit = input.Unit,
                Status = MyCrmApp.Manufacturing.ProductionOrderStatus.Planned,
                Priority = input.Priority,
                StartDate = input.StartDate?.ToString() ?? "",
                ExpectedEndDate = input.ExpectedEndDate?.ToString() ?? "",
                AssignedTo = input.AssignedTo,
                Progress = 0,
                Notes = input.Notes,
                CreationTime = DateTime.Now,
                LastModificationTime = DateTime.Now
            };

            _dbContext.ProductionOrders.Add(order);
            await _dbContext.SaveChangesAsync();

            return new { id = order.Id, message = "Production order created successfully" };
        }

        [HttpPut]
        [Route("production-orders/{id}")]
        public async Task<object> UpdateProductionOrderAsync(Guid id, [FromBody] UpdateProductionOrderRequest input)
        {
            var order = await _dbContext.ProductionOrders.FindAsync(id);
            if (order == null)
            {
                return new { error = "Production order not found" };
            }

            order.ProductName = input.ProductName ?? order.ProductName;
            order.Quantity = input.Quantity ?? order.Quantity;
            order.Priority = input.Priority ?? order.Priority;
            order.AssignedTo = input.AssignedTo ?? order.AssignedTo;
            order.Notes = input.Notes ?? order.Notes;
            order.LastModificationTime = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return new { message = "Production order updated successfully" };
        }

        [HttpDelete]
        [Route("production-orders/{id}")]
        public async Task<object> DeleteProductionOrderAsync(Guid id)
        {
            var order = await _dbContext.ProductionOrders.FindAsync(id);
            if (order == null)
            {
                return new { error = "Production order not found" };
            }

            _dbContext.ProductionOrders.Remove(order);
            await _dbContext.SaveChangesAsync();

            return new { message = "Production order deleted successfully" };
        }

        // Inventory Management
        [HttpGet]
        [Route("inventory")]
        public async Task<PagedResultDto<object>> GetInventoryAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var items = await _dbContext.InventoryItems
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(i => new
                {
                    i.Id,
                    i.ItemCode,
                    i.ItemName,
                    i.Description,
                    i.Category,
                    i.Unit,
                    i.Quantity,
                    i.MinStockLevel,
                    i.MaxStockLevel,
                    i.UnitCost,
                    i.TotalValue,
                    i.Location,
                    i.Supplier,
                    i.Status,
                    i.LastUpdated,
                    i.CreationTime,
                    i.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.InventoryItems.CountAsync();

            return new PagedResultDto<object>
            {
                Items = items,
                TotalCount = totalCount
            };
        }

        [HttpPost]
        [Route("inventory")]
        public async Task<object> CreateInventoryItemAsync([FromBody] CreateInventoryItemRequest input)
        {
            var item = new MyCrmApp.Manufacturing.InventoryItem
            {
                ItemCode = input.ItemCode,
                ItemName = input.ItemName,
                Description = input.Description,
                Category = input.Category,
                Unit = input.Unit,
                Quantity = input.Quantity,
                MinStockLevel = input.MinStockLevel,
                MaxStockLevel = input.MaxStockLevel,
                UnitCost = input.UnitCost,
                TotalValue = input.Quantity * input.UnitCost,
                Location = input.Location,
                Supplier = input.Supplier,
                Status = "active",
                LastUpdated = DateTime.Now,
                CreationTime = DateTime.Now,
                LastModificationTime = DateTime.Now
            };

            _dbContext.InventoryItems.Add(item);
            await _dbContext.SaveChangesAsync();

            return new { id = item.Id, message = "Inventory item created successfully" };
        }

        // Analytics
        [HttpGet]
        [Route("analytics/production")]
        public async Task<object> GetProductionStatsAsync()
        {
            var totalOrders = await _dbContext.ProductionOrders.CountAsync();
            var inProgressOrders = await _dbContext.ProductionOrders.CountAsync(o => o.Status == MyCrmApp.Manufacturing.ProductionOrderStatus.InProgress);
            var completedOrders = await _dbContext.ProductionOrders.CountAsync(o => o.Status == MyCrmApp.Manufacturing.ProductionOrderStatus.Completed);
            var overdueOrders = await _dbContext.ProductionOrders.CountAsync(o => 
                o.Status != MyCrmApp.Manufacturing.ProductionOrderStatus.Completed && 
                o.ActualEndDate.HasValue && 
                o.ActualEndDate.Value < DateTime.Now
            );
            
            return new
            {
                totalOrders = totalOrders,
                inProgressOrders = inProgressOrders,
                completedOrders = completedOrders,
                overdueOrders = overdueOrders,
                completionRate = totalOrders > 0 ? (double)completedOrders / totalOrders * 100 : 0
            };
        }

        [HttpGet]
        [Route("analytics/inventory")]
        public async Task<object> GetInventoryStatsAsync()
        {
            var totalItems = await _dbContext.InventoryItems.CountAsync();
            var totalValue = await _dbContext.InventoryItems.SumAsync(i => i.TotalValue);
            var lowStockItems = await _dbContext.InventoryItems.CountAsync(i => i.Quantity <= i.MinStockLevel);
            var outOfStockItems = await _dbContext.InventoryItems.CountAsync(i => i.Quantity == 0);
            
            return new
            {
                totalItems = totalItems,
                totalValue = totalValue,
                lowStockItems = lowStockItems,
                outOfStockItems = outOfStockItems
            };
        }
    }

    public class CreateProductionOrderRequest
    {
        public string OrderNumber { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public string Priority { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ExpectedEndDate { get; set; }
        public string AssignedTo { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateProductionOrderRequest
    {
        public string ProductName { get; set; }
        public int? Quantity { get; set; }
        public string Priority { get; set; }
        public string AssignedTo { get; set; }
        public string Notes { get; set; }
    }

    public class CreateInventoryItemRequest
    {
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int Quantity { get; set; }
        public int MinStockLevel { get; set; }
        public int MaxStockLevel { get; set; }
        public decimal UnitCost { get; set; }
        public string Location { get; set; }
        public string Supplier { get; set; }
    }
}
