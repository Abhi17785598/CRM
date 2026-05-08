using System;
using Volo.Abp.Application.Dtos;

#nullable enable

namespace MyCrmApp.CRM
{
    public class SalesOpportunityDto : FullAuditedEntityDto<Guid>
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
        public decimal ExpectedRevenue { get; set; }
        public bool IsClosingSoon { get; set; }
        public bool IsStale { get; set; }
    }

    #nullable restore

    public class CreateOpportunityDto
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
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
    }

    public class UpdateOpportunityDto
    {
        public string OpportunityName { get; set; } = string.Empty;
        public string ProductService { get; set; } = string.Empty;
        public decimal DealValue { get; set; }
        public decimal Probability { get; set; }
        public SalesStage Stage { get; set; }
        public OpportunityPriority Priority { get; set; }
        public DateTime ExpectedCloseDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
    }

    public class MoveStageDto
    {
        public string Direction { get; set; } = string.Empty; // "Next" or "Previous"
    }

    public class LoseOpportunityDto
    {
        public string Reason { get; set; } = string.Empty;
    }

    public class GetOpportunitiesInput : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public SalesStage? Stage { get; set; }
        public OpportunityPriority? Priority { get; set; }
        public Guid? CustomerId { get; set; }
        public bool? WonOnly { get; set; }
        public bool? LostOnly { get; set; }
        public bool? ClosingSoon { get; set; }
        public bool? StaleOnly { get; set; }
    }
}
