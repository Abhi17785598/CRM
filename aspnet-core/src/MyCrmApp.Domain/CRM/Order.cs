using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCrmApp.CRM
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string OrderId { get; set; }

        [Required]
        [MaxLength(200)]
        public string CustomerName { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Pending, Processing, Shipped, Delivered, Cancelled

        [Required]
        [MaxLength(500)]
        public string ProductDescription { get; set; }

        public DateTime OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        [Required]
        [MaxLength(100)]
        public string PaymentMethod { get; set; }

        [Required]
        [MaxLength(200)]
        public string ShippingAddress { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; }

        [Required]
        [MaxLength(100)]
        public string AssignedTo { get; set; }

        public DateTime CreationTime { get; set; }

        public DateTime? LastModificationTime { get; set; }
    }
}
