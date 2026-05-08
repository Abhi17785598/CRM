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
    [Route("api/products")]
    public class ProductsController : MyCrmAppController
    {
        private readonly MyCrmAppDbContext _dbContext;

        public ProductsController(MyCrmAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Product Management
        [HttpGet]
        [Route("")]
        public async Task<PagedResultDto<object>> GetProductsAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            // Using InventoryItems as Products since they share similar structure
            var products = await _dbContext.InventoryItems
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(p => new
                {
                    p.Id,
                    ItemCode = p.ItemCode,
                    ProductName = p.ItemName,
                    Description = p.Description,
                    Category = p.Category,
                    Unit = p.Unit,
                    Quantity = p.Quantity,
                    UnitCost = p.UnitCost,
                    UnitPrice = p.UnitCost * 1.2m, // Assuming 20% markup
                    Barcode = $"BC-{p.ItemCode}",
                    Status = p.Status,
                    Location = p.Location,
                    Supplier = p.Supplier,
                    MinStockLevel = p.MinStockLevel,
                    MaxStockLevel = p.MaxStockLevel,
                    CreationTime = p.CreationTime,
                    LastModificationTime = p.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.InventoryItems.CountAsync();

            return new PagedResultDto<object>
            {
                Items = products,
                TotalCount = totalCount
            };
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<object> GetProductAsync(Guid id)
        {
            var product = await _dbContext.InventoryItems
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    ItemCode = p.ItemCode,
                    ProductName = p.ItemName,
                    Description = p.Description,
                    Category = p.Category,
                    Unit = p.Unit,
                    Quantity = p.Quantity,
                    UnitCost = p.UnitCost,
                    UnitPrice = p.UnitCost * 1.2m,
                    Barcode = $"BC-{p.ItemCode}",
                    Status = p.Status,
                    Location = p.Location,
                    Supplier = p.Supplier,
                    MinStockLevel = p.MinStockLevel,
                    MaxStockLevel = p.MaxStockLevel,
                    CreationTime = p.CreationTime,
                    LastModificationTime = p.LastModificationTime
                })
                .FirstOrDefaultAsync();

            return product;
        }

        [HttpPost]
        [Route("")]
        public async Task<object> CreateProductAsync([FromBody] CreateProductRequest input)
        {
            var product = new MyCrmApp.Manufacturing.InventoryItem
            {
                ItemCode = input.ItemCode,
                ItemName = input.ProductName,
                Description = input.Description,
                Category = input.Category,
                Unit = input.Unit,
                Quantity = input.Quantity,
                UnitCost = input.UnitCost,
                TotalValue = input.Quantity * input.UnitCost,
                Location = input.Location,
                Supplier = input.Supplier,
                MinStockLevel = input.MinStockLevel,
                MaxStockLevel = input.MaxStockLevel,
                Status = "active",
                LastUpdated = DateTime.Now,
                CreationTime = DateTime.Now,
                LastModificationTime = DateTime.Now
            };

            _dbContext.InventoryItems.Add(product);
            await _dbContext.SaveChangesAsync();

            return new { id = product.Id, barcode = $"BC-{input.ItemCode}", message = "Product created successfully" };
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<object> UpdateProductAsync(Guid id, [FromBody] UpdateProductRequest input)
        {
            var product = await _dbContext.InventoryItems.FindAsync(id);
            if (product == null)
            {
                return new { error = "Product not found" };
            }

            product.ItemName = input.ProductName ?? product.ItemName;
            product.Description = input.Description ?? product.Description;
            product.Category = input.Category ?? product.Category;
            product.Unit = input.Unit ?? product.Unit;
            product.Quantity = input.Quantity ?? product.Quantity;
            product.UnitCost = input.UnitCost ?? product.UnitCost;
            product.Location = input.Location ?? product.Location;
            product.Supplier = input.Supplier ?? product.Supplier;
            product.MinStockLevel = input.MinStockLevel ?? product.MinStockLevel;
            product.MaxStockLevel = input.MaxStockLevel ?? product.MaxStockLevel;
            product.TotalValue = product.Quantity * product.UnitCost;
            product.LastUpdated = DateTime.Now;
            product.LastModificationTime = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return new { message = "Product updated successfully" };
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<object> DeleteProductAsync(Guid id)
        {
            var product = await _dbContext.InventoryItems.FindAsync(id);
            if (product == null)
            {
                return new { error = "Product not found" };
            }

            _dbContext.InventoryItems.Remove(product);
            await _dbContext.SaveChangesAsync();

            return new { message = "Product deleted successfully" };
        }

        [HttpGet]
        [Route("search")]
        public async Task<PagedResultDto<object>> SearchProductsAsync([FromQuery] string query, [FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var products = await _dbContext.InventoryItems
                .Where(p => p.ItemName.Contains(query) || p.ItemCode.Contains(query) || p.Category.Contains(query))
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(p => new
                {
                    p.Id,
                    ItemCode = p.ItemCode,
                    ProductName = p.ItemName,
                    Description = p.Description,
                    Category = p.Category,
                    Unit = p.Unit,
                    Quantity = p.Quantity,
                    UnitCost = p.UnitCost,
                    UnitPrice = p.UnitCost * 1.2m,
                    Barcode = $"BC-{p.ItemCode}",
                    Status = p.Status,
                    Location = p.Location,
                    Supplier = p.Supplier,
                    CreationTime = p.CreationTime,
                    LastModificationTime = p.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.InventoryItems
                .Where(p => p.ItemName.Contains(query) || p.ItemCode.Contains(query) || p.Category.Contains(query))
                .CountAsync();

            return new PagedResultDto<object>
            {
                Items = products,
                TotalCount = totalCount
            };
        }

        // Barcode Management
        [HttpPost]
        [Route("{productId}/barcode")]
        public async Task<object> GenerateBarcodeAsync(Guid productId, [FromBody] GenerateBarcodeRequest request)
        {
            var product = await _dbContext.InventoryItems.FindAsync(productId);
            if (product == null)
            {
                return new { error = "Product not found" };
            }

            var barcode = $"BC-{product.ItemCode}-{DateTime.Now:yyyyMMddHHmmss}";
            
            return new
            {
                productId = productId,
                barcode = barcode,
                type = request.Type ?? "CODE-128",
                generatedDate = DateTime.Now,
                isActive = true
            };
        }

        [HttpGet]
        [Route("barcodes")]
        public async Task<object> GetBarcodesAsync([FromQuery] Guid? productId)
        {
            var products = await _dbContext.InventoryItems
                .Where(p => !productId.HasValue || p.Id == productId.Value)
                .ToListAsync();

            var barcodes = products.Select(p => new
            {
                id = p.Id,
                barcode = $"BC-{p.ItemCode}",
                type = "CODE-128",
                generatedDate = p.CreationTime,
                isActive = true,
                productId = p.Id,
                productName = p.ItemName
            }).ToList();

            return barcodes;
        }

        // Product Categories - using existing inventory categories
        [HttpGet]
        [Route("categories")]
        public async Task<List<string>> GetCategoriesAsync()
        {
            // Extract unique categories from inventory items
            var categories = await _dbContext.InventoryItems
                .Where(p => !string.IsNullOrEmpty(p.Category))
                .Select(p => p.Category)
                .Distinct()
                .ToListAsync();

            return categories.Any() ? categories : new List<string> { "Electronics", "Furniture", "Raw Materials", "Tools", "Office Supplies" };
        }

        // Supplier Management (using a simple approach)
        [HttpGet]
        [Route("suppliers")]
        public async Task<PagedResultDto<object>> GetSuppliersAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            // Return default supplier for now
            var suppliers = new List<object>
            {
                new
                {
                    Id = Guid.NewGuid(),
                    Name = "Default Supplier",
                    ContactPerson = "N/A",
                    Email = "N/A",
                    Phone = "N/A",
                    Address = "N/A",
                    Status = "active",
                    CreationTime = DateTime.Now
                }
            };

            return new PagedResultDto<object>
            {
                Items = suppliers.Skip(skipCount).Take(maxResultCount).ToList(),
                TotalCount = suppliers.Count
            };
        }

        // Purchase Orders (simplified version)
        [HttpGet]
        [Route("purchase-orders")]
        public async Task<PagedResultDto<object>> GetPurchaseOrdersAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            // Demo data for purchase orders
            var orders = new List<object>
            {
                new {
                    Id = Guid.NewGuid(),
                    OrderNumber = "PO-2024-001",
                    Supplier = "ABC Supplies",
                    Status = "sent",
                    Total = 5000.00m,
                    OrderDate = DateTime.Now.AddDays(-5),
                    ExpectedDeliveryDate = DateTime.Now.AddDays(10),
                    Items = new[] { "Steel Beams", "Aluminum Sheets" }
                },
                new {
                    Id = Guid.NewGuid(),
                    OrderNumber = "PO-2024-002",
                    Supplier = "XYZ Manufacturing",
                    Status = "confirmed",
                    Total = 3500.00m,
                    OrderDate = DateTime.Now.AddDays(-3),
                    ExpectedDeliveryDate = DateTime.Now.AddDays(7),
                    Items = new[] { "Copper Pipes" }
                }
            };

            return new PagedResultDto<object>
            {
                Items = orders.Skip(skipCount).Take(maxResultCount).ToList(),
                TotalCount = orders.Count
            };
        }

        // Analytics
        [HttpGet]
        [Route("lg")]
        public async Task<object> GetLGProductsAsync()
        {
            // Query the actual Products table for LG products
            var lgProducts = await _dbContext.Products
                .Where(p => p.Brand == "LG" && p.Status == MyCrmApp.Manufacturing.ProductStatus.Active)
                .Select(p => new
                {
                    p.Id,
                    ProductCode = p.ProductCode,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Brand = p.Brand,
                    Model = p.Model,
                    Category = p.Category,
                    SubCategory = p.SubCategory,
                    Specifications = p.Specifications,
                    Dimensions = p.Dimensions,
                    Weight = p.Weight,
                    Color = p.Color,
                    Material = p.Material,
                    CostPrice = p.CostPrice,
                    SellingPrice = p.SellingPrice,
                    RetailPrice = p.RetailPrice,
                    CurrentStock = p.CurrentStock,
                    ImageUrls = p.ImageUrls,
                    Tags = p.Tags,
                    Status = p.Status,
                    SKU = p.SKU,
                    CreationTime = p.CreationTime
                })
                .OrderByDescending(p => p.CreationTime)
                .ToListAsync();

            return lgProducts;
        }

        [HttpGet]
        [Route("category/{category}")]
        public async Task<object> GetProductsByCategoryAsync(string category)
        {
            var products = await _dbContext.Products
                .Where(p => p.Category == category && p.Status == MyCrmApp.Manufacturing.ProductStatus.Active)
                .Select(p => new
                {
                    p.Id,
                    ProductCode = p.ProductCode,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Brand = p.Brand,
                    Model = p.Model,
                    Category = p.Category,
                    SubCategory = p.SubCategory,
                    SellingPrice = p.SellingPrice,
                    RetailPrice = p.RetailPrice,
                    CurrentStock = p.CurrentStock,
                    ImageUrls = p.ImageUrls,
                    Tags = p.Tags,
                    CreationTime = p.CreationTime
                })
                .OrderByDescending(p => p.CreationTime)
                .ToListAsync();

            return products;
        }

        [HttpGet]
        [Route("featured")]
        public async Task<object> GetFeaturedProductsAsync()
        {
            var featuredProducts = await _dbContext.Products
                .Where(p => p.Status == MyCrmApp.Manufacturing.ProductStatus.Active && p.CurrentStock > 0)
                .Select(p => new
                {
                    p.Id,
                    ProductCode = p.ProductCode,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Brand = p.Brand,
                    Category = p.Category,
                    SellingPrice = p.SellingPrice,
                    RetailPrice = p.RetailPrice,
                    CurrentStock = p.CurrentStock,
                    ImageUrls = p.ImageUrls,
                    CreationTime = p.CreationTime
                })
                .OrderByDescending(p => p.SellingPrice)
                .Take(8)
                .ToListAsync();

            return featuredProducts;
        }

        [HttpGet]
        [Route("analytics/products")]
        public async Task<object> GetProductStatsAsync()
        {
            var totalProducts = await _dbContext.Products.CountAsync();
            var activeProducts = await _dbContext.Products.CountAsync(p => p.Status == MyCrmApp.Manufacturing.ProductStatus.Active);
            var lowStockProducts = await _dbContext.Products.CountAsync(p => p.CurrentStock <= p.MinimumStock);
            var totalValue = await _dbContext.Products.SumAsync(p => p.SellingPrice * p.CurrentStock);
            
            return new
            {
                totalProducts = totalProducts,
                activeProducts = activeProducts,
                lowStockProducts = lowStockProducts,
                totalValue = totalValue
            };
        }

        [HttpGet]
        [Route("analytics/purchases")]
        public async Task<object> GetPurchaseStatsAsync()
        {
            // Demo data for purchase stats
            return new
            {
                totalOrders = 15,
                totalValue = 45000.00m,
                pendingOrders = 3
            };
        }

        [HttpGet]
        [Route("analytics/suppliers")]
        public async Task<object> GetSupplierStatsAsync()
        {
            var totalSuppliers = 1; // Default supplier count for now
            
            return new
            {
                totalSuppliers = totalSuppliers,
                activeSuppliers = totalSuppliers
            };
        }
    }

    public class CreateProductRequest
    {
        public string ItemCode { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
        public string Location { get; set; }
        public string Supplier { get; set; }
        public int MinStockLevel { get; set; }
        public int MaxStockLevel { get; set; }
    }

    public class UpdateProductRequest
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int? Quantity { get; set; }
        public decimal? UnitCost { get; set; }
        public string Location { get; set; }
        public string Supplier { get; set; }
        public int? MinStockLevel { get; set; }
        public int? MaxStockLevel { get; set; }
    }

    public class GenerateBarcodeRequest
    {
        public string Type { get; set; } = "CODE-128";
    }
}
