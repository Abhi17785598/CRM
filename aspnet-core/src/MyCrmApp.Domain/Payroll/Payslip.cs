using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Payroll
{
    public class Payslip : FullAuditedAggregateRoot<Guid>
    {
        public string PayslipNumber { get; set; }
        public Guid EmployeeId { get; set; }
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
        
        // Additional properties for controller compatibility
        [NotMapped]
        public string PayPeriod { get; set; } = "";
        [NotMapped]
        public string PayDate { get; set; } = "";
        [NotMapped]
        public string Status { get; set; } = "Pending";
        [NotMapped]
        public decimal BasicSalary { get; set; }
        [NotMapped]
        public decimal NetPay { get; set; }
        [NotMapped]
        public PayslipStatus PayslipStatusEnum { get; set; }
        [NotMapped]
        public decimal Deductions { get; set; }

        public Payslip()
        {
            PaymentStatus = "Pending";
            PayPeriod = DateTime.Now.ToString("yyyy-MM-dd");
            PayDate = DateTime.Now.ToShortDateString();
            Status = "Pending";
            PayslipStatusEnum = PayslipStatus.Pending;
            Deductions = 0;
        }

        public Payslip(
            Guid id,
            string payslipNumber,
            Guid employeeId,
            DateTime payPeriodStart,
            DateTime payPeriodEnd,
            DateTime paymentDate,
            decimal baseSalary
        ) : base(id)
        {
            PayslipNumber = payslipNumber;
            EmployeeId = employeeId;
            PayPeriodStart = payPeriodStart;
            PayPeriodEnd = payPeriodEnd;
            PaymentDate = paymentDate;
            BaseSalary = baseSalary;
            OvertimeHours = 0;
            OvertimeRate = 0;
            OvertimePay = 0;
            Allowances = 0;
            PFContribution = 0;
            ProfessionalTax = 0;
            IncomeTax = 0;
            OtherDeductions = 0;
            PaymentStatus = "Pending";
            
            // Initialize controller compatibility properties
            PayPeriod = $"{payPeriodStart:yyyy-MM-dd} to {payPeriodEnd:yyyy-MM-dd}";
            PayDate = paymentDate.ToShortDateString();
            Status = "Pending";
            BasicSalary = baseSalary;
            NetPay = baseSalary;
            PayslipStatusEnum = PayslipStatus.Pending;
            Deductions = 0;
        }

        public void AddOvertime(decimal hours, decimal rate)
        {
            OvertimeHours = hours;
            OvertimeRate = rate;
            OvertimePay = hours * rate;
            CalculateGrossSalary();
        }

        public void AddAllowances(decimal allowances)
        {
            Allowances = allowances;
            CalculateGrossSalary();
        }

        public void CalculateDeductions(decimal pfRate, decimal professionalTax, decimal incomeTax)
        {
            PFContribution = GrossSalary * (pfRate / 100);
            ProfessionalTax = professionalTax;
            IncomeTax = incomeTax;
            TotalDeductions = PFContribution + ProfessionalTax + IncomeTax + OtherDeductions;
            CalculateNetSalary();
        }

        public void AddOtherDeductions(decimal deductions)
        {
            OtherDeductions = deductions;
            TotalDeductions = PFContribution + ProfessionalTax + IncomeTax + OtherDeductions;
            CalculateNetSalary();
        }

        private void CalculateGrossSalary()
        {
            GrossSalary = BaseSalary + OvertimePay + Allowances;
        }

        private void CalculateNetSalary()
        {
            NetSalary = GrossSalary - TotalDeductions;
        }

        public void MarkAsPaid()
        {
            PaymentStatus = "Paid";
        }

        public void MarkAsPending()
        {
            PaymentStatus = "Pending";
        }
    }
}
