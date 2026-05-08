using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCrmApp.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using MyCrmApp.CRM;

namespace MyCrmApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : AbpControllerBase
    {
        private readonly MyCrmAppDbContext _dbContext;

        public OrdersController(MyCrmAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<object>> GetOrdersAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            try
            {
                var orders = await _dbContext.Orders
                    .OrderByDescending(o => o.OrderDate)
                    .Skip(skipCount)
                    .Take(maxResultCount)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderId,
                        o.CustomerName,
                        o.Amount,
                        o.Status,
                        o.ProductDescription,
                        o.OrderDate,
                        o.DeliveryDate,
                        o.PaymentMethod,
                        o.ShippingAddress,
                        o.Notes,
                        o.AssignedTo,
                        o.CreationTime,
                        o.LastModificationTime
                    })
                    .ToListAsync();

                var totalCount = await _dbContext.Orders.CountAsync();

                return Ok(new { items = orders, totalCount = totalCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve orders", message = ex.Message });
            }
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetOrderAsync(int id)
        {
            try
            {
                var order = await _dbContext.Orders
                    .Where(o => o.Id == id)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderId,
                        o.CustomerName,
                        o.Amount,
                        o.Status,
                        o.ProductDescription,
                        o.OrderDate,
                        o.DeliveryDate,
                        o.PaymentMethod,
                        o.ShippingAddress,
                        o.Notes,
                        o.AssignedTo,
                        o.CreationTime,
                        o.LastModificationTime
                    })
                    .FirstOrDefaultAsync();

                if (order == null)
                {
                    return NotFound(new { error = "Order not found" });
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to retrieve order", message = ex.Message });
            }
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<object>> CreateOrderAsync([FromBody] CreateOrderRequest request)
        {
            try
            {
                var order = new Order
                {
                    OrderId = GenerateOrderId(),
                    CustomerName = request.CustomerName,
                    Amount = request.Amount,
                    Status = "Pending",
                    ProductDescription = request.ProductDescription,
                    OrderDate = DateTime.UtcNow,
                    PaymentMethod = request.PaymentMethod,
                    ShippingAddress = request.ShippingAddress,
                    Notes = request.Notes,
                    AssignedTo = request.AssignedTo,
                    CreationTime = DateTime.UtcNow
                };

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Order created successfully", orderId = order.OrderId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to create order", message = ex.Message });
            }
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateOrderAsync(int id, [FromBody] UpdateOrderRequest request)
        {
            try
            {
                var order = await _dbContext.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { error = "Order not found" });
                }

                order.CustomerName = request.CustomerName;
                order.Amount = request.Amount;
                order.Status = request.Status;
                order.ProductDescription = request.ProductDescription;
                order.PaymentMethod = request.PaymentMethod;
                order.ShippingAddress = request.ShippingAddress;
                order.Notes = request.Notes;
                order.AssignedTo = request.AssignedTo;
                order.LastModificationTime = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Order updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to update order", message = ex.Message });
            }
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteOrderAsync(int id)
        {
            try
            {
                var order = await _dbContext.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { error = "Order not found" });
                }

                _dbContext.Orders.Remove(order);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to delete order", message = ex.Message });
            }
        }

        // Test endpoint
        [HttpGet("test")]
        public async Task<ActionResult<object>> TestOrdersAsync()
        {
            try
            {
                var testOrders = new object[]
                {
                    new
                    {
                        Id = 1,
                        OrderId = "ORD-001",
                        CustomerName = "Tech Solutions Inc.",
                        Amount = 15000,
                        Status = "Delivered",
                        ProductDescription = "Enterprise Software License",
                        OrderDate = DateTime.UtcNow.AddDays(-5),
                        DeliveryDate = DateTime.UtcNow.AddDays(-2),
                        PaymentMethod = "Bank Transfer",
                        ShippingAddress = "123 Tech Street, Bangalore, India",
                        Notes = "Priority customer - expedited delivery",
                        AssignedTo = "Sales Team A",
                        CreationTime = DateTime.UtcNow.AddDays(-5)
                    },
                    new
                    {
                        Id = 2,
                        OrderId = "ORD-002",
                        CustomerName = "Manufacturing Co.",
                        Amount = 8500,
                        Status = "Processing",
                        ProductDescription = "Industrial Equipment Parts",
                        OrderDate = DateTime.UtcNow.AddDays(-3),
                        DeliveryDate = (DateTime?)null,
                        PaymentMethod = "Credit Card",
                        ShippingAddress = "456 Industry Ave, Mumbai, India",
                        Notes = "Standard delivery required",
                        AssignedTo = "Sales Team B",
                        CreationTime = DateTime.UtcNow.AddDays(-3)
                    },
                    new
                    {
                        Id = 3,
                        OrderId = "ORD-003",
                        CustomerName = "Retail Solutions Ltd.",
                        Amount = 22000,
                        Status = "Pending",
                        ProductDescription = "Point of Sale System",
                        OrderDate = DateTime.UtcNow.AddDays(-1),
                        DeliveryDate = (DateTime?)null,
                        PaymentMethod = "Net Banking",
                        ShippingAddress = "789 Commerce Blvd, Delhi, India",
                        Notes = "Installation required",
                        AssignedTo = "Sales Team C",
                        CreationTime = DateTime.UtcNow.AddDays(-1)
                    }
                };

                return Ok(new { items = testOrders, totalCount = testOrders.Length });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Test failed", message = ex.Message });
            }
        }

        private string GenerateOrderId()
        {
            return "ORD-" + DateTime.UtcNow.ToString("yyyyMMdd-HHmmss");
        }
    }

    // Request DTOs
    public class CreateOrderRequest
    {
        public string CustomerName { get; set; }
        public decimal Amount { get; set; }
        public string ProductDescription { get; set; }
        public string PaymentMethod { get; set; }
        public string ShippingAddress { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
    }

    public class UpdateOrderRequest
    {
        public string CustomerName { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string ProductDescription { get; set; }
        public string PaymentMethod { get; set; }
        public string ShippingAddress { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
    }
}
