using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM.Dtos
{
    public class UpdateOpportunityDto
    {
        [StringLength(200)]
        public string OpportunityName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string ProductService { get; set; } = string.Empty;
        
        [Required]
        [Range(0, 10000000)]
        public decimal DealValue { get; set; }
        
        [Required]
        [Range(0, 100)]
        public decimal Probability { get; set; }
        
        [Required]
        public SalesStage Stage { get; set; }
        
        [Required]
        public OpportunityPriority Priority { get; set; }
        
        [Required]
        public DateTime ExpectedCloseDate { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string AssignedTo { get; set; } = string.Empty;
    }
}
