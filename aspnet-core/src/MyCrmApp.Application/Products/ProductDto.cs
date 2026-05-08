using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using MyCrmApp.Manufacturing;

namespace MyCrmApp.Products
{
    public class ProductDto : FullAuditedEntityDto<Guid>
    {
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Specifications { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public Guid? CategoryId { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string Tags { get; set; }
        public ProductType ProductType { get; set; }
        public ProductStatus Status { get; set; }
        
        public decimal Weight { get; set; }
        public decimal Volume { get; set; }
        public string Dimensions { get; set; }
        public string UnitOfMeasure { get; set; }
        public string Color { get; set; }
        public string Material { get; set; }
        public string Size { get; set; }
        
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal WholesalePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public string Currency { get; set; }
        public decimal TaxRate { get; set; }
        public decimal DiscountPercentage { get; set; }
        
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public int ReorderLevel { get; set; }
        public int ReorderQuantity { get; set; }
        public string StockLocation { get; set; }
        public string Barcode { get; set; }
        public string QRCode { get; set; }
        public string SKU { get; set; }
        
        public bool IsTaxable { get; set; }
        public bool IsDiscountable { get; set; }
        public bool IsReturnable { get; set; }
        public int ReturnPeriodDays { get; set; }
        public decimal MinimumOrderQuantity { get; set; }
        public decimal MaximumOrderQuantity { get; set; }
        
        public List<string> ImageUrls { get; set; }
        public List<string> DocumentUrls { get; set; }
        public string VideoUrl { get; set; }
        
        public string Notes { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        
        public decimal TotalSold { get; set; }
        public decimal TotalPurchased { get; set; }
        public int TimesSold { get; set; }
        public int TimesPurchased { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }

    public class CreateProductDto
    {
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Specifications { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string Tags { get; set; }
        public ProductType ProductType { get; set; }
        
        public decimal Weight { get; set; }
        public decimal Volume { get; set; }
        public string Dimensions { get; set; }
        public string UnitOfMeasure { get; set; }
        public string Color { get; set; }
        public string Material { get; set; }
        public string Size { get; set; }
        
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal WholesalePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public decimal TaxRate { get; set; }
        public decimal DiscountPercentage { get; set; }
        
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public int ReorderLevel { get; set; }
        public int ReorderQuantity { get; set; }
        public string StockLocation { get; set; }
        public string Barcode { get; set; }
        public string QRCode { get; set; }
        public string SKU { get; set; }
        
        public bool IsTaxable { get; set; } = true;
        public bool IsDiscountable { get; set; } = true;
        public bool IsReturnable { get; set; } = true;
        public int ReturnPeriodDays { get; set; } = 30;
        public decimal MinimumOrderQuantity { get; set; } = 1;
        public decimal MaximumOrderQuantity { get; set; } = 1000;
        
        public List<string> ImageUrls { get; set; }
        public List<string> DocumentUrls { get; set; }
        public string VideoUrl { get; set; }
        
        public string Notes { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
    }

    public class UpdateProductDto
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Specifications { get; set; }
        public string SubCategory { get; set; }
        public string Tags { get; set; }
        public ProductType ProductType { get; set; }
        public ProductStatus Status { get; set; }
        
        public decimal Weight { get; set; }
        public decimal Volume { get; set; }
        public string Dimensions { get; set; }
        public string UnitOfMeasure { get; set; }
        public string Color { get; set; }
        public string Material { get; set; }
        public string Size { get; set; }
        
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal WholesalePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public string Currency { get; set; }
        public decimal TaxRate { get; set; }
        public decimal DiscountPercentage { get; set; }
        
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public int ReorderLevel { get; set; }
        public int ReorderQuantity { get; set; }
        public string StockLocation { get; set; }
        public string Barcode { get; set; }
        public string QRCode { get; set; }
        public string SKU { get; set; }
        
        public bool IsTaxable { get; set; }
        public bool IsDiscountable { get; set; }
        public bool IsReturnable { get; set; }
        public int ReturnPeriodDays { get; set; }
        public decimal MinimumOrderQuantity { get; set; }
        public decimal MaximumOrderQuantity { get; set; }
        
        public List<string> ImageUrls { get; set; }
        public List<string> DocumentUrls { get; set; }
        public string VideoUrl { get; set; }
        
        public string Notes { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        
        public decimal TotalSold { get; set; }
        public decimal TotalPurchased { get; set; }
        public int TimesSold { get; set; }
        public int TimesPurchased { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }

    public class GetProductsInput : PagedAndSortedResultRequestDto
    {
        public string Category { get; set; }
        public string Brand { get; set; }
        public string Search { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool InStockOnly { get; set; }
    }
}
