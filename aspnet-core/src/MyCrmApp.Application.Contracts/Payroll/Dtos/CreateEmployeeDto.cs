using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Payroll.Dtos
{
    public class CreateEmployeeDto
    {
        [Required]
        [StringLength(50)]
        public string EmployeeCode { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateOfBirth { get; set; }
        
        [Required]
        public DateTime HireDate { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Department { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Position { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public decimal BaseSalary { get; set; }
        
        [Required]
        [StringLength(50)]
        public string BankAccountNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string BankName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PANNumber { get; set; } = string.Empty;
    }
}
