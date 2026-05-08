using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using MyCrmApp.CRM;

namespace MyCrmApp.CRM
{
    public class Customer : FullAuditedAggregateRoot<Guid>
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

        protected Customer()
        {
        }

        public Customer(
            Guid id,
            string customerCode,
            string companyName,
            string industry,
            string contactPerson,
            string email,
            string phone,
            string address,
            string city,
            string state,
            string country,
            string postalCode,
            CustomerType customerType
        ) : base(id)
        {
            CustomerCode = customerCode;
            CompanyName = companyName;
            Industry = industry;
            ContactPerson = contactPerson;
            Email = email;
            Phone = phone;
            Address = address;
            City = city;
            State = state;
            Country = country;
            PostalCode = postalCode;
            CustomerType = customerType;
            Status = CustomerStatus.Active;
            CreditLimit = 0;
            CurrentBalance = 0;
            PaymentTerms = "Net 30";
        }

        public void UpdateStatus(CustomerStatus status)
        {
            Status = status;
        }

        public void UpdateBalance(decimal amount)
        {
            CurrentBalance += amount;
        }

        public void SetFollowUpDate(DateTime followUpDate)
        {
            NextFollowUpDate = followUpDate;
        }

        public void UpdateLastContact()
        {
            LastContactDate = DateTime.Now;
        }

        public bool IsOverdue()
        {
            return CurrentBalance > CreditLimit;
        }

        public bool NeedsFollowUp()
        {
            return NextFollowUpDate.HasValue && NextFollowUpDate <= DateTime.Now;
        }
    }
}