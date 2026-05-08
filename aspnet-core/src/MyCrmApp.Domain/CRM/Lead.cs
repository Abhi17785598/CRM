using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using MyCrmApp.CRM;

namespace MyCrmApp.CRM
{
    public class Lead : FullAuditedAggregateRoot<Guid>
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
        
        // Additional properties for controller compatibility
        [NotMapped]
        public string Address { get; set; }
        [NotMapped]
        public string City { get; set; }
        [NotMapped]
        public string State { get; set; }
        [NotMapped]
        public string Country { get; set; }
        [NotMapped]
        public string Industry { get; set; }
        [NotMapped]
        public decimal Value => EstimatedValue;

        protected Lead()
        {
        }

        public Lead(
            Guid id,
            string leadNumber,
            string companyName,
            string contactPerson,
            string email,
            string phone,
            string productInterest,
            decimal estimatedValue,
            LeadSource source,
            LeadPriority priority
        ) : base(id)
        {
            LeadNumber = leadNumber;
            CompanyName = companyName;
            ContactPerson = contactPerson;
            Email = email;
            Phone = phone;
            ProductInterest = productInterest;
            EstimatedValue = estimatedValue;
            Source = source;
            Priority = priority;
            Status = LeadStatus.New;
            LeadDate = DateTime.Now;
        }

        public void UpdateStatus(LeadStatus status)
        {
            Status = status;
            if (status == LeadStatus.Converted)
            {
                ConvertedDate = DateTime.Now;
            }
        }

        public void SetFollowUpDate(DateTime followUpDate)
        {
            FollowUpDate = followUpDate;
        }

        public void UpdateExpectedCloseDate(DateTime expectedCloseDate)
        {
            ExpectedCloseDate = expectedCloseDate;
        }

        public void ConvertToCustomer(Guid customerId)
        {
            Status = LeadStatus.Converted;
            ConvertedToCustomerId = customerId;
            ConvertedDate = DateTime.Now;
        }

        public bool IsHotLead()
        {
            return Priority == LeadPriority.High && EstimatedValue > 100000;
        }

        public bool IsOverdue()
        {
            return FollowUpDate.HasValue && FollowUpDate < DateTime.Now;
        }
    }
}
