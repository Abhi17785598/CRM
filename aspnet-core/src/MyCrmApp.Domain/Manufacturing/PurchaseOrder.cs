using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class PurchaseOrder : FullAuditedAggregateRoot<Guid>
    {
        // Basic Information
        public string OrderNumber { get; set; }
        public Guid SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierContact { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierPhone { get; set; }
        
        // Order Details
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string DeliveryAddress { get; set; }
        public string DeliveryInstructions { get; set; }
        
        // Financial Information
        public string Currency { get; set; } = "USD";
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentTerms { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        
        // Status and Tracking
        public PurchaseOrderStatus Status { get; set; }
        public string? TrackingNumber { get; set; }
        public string? Carrier { get; set; }
        public string? Notes { get; set; }
        public string? InternalNotes { get; set; }
        public string? TermsAndConditions { get; set; }
        
        // Approval Information
        public Guid? RequestedByUserId { get; set; }
        public string? RequestedByUserName { get; set; }
        public Guid? ApprovedByUserId { get; set; }
        public string? ApprovedByUserName { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public bool IsApproved { get; set; }
        public string? ApprovalComments { get; set; }
        
        // Additional Information
        public string? ReferenceNumber { get; set; }
        public string? ProjectNumber { get; set; }
        public string? Department { get; set; }
        public bool IsUrgent { get; set; }
        public DateTime? CancelledDate { get; set; }
        public string? CancellationReason { get; set; }

        // Navigation properties
        public List<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
        
        [NotMapped]
        public bool IsFullyPaid => BalanceAmount <= 0;
        
        [NotMapped]
        public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.Now && BalanceAmount > 0;
        
        [NotMapped]
        public bool IsDelivered => ActualDeliveryDate.HasValue;

        protected PurchaseOrder()
        {
            Status = PurchaseOrderStatus.Draft;
            Currency = "USD";
            OrderDate = DateTime.Now;
            IsApproved = false;
            IsUrgent = false;
        }

        public PurchaseOrder(
            Guid id,
            string orderNumber,
            Guid supplierId,
            string supplierName
        ) : base(id)
        {
            OrderNumber = orderNumber;
            SupplierId = supplierId;
            SupplierName = supplierName;
            Status = PurchaseOrderStatus.Draft;
            Currency = "USD";
            OrderDate = DateTime.Now;
            IsApproved = false;
            IsUrgent = false;
        }

        // Business Methods
        public void AddItem(PurchaseOrderItem item)
        {
            Items.Add(item);
            CalculateTotals();
        }

        public void UpdateItem(Guid itemId, PurchaseOrderItem updatedItem)
        {
            var existingItem = Items.Find(i => i.Id == itemId);
            if (existingItem != null)
            {
                existingItem.Quantity = updatedItem.Quantity;
                existingItem.UnitPrice = updatedItem.UnitPrice;
                existingItem.DiscountPercentage = updatedItem.DiscountPercentage;
                existingItem.Notes = updatedItem.Notes;
                CalculateTotals();
            }
        }

        public void RemoveItem(Guid itemId)
        {
            var item = Items.Find(i => i.Id == itemId);
            if (item != null)
            {
                Items.Remove(item);
                CalculateTotals();
            }
        }

        public void CalculateTotals()
        {
            Subtotal = 0;
            foreach (var item in Items)
            {
                item.CalculateTotals();
                Subtotal += item.TotalAmount;
            }

            TotalAmount = Subtotal + TaxAmount + ShippingCost - DiscountAmount;
            BalanceAmount = TotalAmount - PaidAmount;
        }

        public void SetSupplierDetails(string contact, string email, string phone)
        {
            SupplierContact = contact;
            SupplierEmail = email;
            SupplierPhone = phone;
        }

        public void SetDeliveryInfo(DateTime? expectedDate, string address, string instructions)
        {
            ExpectedDeliveryDate = expectedDate;
            DeliveryAddress = address;
            DeliveryInstructions = instructions;
        }

        public void SetFinancialInfo(decimal tax, decimal discount, decimal shipping, string paymentTerms)
        {
            TaxAmount = tax;
            DiscountAmount = discount;
            ShippingCost = shipping;
            PaymentTerms = paymentTerms;
            DueDate = paymentTerms.ToLower() switch
            {
                "net 15" => OrderDate.AddDays(15),
                "net 30" => OrderDate.AddDays(30),
                "net 60" => OrderDate.AddDays(60),
                "net 90" => OrderDate.AddDays(90),
                _ => (DateTime?)null
            };
            CalculateTotals();
        }

        public void UpdateStatus(PurchaseOrderStatus newStatus)
        {
            Status = newStatus;
            
            if (newStatus == PurchaseOrderStatus.Delivered && !ActualDeliveryDate.HasValue)
            {
                ActualDeliveryDate = DateTime.Now;
            }
            
            LastModificationTime = DateTime.Now;
        }

        public void Approve(Guid userId, string userName, string comments = null)
        {
            IsApproved = true;
            ApprovedByUserId = userId;
            ApprovedByUserName = userName;
            ApprovalDate = DateTime.Now;
            ApprovalComments = comments;
            Status = PurchaseOrderStatus.Approved;
            LastModificationTime = DateTime.Now;
        }

        public void Cancel(string reason)
        {
            Status = PurchaseOrderStatus.Cancelled;
            CancellationReason = reason;
            CancelledDate = DateTime.Now;
            LastModificationTime = DateTime.Now;
        }

        public void RecordPayment(decimal amount)
        {
            PaidAmount += amount;
            BalanceAmount = TotalAmount - PaidAmount;
            
            if (BalanceAmount <= 0)
            {
                Status = PurchaseOrderStatus.Paid;
            }
            
            LastModificationTime = DateTime.Now;
        }

        public void SetTrackingInfo(string trackingNumber, string carrier)
        {
            TrackingNumber = trackingNumber;
            Carrier = carrier;
            Status = PurchaseOrderStatus.Shipped;
            LastModificationTime = DateTime.Now;
        }

        public void ConfirmDelivery()
        {
            ActualDeliveryDate = DateTime.Now;
            Status = PurchaseOrderStatus.Delivered;
            LastModificationTime = DateTime.Now;
        }
    }

    public class PurchaseOrderItem : Entity<Guid>
    {
        public Guid PurchaseOrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string? Description { get; set; }
        public string UnitOfMeasure { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal ReceivedQuantity { get; set; }
        public decimal PendingQuantity { get; set; }

        protected PurchaseOrderItem()
        {
            DiscountPercentage = 0;
            TaxRate = 0;
            ReceivedQuantity = 0;
        }

        public PurchaseOrderItem(
            Guid id,
            Guid purchaseOrderId,
            Guid productId,
            string productCode,
            string productName,
            decimal quantity,
            decimal unitPrice
        ) : base(id)
        {
            PurchaseOrderId = purchaseOrderId;
            ProductId = productId;
            ProductCode = productCode;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
            PendingQuantity = quantity;
        }

        public void CalculateTotals()
        {
            var lineTotal = Quantity * UnitPrice;
            DiscountAmount = lineTotal * (DiscountPercentage / 100);
            var taxableAmount = lineTotal - DiscountAmount;
            TaxAmount = taxableAmount * (TaxRate / 100);
            TotalAmount = taxableAmount + TaxAmount;
        }

        public void UpdateReceivedQuantity(decimal received)
        {
            ReceivedQuantity = received;
            PendingQuantity = Quantity - received;
        }
    }

    public enum PurchaseOrderStatus
    {
        Draft = 1,
        Sent = 2,
        Approved = 3,
        Rejected = 4,
        Cancelled = 5,
        PartiallyReceived = 6,
        Received = 7,
        Shipped = 8,
        Delivered = 9,
        Paid = 10,
        Overdue = 11
    }
}
