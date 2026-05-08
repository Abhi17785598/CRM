using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        // Basic Information
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Specifications { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        
        // Classification
        public Guid? CategoryId { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string Tags { get; set; }
        public ProductType ProductType { get; set; }
        public ProductStatus Status { get; set; }
        
        // Physical Properties
        public decimal Weight { get; set; }
        public decimal Volume { get; set; }
        public string Dimensions { get; set; }
        public string UnitOfMeasure { get; set; }
        public string Color { get; set; }
        public string Material { get; set; }
        public string Size { get; set; }
        
        // Pricing
        public decimal CostPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal WholesalePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public string Currency { get; set; } = "USD";
        public decimal TaxRate { get; set; }
        public decimal DiscountPercentage { get; set; }
        
        // Inventory Management
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public int ReorderLevel { get; set; }
        public int ReorderQuantity { get; set; }
        public string StockLocation { get; set; }
        public string Barcode { get; set; }
        public string QRCode { get; set; }
        public string SKU { get; set; }
        
        // Supplier Information
        public Guid? PrimarySupplierId { get; set; }
        public string PrimarySupplierName { get; set; }
        public string SupplierSKU { get; set; }
        public decimal SupplierPrice { get; set; }
        public int LeadTimeDays { get; set; }
        
        // Sales Information
        public bool IsTaxable { get; set; } = true;
        public bool IsDiscountable { get; set; } = true;
        public bool IsReturnable { get; set; } = true;
        public int ReturnPeriodDays { get; set; } = 30;
        public decimal MinimumOrderQuantity { get; set; } = 1;
        public decimal MaximumOrderQuantity { get; set; } = 1000;
        
        // Digital Assets
        public string ImageUrls { get; set; } // JSON array of image URLs
        public string DocumentUrls { get; set; } // JSON array of document URLs
        public string VideoUrl { get; set; }
        
        // Additional Properties
        public string Notes { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        
        // Audit and Tracking
        public DateTime? LastSoldDate { get; set; }
        public DateTime? LastPurchaseDate { get; set; }
        public decimal TotalSold { get; set; }
        public decimal TotalPurchased { get; set; }
        public int TimesSold { get; set; }
        public int TimesPurchased { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }

        // Navigation Properties (not mapped)
        [NotMapped]
        public List<string> ImageList => string.IsNullOrEmpty(ImageUrls) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(ImageUrls);
        
        [NotMapped]
        public List<string> DocumentList => string.IsNullOrEmpty(DocumentUrls) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(DocumentUrls);

        protected Product()
        {
            Status = ProductStatus.Active;
            Currency = "USD";
            IsTaxable = true;
            IsDiscountable = true;
            IsReturnable = true;
            ReturnPeriodDays = 30;
            MinimumOrderQuantity = 1;
            MaximumOrderQuantity = 1000;
        }

        public Product(
            Guid id,
            string productCode,
            string productName,
            string description,
            string category,
            decimal costPrice,
            decimal sellingPrice,
            int currentStock
        ) : base(id)
        {
            ProductCode = productCode;
            ProductName = productName;
            Description = description;
            Category = category;
            CostPrice = costPrice;
            SellingPrice = sellingPrice;
            WholesalePrice = sellingPrice * 0.8m; // 20% discount for wholesale
            RetailPrice = sellingPrice;
            CurrentStock = currentStock;
            MinimumStock = (int)(currentStock * 0.2m); // 20% of current stock
            MaximumStock = (int)(currentStock * 5); // 5x current stock
            ReorderLevel = MinimumStock;
            ReorderQuantity = MaximumStock;
            SKU = productCode;
            Status = ProductStatus.Active;
            Currency = "USD";
            IsTaxable = true;
            IsDiscountable = true;
            IsReturnable = true;
            ReturnPeriodDays = 30;
            MinimumOrderQuantity = 1;
            MaximumOrderQuantity = 1000;
        }

        // Business Methods
        public void UpdateStock(int quantity, string reason = "Manual Adjustment")
        {
            CurrentStock += quantity;
            LastModificationTime = DateTime.Now;
            
            // Log stock movement (would implement StockMovement entity)
            if (quantity > 0)
            {
                // Stock in
            }
            else
            {
                // Stock out
            }
        }

        public bool IsLowStock()
        {
            return CurrentStock <= MinimumStock;
        }

        public bool IsOverStock()
        {
            return CurrentStock >= MaximumStock;
        }

        public bool NeedsReorder()
        {
            return CurrentStock <= ReorderLevel;
        }

        public bool IsInStock()
        {
            return CurrentStock > 0;
        }

        public decimal GetPriceForCustomerType(string customerType)
        {
            return customerType.ToLower() switch
            {
                "wholesale" => WholesalePrice,
                "retail" => RetailPrice,
                _ => SellingPrice
            };
        }

        public decimal GetDiscountedPrice(decimal discountPercentage = 0)
        {
            if (!IsDiscountable || discountPercentage <= 0)
                return SellingPrice;
                
            var maxDiscount = DiscountPercentage > 0 ? DiscountPercentage : 20m;
            var actualDiscount = Math.Min(discountPercentage, maxDiscount);
            return SellingPrice * (1 - actualDiscount / 100);
        }

        public decimal GetPriceWithTax(decimal price = 0)
        {
            if (!IsTaxable)
                return price > 0 ? price : SellingPrice;
                
            var basePrice = price > 0 ? price : SellingPrice;
            return basePrice * (1 + TaxRate / 100);
        }

        public void UpdateStatus(ProductStatus newStatus)
        {
            Status = newStatus;
            LastModificationTime = DateTime.Now;
        }

        public void RecordSale(decimal quantity, decimal unitPrice)
        {
            CurrentStock -= (int)quantity;
            TotalSold += quantity;
            TimesSold++;
            LastSoldDate = DateTime.Now;
            LastModificationTime = DateTime.Now;
        }

        public void RecordPurchase(decimal quantity, decimal unitPrice)
        {
            CurrentStock += (int)quantity;
            TotalPurchased += quantity;
            TimesPurchased++;
            LastPurchaseDate = DateTime.Now;
            LastModificationTime = DateTime.Now;
        }

        public void UpdateRating(decimal newRating)
        {
            if (ReviewCount == 0)
            {
                AverageRating = newRating;
            }
            else
            {
                AverageRating = (AverageRating * ReviewCount + newRating) / (ReviewCount + 1);
            }
            ReviewCount++;
            LastModificationTime = DateTime.Now;
        }

        public void AddImage(string imageUrl)
        {
            var images = ImageList;
            images.Add(imageUrl);
            ImageUrls = System.Text.Json.JsonSerializer.Serialize(images);
            LastModificationTime = DateTime.Now;
        }

        public void RemoveImage(string imageUrl)
        {
            var images = ImageList;
            images.Remove(imageUrl);
            ImageUrls = System.Text.Json.JsonSerializer.Serialize(images);
            LastModificationTime = DateTime.Now;
        }

        public void AddDocument(string documentUrl)
        {
            var documents = DocumentList;
            documents.Add(documentUrl);
            DocumentUrls = System.Text.Json.JsonSerializer.Serialize(documents);
            LastModificationTime = DateTime.Now;
        }

        public void RemoveDocument(string documentUrl)
        {
            var documents = DocumentList;
            documents.Remove(documentUrl);
            DocumentUrls = System.Text.Json.JsonSerializer.Serialize(documents);
            LastModificationTime = DateTime.Now;
        }
    }

    public enum ProductType
    {
        Physical = 1,
        Digital = 2,
        Service = 3,
        Bundle = 4
    }

    public enum ProductStatus
    {
        Active = 1,
        Inactive = 2,
        Discontinued = 3,
        OutOfStock = 4,
        OnOrder = 5,
        Draft = 6
    }
}
