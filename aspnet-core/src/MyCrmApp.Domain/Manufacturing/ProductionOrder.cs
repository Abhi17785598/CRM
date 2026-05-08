using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using MyCrmApp.Manufacturing;

namespace MyCrmApp.Manufacturing
{
    public class ProductionOrder : FullAuditedAggregateRoot<Guid>
    {
        public string OrderNumber { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public ProductionOrderStatus Status { get; set; }
        public string? Notes { get; set; }
        
        // Additional properties for controller compatibility
        [NotMapped]
        public Guid ProductId { get; set; }
        [NotMapped]
        public string Unit { get; set; } = "Units";
        [NotMapped]
        public string Priority { get; set; } = "Normal";
        [NotMapped]
        public string StartDate { get; set; } = "";
        [NotMapped]
        public string ExpectedEndDate { get; set; } = "";
        [NotMapped]
        public string AssignedTo { get; set; } = "Unassigned";
        [NotMapped]
        public int Progress { get; set; }

        public ProductionOrder()
        {
            Status = ProductionOrderStatus.Planned;
            Unit = "Units";
            Priority = "Normal";
            AssignedTo = "Unassigned";
            Progress = 0;
            StartDate = DateTime.Now.ToShortDateString();
            ExpectedEndDate = DateTime.Now.AddDays(1).ToShortDateString();
        }

        public ProductionOrder(
            Guid id,
            string orderNumber,
            string productName,
            int quantity,
            DateTime plannedStartDate,
            DateTime plannedEndDate,
            Guid productId,
            string unit = "Units",
            string priority = "Normal",
            string? assignedTo = null
        ) : base(id)
        {
            OrderNumber = orderNumber;
            ProductName = productName;
            Quantity = quantity;
            PlannedStartDate = plannedStartDate;
            PlannedEndDate = plannedEndDate;
            Status = ProductionOrderStatus.Planned;
            ProductId = productId;
            Unit = unit;
            Priority = priority;
            AssignedTo = assignedTo ?? "Unassigned";
            Progress = 0;
            StartDate = plannedStartDate.ToShortDateString();
            ExpectedEndDate = plannedEndDate.ToShortDateString();
        }

        public void StartProduction()
        {
            Status = ProductionOrderStatus.InProgress;
            ActualStartDate = DateTime.Now;
            Progress = 25;
        }

        public void CompleteProduction()
        {
            Status = ProductionOrderStatus.Completed;
            ActualEndDate = DateTime.Now;
            Progress = 100;
        }

        public void CancelProduction(string reason)
        {
            Status = ProductionOrderStatus.Cancelled;
            Notes = reason;
        }
        
        public void UpdateProgress(int newProgress)
        {
            Progress = Math.Max(0, Math.Min(100, newProgress));
            if (newProgress > 0 && Status == ProductionOrderStatus.Planned)
            {
                StartProduction();
            }
            if (newProgress >= 100 && Status != ProductionOrderStatus.Completed)
            {
                CompleteProduction();
            }
        }
    }
}
