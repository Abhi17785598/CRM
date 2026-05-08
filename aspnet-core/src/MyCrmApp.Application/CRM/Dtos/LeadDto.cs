using System;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM
{
    public class LeadDto : FullAuditedEntityDto<Guid>
    {
        public string LeadNumber { get; set; }
        public string CompanyName { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string ProductInterest { get; set; }
        public decimal EstimatedValue { get; set; }
        public LeadSource Source { get; set; }
        public LeadStatus Status { get; set; }
        public LeadPriority Priority { get; set; }
        public DateTime LeadDate { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
        public Guid? ConvertedToCustomerId { get; set; }
        public DateTime? ConvertedDate { get; set; }
        public bool IsHotLead { get; set; }
        public bool IsOverdue { get; set; }
    }

    public class CreateLeadDto
    {
        public string LeadNumber { get; set; }
        public string CompanyName { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string ProductInterest { get; set; }
        public decimal EstimatedValue { get; set; }
        public LeadSource Source { get; set; }
        public LeadPriority Priority { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
    }

    public class UpdateLeadDto
    {
        public string CompanyName { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string ProductInterest { get; set; }
        public decimal EstimatedValue { get; set; }
        public LeadPriority Priority { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
    }

    public class ConvertLeadToCustomerDto
    {
        public string CustomerCode { get; set; }
    }

    public class GetLeadsInput : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public LeadSource? Source { get; set; }
        public LeadStatus? Status { get; set; }
        public LeadPriority? Priority { get; set; }
        public bool? HotLeadsOnly { get; set; }
        public bool? OverdueOnly { get; set; }
    }
}
