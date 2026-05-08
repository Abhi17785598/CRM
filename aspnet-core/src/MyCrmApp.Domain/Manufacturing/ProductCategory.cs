using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.Manufacturing
{
    public class ProductCategory : FullAuditedAggregateRoot<Guid>
    {
        public string CategoryCode { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public string ParentCategoryName { get; set; }
        public int Level { get; set; }
        public string Path { get; set; }
        public string ImageUrl { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        
        // Category-specific attributes
        public string Attributes { get; set; } // JSON for custom attributes
        public string DefaultUnitOfMeasure { get; set; }
        public decimal DefaultTaxRate { get; set; }
        public decimal DefaultMargin { get; set; }
        
        // Navigation properties
        [NotMapped]
        public List<string> AttributeList => string.IsNullOrEmpty(Attributes) ? new List<string>() : System.Text.Json.JsonSerializer.Deserialize<List<string>>(Attributes);

        protected ProductCategory()
        {
            IsActive = true;
            Level = 1;
            SortOrder = 0;
            DefaultTaxRate = 0;
            DefaultMargin = 20;
        }

        public ProductCategory(
            Guid id,
            string categoryCode,
            string categoryName,
            string description = null
        ) : base(id)
        {
            CategoryCode = categoryCode;
            CategoryName = categoryName;
            Description = description;
            IsActive = true;
            Level = 1;
            SortOrder = 0;
            DefaultTaxRate = 0;
            DefaultMargin = 20;
            Path = categoryName;
        }

        public void SetParent(Guid? parentId, string parentName)
        {
            ParentCategoryId = parentId;
            ParentCategoryName = parentName;
            Level = parentId.HasValue ? 2 : 1;
            UpdatePath();
        }

        private void UpdatePath()
        {
            if (string.IsNullOrEmpty(ParentCategoryName))
            {
                Path = CategoryName;
            }
            else
            {
                Path = $"{ParentCategoryName} > {CategoryName}";
            }
        }

        public void AddAttribute(string attribute)
        {
            var attributes = AttributeList;
            attributes.Add(attribute);
            Attributes = System.Text.Json.JsonSerializer.Serialize(attributes);
        }

        public void RemoveAttribute(string attribute)
        {
            var attributes = AttributeList;
            attributes.Remove(attribute);
            Attributes = System.Text.Json.JsonSerializer.Serialize(attributes);
        }
    }
}
