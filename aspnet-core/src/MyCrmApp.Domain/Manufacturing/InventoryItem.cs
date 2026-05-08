using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class InventoryItem : FullAuditedAggregateRoot<Guid>
    {
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public decimal UnitPrice { get; set; }
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public string UnitOfMeasure { get; set; }
        [NotMapped]
        public string? Location { get; set; }
        [NotMapped]
        public string? Supplier { get; set; }
        [NotMapped]
        public string Status { get; set; }
        [NotMapped]
        public DateTime LastUpdated { get; set; }
        
        // Additional properties for controller compatibility
        [NotMapped]
        public string Unit { get; set; } = "Units";
        [NotMapped]
        public int Quantity { get; set; }
        [NotMapped]
        public decimal UnitCost { get; set; }
        [NotMapped]
        public decimal TotalValue { get; set; }
        [NotMapped]
        public int MinStockLevel { get; set; }
        [NotMapped]
        public int MaxStockLevel { get; set; }

        public InventoryItem()
        {
            Status = "Active";
            LastUpdated = DateTime.Now;
            Unit = "Units";
        }

        public InventoryItem(
            Guid id,
            string itemCode,
            string itemName,
            string description,
            string category,
            decimal unitPrice,
            int currentStock,
            int minimumStock,
            int maximumStock,
            string unitOfMeasure,
            string? location = null,
            string? supplier = null
        ) : base(id)
        {
            ItemCode = itemCode;
            ItemName = itemName;
            Description = description;
            Category = category;
            UnitPrice = unitPrice;
            CurrentStock = currentStock;
            MinimumStock = minimumStock;
            MaximumStock = maximumStock;
            UnitOfMeasure = unitOfMeasure;
            Location = location;
            Supplier = supplier;
            Status = "Active";
            LastUpdated = DateTime.Now;
            
            // Initialize controller compatibility properties
            Unit = unitOfMeasure;
            Quantity = currentStock;
            UnitCost = unitPrice;
            TotalValue = currentStock * unitPrice;
            MinStockLevel = minimumStock;
            MaxStockLevel = maximumStock;
        }

        public void UpdateStock(int quantity)
        {
            CurrentStock += quantity;
            LastUpdated = DateTime.Now;
        }

        public bool IsLowStock()
        {
            return CurrentStock <= MinimumStock;
        }

        public bool IsOverStock()
        {
            return CurrentStock >= MaximumStock;
        }
        
        public void UpdateStatus(string newStatus)
        {
            Status = newStatus;
            LastUpdated = DateTime.Now;
        }
    }
}
