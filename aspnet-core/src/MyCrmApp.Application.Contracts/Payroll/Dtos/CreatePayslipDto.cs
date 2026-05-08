using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Payroll.Dtos
{
    public class CreatePayslipDto
    {
        [Required]
        [StringLength(50)]
        public string PayslipNumber { get; set; } = string.Empty;
        
        [Required]
        public Guid EmployeeId { get; set; }
        
        [Required]
        public DateTime PayPeriodStart { get; set; }
        
        [Required]
        public DateTime PayPeriodEnd { get; set; }
        
        [Required]
        public DateTime PaymentDate { get; set; }
        
        [Required]
        public decimal BaseSalary { get; set; }
        
        [Required]
        [StringLength(50)]
        public string PaymentStatus { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Notes { get; set; } = string.Empty;
    }
}
