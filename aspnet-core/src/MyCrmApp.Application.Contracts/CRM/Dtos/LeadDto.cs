using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM.Dtos
{
    public class LeadDto : EntityDto<Guid>
    {
        public string LeadNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string ProductInterest { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public LeadSource LeadSource { get; set; }
        public LeadPriority LeadPriority { get; set; }
        public LeadStatus LeadStatus { get; set; }
        public DateTime? LeadDate { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
    }
}
