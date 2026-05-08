using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM.Dtos
{
    public class UpdateLeadDto
    {
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ContactPerson { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Mobile { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string ProductInterest { get; set; } = string.Empty;
        
        [Required]
        [Range(0, 10000000)]
        public decimal EstimatedValue { get; set; }
        
        [Required]
        public LeadSource LeadSource { get; set; }
        
        [Required]
        public LeadPriority LeadPriority { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string AssignedTo { get; set; } = string.Empty;
    }
}
