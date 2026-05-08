using System;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Payroll
{
    public class EmployeeDto : FullAuditedEntityDto<Guid>
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
        public string FullName { get; set; }
        public int YearsOfService { get; set; }
    }

    public class CreateEmployeeDto
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
    }

    public class UpdateEmployeeDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
        public decimal BaseSalary { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string PANNumber { get; set; }
    }

    public class TerminateEmployeeDto
    {
        public DateTime TerminationDate { get; set; }
        public string Reason { get; set; }
    }

    public class GetEmployeesInput : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public string? Department { get; set; }
        public bool? ActiveOnly { get; set; }
    }
}
