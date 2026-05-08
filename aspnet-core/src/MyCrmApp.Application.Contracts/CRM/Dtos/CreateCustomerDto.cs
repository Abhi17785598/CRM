using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM.Dtos
{
    public class CreateCustomerDto
    {
        [Required]
        [StringLength(50)]
        public string CustomerCode { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Industry { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ContactPerson { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string Mobile { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string State { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PostalCode { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string Website { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string GSTNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PANNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public decimal CreditLimit { get; set; }
        
        [Required]
        [StringLength(100)]
        public string PaymentTerms { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Notes { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string AssignedTo { get; set; } = string.Empty;
    }
}
