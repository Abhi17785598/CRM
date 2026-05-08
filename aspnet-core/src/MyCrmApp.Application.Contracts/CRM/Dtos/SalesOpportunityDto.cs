using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM.Dtos
{
    public class SalesOpportunityDto : EntityDto<Guid>
    {
        public string OpportunityNumber { get; set; } = string.Empty;
        public string OpportunityName { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string ProductService { get; set; } = string.Empty;
        public decimal DealValue { get; set; }
        public decimal Probability { get; set; }
        public SalesStage Stage { get; set; }
        public OpportunityPriority Priority { get; set; }
        public DateTime ExpectedCloseDate { get; set; }
        public DateTime? ActualCloseDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
        public bool IsWon { get; set; }
        public bool IsLost { get; set; }
        public string LostReason { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
    }
}
