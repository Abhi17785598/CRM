using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class Supplier : FullAuditedAggregateRoot<Guid>
    {
        // Basic Information
        public string SupplierCode { get; set; }
        public string CompanyName { get; set; }
        public string LegalName { get; set; }
        public string TradeName { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }
        
        // Contact Information
        public string ContactPerson { get; set; }
        public string ContactTitle { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Fax { get; set; }
        
        // Address Information
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string BillingAddress { get; set; }
        public string ShippingAddress { get; set; }
        
        // Business Information
        public string TaxNumber { get; set; }
        public string RegistrationNumber { get; set; }
        public SupplierType SupplierType { get; set; }
        public SupplierStatus Status { get; set; }
        public string Industry { get; set; }
        public string BusinessType { get; set; }
        public int NumberOfEmployees { get; set; }
        public DateTime? EstablishedDate { get; set; }
        
        // Financial Information
        public string Currency { get; set; } = "USD";
        public decimal CreditLimit { get; set; }
        public decimal CurrentBalance { get; set; }
        public string PaymentTerms { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranch { get; set; }
        public string SWIFTCode { get; set; }
        
        // Performance Metrics
        public int Rating { get; set; } // 1-5 rating
        public decimal AverageDeliveryTime { get; set; } // in days
        public decimal OnTimeDeliveryRate { get; set; } // percentage
        public decimal QualityRating { get; set; } // 1-5 rating
        public int TotalOrders { get; set; }
        public decimal TotalPurchaseValue { get; set; }
        public DateTime? LastOrderDate { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        
        // Contract Information
        public string ContractNumber { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public string ContractTerms { get; set; }
        public bool IsPreferredSupplier { get; set; }
        public bool IsApproved { get; set; }
        
        // Additional Information
        public string Notes { get; set; }
        public string Tags { get; set; }
        public string LogoUrl { get; set; }
        public List<string> ProductCategories { get; set; } = new List<string>();
        
        // Compliance and Certification
        public string Certifications { get; set; } // JSON array
        public string ComplianceDocuments { get; set; } // JSON array of document URLs
        public bool IsCompliant { get; set; }
        public DateTime? LastAuditDate { get; set; }
        public DateTime? NextAuditDate { get; set; }

        // Navigation properties
        [NotMapped]
        public List<string> CertificationList => string.IsNullOrEmpty(Certifications) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(Certifications);
        
        [NotMapped]
        public List<string> ComplianceDocumentList => string.IsNullOrEmpty(ComplianceDocuments) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(ComplianceDocuments);

        protected Supplier()
        {
            Status = SupplierStatus.Active;
            Currency = "USD";
            Rating = 3;
            OnTimeDeliveryRate = 95;
            QualityRating = 3;
            IsPreferredSupplier = false;
            IsApproved = false;
            IsCompliant = false;
        }

        public Supplier(
            Guid id,
            string supplierCode,
            string companyName,
            string contactPerson,
            string email,
            string phone
        ) : base(id)
        {
            SupplierCode = supplierCode;
            CompanyName = companyName;
            ContactPerson = contactPerson;
            Email = email;
            Phone = phone;
            Status = SupplierStatus.Active;
            Currency = "USD";
            Rating = 3;
            OnTimeDeliveryRate = 95;
            QualityRating = 3;
            IsPreferredSupplier = false;
            IsApproved = false;
            IsCompliant = false;
            PaymentTerms = "Net 30";
        }

        // Business Methods
        public void UpdateStatus(SupplierStatus newStatus)
        {
            Status = newStatus;
            LastModificationTime = DateTime.Now;
        }

        public void UpdateBalance(decimal amount)
        {
            CurrentBalance += amount;
            LastModificationTime = DateTime.Now;
        }

        public void UpdateRating(int newRating)
        {
            Rating = Math.Max(1, Math.Min(5, newRating));
            LastModificationTime = DateTime.Now;
        }

        public void UpdatePerformanceMetrics(decimal deliveryTime, decimal onTimeRate, decimal qualityRating)
        {
            AverageDeliveryTime = deliveryTime;
            OnTimeDeliveryRate = Math.Max(0, Math.Min(100, onTimeRate));
            QualityRating = Math.Max(1, Math.Min(5, qualityRating));
            LastModificationTime = DateTime.Now;
        }

        public void RecordOrder(decimal orderValue)
        {
            TotalOrders++;
            TotalPurchaseValue += orderValue;
            LastOrderDate = DateTime.Now;
            LastModificationTime = DateTime.Now;
        }

        public void RecordPayment(decimal paymentAmount)
        {
            CurrentBalance -= paymentAmount;
            LastPaymentDate = DateTime.Now;
            LastModificationTime = DateTime.Now;
        }

        public bool IsOverdue()
        {
            return CurrentBalance > CreditLimit;
        }

        public bool CanPlaceOrder(decimal orderValue)
        {
            return (CurrentBalance + orderValue) <= CreditLimit;
        }

        public void SetPreferred(bool isPreferred)
        {
            IsPreferredSupplier = isPreferred;
            LastModificationTime = DateTime.Now;
        }

        public void Approve()
        {
            IsApproved = true;
            Status = SupplierStatus.Active;
            LastModificationTime = DateTime.Now;
        }

        public void AddCertification(string certification)
        {
            var certifications = CertificationList;
            certifications.Add(certification);
            Certifications = System.Text.Json.JsonSerializer.Serialize(certifications);
            LastModificationTime = DateTime.Now;
        }

        public void RemoveCertification(string certification)
        {
            var certifications = CertificationList;
            certifications.Remove(certification);
            Certifications = System.Text.Json.JsonSerializer.Serialize(certifications);
            LastModificationTime = DateTime.Now;
        }

        public void AddComplianceDocument(string documentUrl)
        {
            var documents = ComplianceDocumentList;
            documents.Add(documentUrl);
            ComplianceDocuments = System.Text.Json.JsonSerializer.Serialize(documents);
            LastModificationTime = DateTime.Now;
        }

        public void RemoveComplianceDocument(string documentUrl)
        {
            var documents = ComplianceDocumentList;
            documents.Remove(documentUrl);
            ComplianceDocuments = System.Text.Json.JsonSerializer.Serialize(documents);
            LastModificationTime = DateTime.Now;
        }

        public void AddProductCategory(string category)
        {
            if (!ProductCategories.Contains(category))
            {
                ProductCategories.Add(category);
                LastModificationTime = DateTime.Now;
            }
        }

        public void RemoveProductCategory(string category)
        {
            ProductCategories.Remove(category);
            LastModificationTime = DateTime.Now;
        }
    }

    public enum SupplierType
    {
        Manufacturer = 1,
        Distributor = 2,
        Wholesaler = 3,
        Importer = 4,
        Service = 5,
        RawMaterial = 6,
        Component = 7
    }

    public enum SupplierStatus
    {
        Active = 1,
        Inactive = 2,
        Suspended = 3,
        Blacklisted = 4,
        Pending = 5,
        Rejected = 6
    }
}
