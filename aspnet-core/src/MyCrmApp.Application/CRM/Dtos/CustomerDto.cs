using System;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM
{
    public class CustomerDto : FullAuditedEntityDto<Guid>
    {
        public string CustomerCode { get; set; }
        public string CompanyName { get; set; }
        public string Industry { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Website { get; set; }
        public string GSTNumber { get; set; }
        public string PANNumber { get; set; }
        public CustomerType CustomerType { get; set; }
        public CustomerStatus Status { get; set; }
        public decimal CreditLimit { get; set; }
        public decimal CurrentBalance { get; set; }
        public string PaymentTerms { get; set; }
        public string Notes { get; set; }
        public DateTime? LastContactDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
        public string AssignedTo { get; set; }
        public bool IsOverdue { get; set; }
        public bool NeedsFollowUp { get; set; }
    }

    public class CreateCustomerDto
    {
        public string CustomerCode { get; set; }
        public string CompanyName { get; set; }
        public string Industry { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Website { get; set; }
        public string GSTNumber { get; set; }
        public string PANNumber { get; set; }
        public CustomerType CustomerType { get; set; }
        public decimal CreditLimit { get; set; }
        public string PaymentTerms { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
    }

    public class UpdateCustomerDto
    {
        public string CompanyName { get; set; }
        public string Industry { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Website { get; set; }
        public string GSTNumber { get; set; }
        public string PANNumber { get; set; }
        public CustomerType CustomerType { get; set; }
        public decimal CreditLimit { get; set; }
        public string PaymentTerms { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
    }

    public class GetCustomersInput : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public CustomerType? CustomerType { get; set; }
        public CustomerStatus? Status { get; set; }
        public string? Industry { get; set; }
        public bool? OverdueOnly { get; set; }
        public bool? FollowUpOnly { get; set; }
    }
}
