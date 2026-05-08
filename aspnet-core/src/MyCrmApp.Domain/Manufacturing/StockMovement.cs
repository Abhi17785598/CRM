using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class StockMovement : FullAuditedEntity<Guid>
    {
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public StockMovementType MovementType { get; set; }
        public int Quantity { get; set; }
        public int StockBefore { get; set; }
        public int StockAfter { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalValue { get; set; }
        public string ReferenceNumber { get; set; }
        public string ReferenceType { get; set; } // Purchase Order, Sales Order, Adjustment, etc.
        public string Reason { get; set; }
        public string Notes { get; set; }
        public string Location { get; set; }
        public string BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string SupplierName { get; set; }
        public string CustomerName { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
        public DateTime MovementDate { get; set; }

        protected StockMovement()
        {
            MovementDate = DateTime.Now;
        }

        public StockMovement(
            Guid id,
            Guid productId,
            string productCode,
            string productName,
            StockMovementType movementType,
            int quantity,
            int stockBefore,
            decimal unitCost,
            string? referenceNumber = null,
            string? referenceType = null,
            string? reason = null
        ) : base(id)
        {
            ProductId = productId;
            ProductCode = productCode;
            ProductName = productName;
            MovementType = movementType;
            Quantity = quantity;
            StockBefore = stockBefore;
            StockAfter = stockBefore + (movementType == StockMovementType.In ? quantity : -quantity);
            UnitCost = unitCost;
            TotalValue = Math.Abs(quantity * unitCost);
            ReferenceNumber = referenceNumber;
            ReferenceType = referenceType;
            Reason = reason;
            MovementDate = DateTime.Now;
        }

        public void SetLocation(string location)
        {
            Location = location;
        }

        public void SetBatchInfo(string batchNumber, DateTime? expiryDate)
        {
            BatchNumber = batchNumber;
            ExpiryDate = expiryDate;
        }

        public void SetSupplier(string supplierName)
        {
            SupplierName = supplierName;
        }

        public void SetCustomer(string customerName)
        {
            CustomerName = customerName;
        }

        public void SetUser(Guid? userId, string userName)
        {
            UserId = userId;
            UserName = userName;
        }
    }

    public enum StockMovementType
    {
        In = 1,      // Stock In (Purchase, Return, Adjustment)
        Out = 2,     // Stock Out (Sale, Transfer, Adjustment)
        Transfer = 3, // Stock Transfer between locations
        Adjustment = 4, // Manual adjustment
        Return = 5,  // Customer return
        Damage = 6   // Damaged/Written off
    }
}
