using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Payroll.Dtos
{
    public class UpdatePayslipDto
    {
        [StringLength(50)]
        public string PaymentStatus { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Notes { get; set; } = string.Empty;
    }
}
