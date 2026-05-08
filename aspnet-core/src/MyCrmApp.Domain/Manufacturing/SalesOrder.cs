using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class SalesOrder : FullAuditedAggregateRoot<Guid>
    {
        // Basic Information
        public string OrderNumber { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string BillingAddress { get; set; }
        public string ShippingAddress { get; set; }
        
        // Order Details
        public DateTime OrderDate { get; set; }
        public DateTime? RequestedDeliveryDate { get; set; }
        public DateTime? CommittedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string DeliveryInstructions { get; set; }
        public string ShippingMethod { get; set; }
        
        // Financial Information
        public string Currency { get; set; } = "USD";
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentTerms { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        
        // Status and Tracking
        public SalesOrderStatus Status { get; set; }
        public string TrackingNumber { get; set; }
        public string Carrier { get; set; }
        public string Notes { get; set; }
        public string InternalNotes { get; set; }
        public string TermsAndConditions { get; set; }
        
        // Sales Information
        public Guid? SalesPersonId { get; set; }
        public string SalesPersonName { get; set; }
        public string SalesPersonEmail { get; set; }
        public decimal CommissionRate { get; set; }
        public decimal CommissionAmount { get; set; }
        
        // Additional Information
        public string QuoteNumber { get; set; }
        public string ReferenceNumber { get; set; }
        public string ProjectNumber { get; set; }
        public string Department { get; set; }
        public bool IsUrgent { get; set; }
        public DateTime? CancelledDate { get; set; }
        public string CancellationReason { get; set; }
        public DateTime? ReturnedDate { get; set; }
        public string ReturnReason { get; set; }

        // Navigation properties
        public List<SalesOrderItem> Items { get; set; } = new List<SalesOrderItem>();
        
        [NotMapped]
        public bool IsFullyPaid => BalanceAmount <= 0;
        
        [NotMapped]
        public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.Now && BalanceAmount > 0;
        
        [NotMapped]
        public bool IsDelivered => ActualDeliveryDate.HasValue;
        
        [NotMapped]
        public bool CanBeCancelled => Status == SalesOrderStatus.Draft || Status == SalesOrderStatus.Quoted || Status == SalesOrderStatus.Confirmed;

        protected SalesOrder()
        {
            Status = SalesOrderStatus.Draft;
            Currency = "USD";
            OrderDate = DateTime.Now;
            IsUrgent = false;
            CommissionRate = 0;
        }

        public SalesOrder(
            Guid id,
            string orderNumber,
            Guid customerId,
            string customerName
        ) : base(id)
        {
            OrderNumber = orderNumber;
            CustomerId = customerId;
            CustomerName = customerName;
            Status = SalesOrderStatus.Draft;
            Currency = "USD";
            OrderDate = DateTime.Now;
            IsUrgent = false;
            CommissionRate = 0;
        }

        // Business Methods
        public void AddItem(SalesOrderItem item)
        {
            Items.Add(item);
            CalculateTotals();
        }

        public void UpdateItem(Guid itemId, SalesOrderItem updatedItem)
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
            
            // Calculate commission
            CommissionAmount = TotalAmount * (CommissionRate / 100);
        }

        public void SetCustomerDetails(string email, string phone, string billingAddress, string shippingAddress)
        {
            CustomerEmail = email;
            CustomerPhone = phone;
            BillingAddress = billingAddress;
            ShippingAddress = shippingAddress;
        }

        public void SetDeliveryInfo(DateTime? requestedDate, DateTime? committedDate, string instructions, string shippingMethod)
        {
            RequestedDeliveryDate = requestedDate;
            CommittedDeliveryDate = committedDate;
            DeliveryInstructions = instructions;
            ShippingMethod = shippingMethod;
        }

        public void SetFinancialInfo(decimal tax, decimal discount, decimal shipping, string paymentMethod, string paymentTerms)
        {
            TaxAmount = tax;
            DiscountAmount = discount;
            ShippingCost = shipping;
            PaymentMethod = paymentMethod;
            PaymentTerms = paymentTerms;
            DueDate = paymentTerms.ToLower() switch
            {
                "net 15" => OrderDate.AddDays(15),
                "net 30" => OrderDate.AddDays(30),
                "net 60" => OrderDate.AddDays(60),
                "net 90" => OrderDate.AddDays(90),
                "due on receipt" => OrderDate,
                _ => (DateTime?)null
            };
            CalculateTotals();
        }

        public void SetSalesPerson(Guid? salesPersonId, string salesPersonName, string salesPersonEmail, decimal commissionRate)
        {
            SalesPersonId = salesPersonId;
            SalesPersonName = salesPersonName;
            SalesPersonEmail = salesPersonEmail;
            CommissionRate = commissionRate;
            CalculateTotals();
        }

        public void UpdateStatus(SalesOrderStatus newStatus)
        {
            Status = newStatus;
            
            if (newStatus == SalesOrderStatus.Delivered && !ActualDeliveryDate.HasValue)
            {
                ActualDeliveryDate = DateTime.Now;
            }
            
            LastModificationTime = DateTime.Now;
        }

        public void Confirm()
        {
            Status = SalesOrderStatus.Confirmed;
            LastModificationTime = DateTime.Now;
        }

        public void Cancel(string reason)
        {
            if (CanBeCancelled)
            {
                Status = SalesOrderStatus.Cancelled;
                CancellationReason = reason;
                CancelledDate = DateTime.Now;
                LastModificationTime = DateTime.Now;
            }
        }

        public void RecordPayment(decimal amount)
        {
            PaidAmount += amount;
            BalanceAmount = TotalAmount - PaidAmount;
            
            if (BalanceAmount <= 0)
            {
                Status = SalesOrderStatus.Paid;
            }
            else if (PaidAmount > 0)
            {
                Status = SalesOrderStatus.PartiallyPaid;
            }
            
            LastModificationTime = DateTime.Now;
        }

        public void SetTrackingInfo(string trackingNumber, string carrier)
        {
            TrackingNumber = trackingNumber;
            Carrier = carrier;
            Status = SalesOrderStatus.Shipped;
            LastModificationTime = DateTime.Now;
        }

        public void ConfirmDelivery()
        {
            ActualDeliveryDate = DateTime.Now;
            Status = SalesOrderStatus.Delivered;
            LastModificationTime = DateTime.Now;
        }

        public void ProcessReturn(string reason)
        {
            Status = SalesOrderStatus.Returned;
            ReturnReason = reason;
            ReturnedDate = DateTime.Now;
            LastModificationTime = DateTime.Now;
        }

        public bool CanBeShipped()
        {
            return Status == SalesOrderStatus.Confirmed || Status == SalesOrderStatus.Paid || Status == SalesOrderStatus.PartiallyPaid;
        }

        public bool IsReadyForDelivery()
        {
            return Status == SalesOrderStatus.Shipped;
        }
    }

    public class SalesOrderItem : Entity<Guid>
    {
        public Guid SalesOrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string UnitOfMeasure { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Notes { get; set; }
        public decimal ShippedQuantity { get; set; }
        public decimal ReturnedQuantity { get; set; }
        public decimal BackorderQuantity { get; set; }

        protected SalesOrderItem()
        {
            DiscountPercentage = 0;
            TaxRate = 0;
            ShippedQuantity = 0;
            ReturnedQuantity = 0;
        }

        public SalesOrderItem(
            Guid id,
            Guid salesOrderId,
            Guid productId,
            string productCode,
            string productName,
            decimal quantity,
            decimal unitPrice
        ) : base(id)
        {
            SalesOrderId = salesOrderId;
            ProductId = productId;
            ProductCode = productCode;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }

        public void CalculateTotals()
        {
            var lineTotal = Quantity * UnitPrice;
            DiscountAmount = lineTotal * (DiscountPercentage / 100);
            var taxableAmount = lineTotal - DiscountAmount;
            TaxAmount = taxableAmount * (TaxRate / 100);
            TotalAmount = taxableAmount + TaxAmount;
        }

        public void UpdateShippedQuantity(decimal shipped)
        {
            ShippedQuantity = shipped;
            BackorderQuantity = Math.Max(0, Quantity - shipped);
        }

        public void UpdateReturnedQuantity(decimal returned)
        {
            ReturnedQuantity = returned;
        }

        public bool IsFullyShipped()
        {
            return ShippedQuantity >= Quantity;
        }

        public bool HasBackorder()
        {
            return BackorderQuantity > 0;
        }
    }

    public enum SalesOrderStatus
    {
        Draft = 1,
        Quoted = 2,
        Confirmed = 3,
        Cancelled = 4,
        Backordered = 5,
        PartiallyShipped = 6,
        Shipped = 7,
        Delivered = 8,
        PartiallyPaid = 9,
        Paid = 10,
        Overdue = 11,
        Returned = 12,
        Refunded = 13
    }
}
