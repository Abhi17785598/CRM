using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Payroll
{
    public class Employee : FullAuditedAggregateRoot<Guid>
    {
        public string EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime HireDate { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
        public decimal BaseSalary { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string PANNumber { get; set; }
        public bool IsActive { get; set; }
        public DateTime? TerminationDate { get; set; }
        public string? TerminationReason { get; set; }

        protected Employee()
        {
        }

        public Employee(
            Guid id,
            string employeeCode,
            string firstName,
            string lastName,
            string email,
            string phone,
            string address,
            DateTime dateOfBirth,
            DateTime hireDate,
            string department,
            string position,
            decimal baseSalary,
            string bankAccountNumber,
            string bankName,
            string panNumber
        ) : base(id)
        {
            EmployeeCode = employeeCode;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
            Address = address;
            DateOfBirth = dateOfBirth;
            HireDate = hireDate;
            Department = department;
            Position = position;
            BaseSalary = baseSalary;
            BankAccountNumber = bankAccountNumber;
            BankName = bankName;
            PANNumber = panNumber;
            IsActive = true;
        }

        public void TerminateEmployee(DateTime terminationDate, string reason)
        {
            IsActive = false;
            TerminationDate = terminationDate;
            TerminationReason = reason;
        }

        public void UpdateSalary(decimal newSalary)
        {
            BaseSalary = newSalary;
        }

        public string GetFullName()
        {
            return $"{FirstName} {LastName}";
        }

        public int GetYearsOfService()
        {
            var endDate = TerminationDate ?? DateTime.Now;
            return (int)((endDate - HireDate).TotalDays / 365.25);
        }
    }
}
