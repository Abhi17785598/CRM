using System;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Payroll
{
    public class PayslipDto : FullAuditedEntityDto<Guid>
    {
        public string PayslipNumber { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public DateTime PayPeriodStart { get; set; }
        public DateTime PayPeriodEnd { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal OvertimeHours { get; set; }
        public decimal OvertimeRate { get; set; }
        public decimal OvertimePay { get; set; }
        public decimal Allowances { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal PFContribution { get; set; }
        public decimal ProfessionalTax { get; set; }
        public decimal IncomeTax { get; set; }
        public decimal OtherDeductions { get; set; }
        public decimal TotalDeductions { get; set; }
        public decimal NetSalary { get; set; }
        public string PaymentStatus { get; set; }
        public string? Notes { get; set; }
    }

    public class CreatePayslipDto
    {
        public string PayslipNumber { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime PayPeriodStart { get; set; }
        public DateTime PayPeriodEnd { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal OvertimeHours { get; set; }
        public decimal OvertimeRate { get; set; }
        public decimal Allowances { get; set; }
    }

    public class UpdatePayslipDto
    {
        public DateTime PayPeriodStart { get; set; }
        public DateTime PayPeriodEnd { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal OvertimeHours { get; set; }
        public decimal OvertimeRate { get; set; }
        public decimal Allowances { get; set; }
        public string? Notes { get; set; }
    }

    public class ProcessPayslipDto
    {
        public decimal PFRate { get; set; }
        public decimal ProfessionalTax { get; set; }
        public decimal IncomeTax { get; set; }
        public decimal OtherDeductions { get; set; }
    }

    public class GenerateMonthlyPayslipsDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public DateTime PayPeriodStart { get; set; }
        public DateTime PayPeriodEnd { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class GetPayslipsInput : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public Guid? EmployeeId { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
