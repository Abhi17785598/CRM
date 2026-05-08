using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using MyCrmApp.Manufacturing;
using MyCrmApp.Payroll;
using MyCrmApp.CRM;
using Volo.Abp.Domain.Entities.Auditing;

namespace MyCrmApp.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class MyCrmAppDbContext :
    AbpDbContext<MyCrmAppDbContext>,
    IIdentityDbContext,
    ITenantManagementDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */

    #region Entities from the modules

    /* Notice: We only implemented IIdentityDbContext and ITenantManagementDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityDbContext and ITenantManagementDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    //Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }
    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion

    #region Custom CRM Entities

    // Manufacturing
    public DbSet<ProductionOrder> ProductionOrders { get; set; }
    public DbSet<InventoryItem> InventoryItems { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<StockMovement> StockMovements { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
    public DbSet<SalesOrder> SalesOrders { get; set; }
    public DbSet<SalesOrderItem> SalesOrderItems { get; set; }

    // Payroll
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Payslip> Payslips { get; set; }

    // CRM
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Lead> Leads { get; set; }
    public DbSet<SalesOpportunity> SalesOpportunities { get; set; }
    public DbSet<Order> Orders { get; set; }

    #endregion

    public MyCrmAppDbContext(DbContextOptions<MyCrmAppDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own tables/entities inside here */

        // Manufacturing entities
        builder.Entity<ProductionOrder>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "ProductionOrders", MyCrmAppConsts.DbSchema);
            b.Property(x => x.OrderNumber).IsRequired().HasMaxLength(50);
            b.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Notes).HasMaxLength(500);
        });

        builder.Entity<InventoryItem>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "InventoryItems", MyCrmAppConsts.DbSchema);
            b.Property(x => x.ItemCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.ItemName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(500);
            b.Property(x => x.Category).IsRequired().HasMaxLength(100);
            b.Property(x => x.UnitOfMeasure).IsRequired().HasMaxLength(50);
            b.Property(x => x.Location).HasMaxLength(100);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.UnitPrice).HasPrecision(18, 2);
        });

        // Payroll entities
        builder.Entity<Employee>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "Employees", MyCrmAppConsts.DbSchema);
            b.Property(x => x.EmployeeCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.FirstName).IsRequired().HasMaxLength(100);
            b.Property(x => x.LastName).IsRequired().HasMaxLength(100);
            b.Property(x => x.Email).IsRequired().HasMaxLength(200);
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.Address).HasMaxLength(500);
            b.Property(x => x.Department).IsRequired().HasMaxLength(100);
            b.Property(x => x.Position).IsRequired().HasMaxLength(100);
            b.Property(x => x.BankAccountNumber).HasMaxLength(50);
            b.Property(x => x.BankName).HasMaxLength(200);
            b.Property(x => x.PANNumber).HasMaxLength(20);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.BaseSalary).HasPrecision(18, 2);
        });

        builder.Entity<Payslip>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "Payslips", MyCrmAppConsts.DbSchema);
            b.Property(x => x.PayslipNumber).IsRequired().HasMaxLength(50);
            b.Property(x => x.PaymentStatus).IsRequired().HasMaxLength(50);
            b.Property(x => x.Notes).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.BaseSalary).HasPrecision(18, 2);
            b.Property(x => x.OvertimeHours).HasPrecision(18, 2);
            b.Property(x => x.OvertimeRate).HasPrecision(18, 2);
            b.Property(x => x.OvertimePay).HasPrecision(18, 2);
            b.Property(x => x.Allowances).HasPrecision(18, 2);
            b.Property(x => x.GrossSalary).HasPrecision(18, 2);
            b.Property(x => x.PFContribution).HasPrecision(18, 2);
            b.Property(x => x.ProfessionalTax).HasPrecision(18, 2);
            b.Property(x => x.IncomeTax).HasPrecision(18, 2);
            b.Property(x => x.OtherDeductions).HasPrecision(18, 2);
            b.Property(x => x.TotalDeductions).HasPrecision(18, 2);
            b.Property(x => x.NetSalary).HasPrecision(18, 2);
        });

        // CRM entities
        builder.Entity<Customer>(b =>
        {
            b.ToTable("AppCustomers", MyCrmAppConsts.DbSchema);
            b.Property(x => x.CustomerCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.CompanyName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Industry).IsRequired().HasMaxLength(100);
            b.Property(x => x.ContactPerson).IsRequired().HasMaxLength(100);
            b.Property(x => x.Email).IsRequired().HasMaxLength(200);
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.Mobile).HasMaxLength(50);
            b.Property(x => x.Address).HasMaxLength(500);
            b.Property(x => x.City).HasMaxLength(100);
            b.Property(x => x.State).HasMaxLength(100);
            b.Property(x => x.Country).HasMaxLength(100);
            b.Property(x => x.PostalCode).HasMaxLength(20);
            b.Property(x => x.Website).HasMaxLength(200);
            b.Property(x => x.GSTNumber).HasMaxLength(50);
            b.Property(x => x.PANNumber).HasMaxLength(20);
            b.Property(x => x.PaymentTerms).HasMaxLength(200);
            b.Property(x => x.Notes).HasMaxLength(500);
            b.Property(x => x.AssignedTo).HasMaxLength(100);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.CurrentBalance).HasPrecision(18, 2);
            b.Property(x => x.CreditLimit).HasPrecision(18, 2);
        });

        builder.Entity<Lead>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "Leads", MyCrmAppConsts.DbSchema);
            b.Property(x => x.LeadNumber).IsRequired().HasMaxLength(50);
            b.Property(x => x.CompanyName).IsRequired().HasMaxLength(200);
            b.Property(x => x.ContactPerson).IsRequired().HasMaxLength(100);
            b.Property(x => x.Email).IsRequired().HasMaxLength(200);
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.Mobile).HasMaxLength(50);
            b.Property(x => x.ProductInterest).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(500);
            b.Property(x => x.Notes).HasMaxLength(500);
            b.Property(x => x.AssignedTo).HasMaxLength(100);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.EstimatedValue).HasPrecision(18, 2);
        });

        builder.Entity<SalesOpportunity>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "SalesOpportunities", MyCrmAppConsts.DbSchema);
            b.Property(x => x.OpportunityNumber).IsRequired().HasMaxLength(50);
            b.Property(x => x.OpportunityName).IsRequired().HasMaxLength(200);
            b.Property(x => x.CustomerName).IsRequired().HasMaxLength(200);
            b.Property(x => x.ProductService).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(500);
            b.Property(x => x.Notes).HasMaxLength(500);
            b.Property(x => x.AssignedTo).HasMaxLength(100);
            b.Property(x => x.LostReason).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.DealValue).HasPrecision(18, 2);
            b.Property(x => x.Probability).HasPrecision(18, 2);
        });

        builder.Entity<Order>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "Orders", MyCrmAppConsts.DbSchema);
            b.Property(x => x.OrderId).IsRequired().HasMaxLength(50);
            b.Property(x => x.CustomerName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Status).IsRequired().HasMaxLength(50);
            b.Property(x => x.ProductDescription).IsRequired().HasMaxLength(500);
            b.Property(x => x.PaymentMethod).IsRequired().HasMaxLength(100);
            b.Property(x => x.ShippingAddress).IsRequired().HasMaxLength(200);
            b.Property(x => x.Notes).HasMaxLength(500);
            b.Property(x => x.AssignedTo).IsRequired().HasMaxLength(100);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.Amount).HasPrecision(18, 2);
        });

        // New ERP entities
        builder.Entity<Product>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "Products", MyCrmAppConsts.DbSchema);
            b.Property(x => x.ProductCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(1000);
            b.Property(x => x.Specifications).HasMaxLength(2000);
            b.Property(x => x.Brand).HasMaxLength(100);
            b.Property(x => x.Model).HasMaxLength(100);
            b.Property(x => x.Category).IsRequired().HasMaxLength(100);
            b.Property(x => x.SubCategory).HasMaxLength(100);
            b.Property(x => x.Tags).HasMaxLength(500);
            b.Property(x => x.UnitOfMeasure).HasMaxLength(50);
            b.Property(x => x.Color).HasMaxLength(50);
            b.Property(x => x.Material).HasMaxLength(100);
            b.Property(x => x.Size).HasMaxLength(100);
            b.Property(x => x.Currency).HasMaxLength(10);
            b.Property(x => x.StockLocation).HasMaxLength(100);
            b.Property(x => x.Barcode).HasMaxLength(100);
            b.Property(x => x.QRCode).HasMaxLength(200);
            b.Property(x => x.SKU).IsRequired().HasMaxLength(100);
            b.Property(x => x.PrimarySupplierName).HasMaxLength(200);
            b.Property(x => x.SupplierSKU).HasMaxLength(100);
            b.Property(x => x.ImageUrls).HasMaxLength(2000);
            b.Property(x => x.DocumentUrls).HasMaxLength(2000);
            b.Property(x => x.VideoUrl).HasMaxLength(500);
            b.Property(x => x.Notes).HasMaxLength(1000);
            b.Property(x => x.MetaTitle).HasMaxLength(200);
            b.Property(x => x.MetaDescription).HasMaxLength(500);
            b.Property(x => x.MetaKeywords).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.Weight).HasPrecision(18, 3);
            b.Property(x => x.Volume).HasPrecision(18, 3);
            b.Property(x => x.CostPrice).HasPrecision(18, 2);
            b.Property(x => x.SellingPrice).HasPrecision(18, 2);
            b.Property(x => x.WholesalePrice).HasPrecision(18, 2);
            b.Property(x => x.RetailPrice).HasPrecision(18, 2);
            b.Property(x => x.TaxRate).HasPrecision(5, 2);
            b.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
            b.Property(x => x.SupplierPrice).HasPrecision(18, 2);
            b.Property(x => x.MinimumOrderQuantity).HasPrecision(18, 2);
            b.Property(x => x.MaximumOrderQuantity).HasPrecision(18, 2);
            b.Property(x => x.TotalSold).HasPrecision(18, 2);
            b.Property(x => x.TotalPurchased).HasPrecision(18, 2);
            b.Property(x => x.AverageRating).HasPrecision(3, 2);
        });

        builder.Entity<ProductCategory>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "ProductCategories", MyCrmAppConsts.DbSchema);
            b.Property(x => x.CategoryCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.CategoryName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(500);
            b.Property(x => x.ParentCategoryName).HasMaxLength(200);
            b.Property(x => x.Path).HasMaxLength(500);
            b.Property(x => x.ImageUrl).HasMaxLength(500);
            b.Property(x => x.MetaTitle).HasMaxLength(200);
            b.Property(x => x.MetaDescription).HasMaxLength(500);
            b.Property(x => x.MetaKeywords).HasMaxLength(500);
            b.Property(x => x.Attributes).HasMaxLength(1000);
            b.Property(x => x.DefaultUnitOfMeasure).HasMaxLength(50);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.DefaultTaxRate).HasPrecision(5, 2);
            b.Property(x => x.DefaultMargin).HasPrecision(5, 2);
        });

        builder.Entity<StockMovement>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "StockMovements", MyCrmAppConsts.DbSchema);
            b.Property(x => x.ProductCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            b.Property(x => x.ReferenceNumber).HasMaxLength(100);
            b.Property(x => x.ReferenceType).HasMaxLength(100);
            b.Property(x => x.Reason).HasMaxLength(500);
            b.Property(x => x.Notes).HasMaxLength(1000);
            b.Property(x => x.Location).HasMaxLength(100);
            b.Property(x => x.BatchNumber).HasMaxLength(100);
            b.Property(x => x.SupplierName).HasMaxLength(200);
            b.Property(x => x.CustomerName).HasMaxLength(200);
            b.Property(x => x.UserName).HasMaxLength(100);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.UnitCost).HasPrecision(18, 2);
            b.Property(x => x.TotalValue).HasPrecision(18, 2);
        });

        builder.Entity<Supplier>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "Suppliers", MyCrmAppConsts.DbSchema);
            b.Property(x => x.SupplierCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.CompanyName).IsRequired().HasMaxLength(200);
            b.Property(x => x.LegalName).HasMaxLength(200);
            b.Property(x => x.TradeName).HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(1000);
            b.Property(x => x.Website).HasMaxLength(500);
            b.Property(x => x.ContactPerson).IsRequired().HasMaxLength(100);
            b.Property(x => x.ContactTitle).HasMaxLength(100);
            b.Property(x => x.Email).IsRequired().HasMaxLength(200);
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.Mobile).HasMaxLength(50);
            b.Property(x => x.Fax).HasMaxLength(50);
            b.Property(x => x.Address).HasMaxLength(500);
            b.Property(x => x.City).HasMaxLength(100);
            b.Property(x => x.State).HasMaxLength(100);
            b.Property(x => x.Country).HasMaxLength(100);
            b.Property(x => x.PostalCode).HasMaxLength(20);
            b.Property(x => x.BillingAddress).HasMaxLength(500);
            b.Property(x => x.ShippingAddress).HasMaxLength(500);
            b.Property(x => x.TaxNumber).HasMaxLength(50);
            b.Property(x => x.RegistrationNumber).HasMaxLength(50);
            b.Property(x => x.Industry).HasMaxLength(100);
            b.Property(x => x.BusinessType).HasMaxLength(100);
            b.Property(x => x.Currency).HasMaxLength(10);
            b.Property(x => x.PaymentTerms).HasMaxLength(200);
            b.Property(x => x.BankAccountNumber).HasMaxLength(50);
            b.Property(x => x.BankName).HasMaxLength(200);
            b.Property(x => x.BankBranch).HasMaxLength(200);
            b.Property(x => x.SWIFTCode).HasMaxLength(20);
            b.Property(x => x.ContractNumber).HasMaxLength(100);
            b.Property(x => x.ContractTerms).HasMaxLength(2000);
            b.Property(x => x.Notes).HasMaxLength(1000);
            b.Property(x => x.Tags).HasMaxLength(500);
            b.Property(x => x.LogoUrl).HasMaxLength(500);
            b.Property(x => x.Certifications).HasMaxLength(1000);
            b.Property(x => x.ComplianceDocuments).HasMaxLength(2000);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.CreditLimit).HasPrecision(18, 2);
            b.Property(x => x.CurrentBalance).HasPrecision(18, 2);
            b.Property(x => x.AverageDeliveryTime).HasPrecision(10, 2);
            b.Property(x => x.OnTimeDeliveryRate).HasPrecision(5, 2);
            b.Property(x => x.QualityRating).HasPrecision(3, 2);
            b.Property(x => x.TotalPurchaseValue).HasPrecision(18, 2);
        });

        builder.Entity<PurchaseOrder>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "PurchaseOrders", MyCrmAppConsts.DbSchema);
            b.Property(x => x.OrderNumber).IsRequired().HasMaxLength(50);
            b.Property(x => x.SupplierName).IsRequired().HasMaxLength(200);
            b.Property(x => x.SupplierContact).HasMaxLength(100);
            b.Property(x => x.SupplierEmail).HasMaxLength(200);
            b.Property(x => x.SupplierPhone).HasMaxLength(50);
            b.Property(x => x.DeliveryAddress).HasMaxLength(500);
            b.Property(x => x.DeliveryInstructions).HasMaxLength(500);
            b.Property(x => x.Currency).HasMaxLength(10);
            b.Property(x => x.PaymentTerms).HasMaxLength(200);
            b.Property(x => x.TrackingNumber).HasMaxLength(100);
            b.Property(x => x.Carrier).HasMaxLength(100);
            b.Property(x => x.Notes).HasMaxLength(1000);
            b.Property(x => x.InternalNotes).HasMaxLength(1000);
            b.Property(x => x.TermsAndConditions).HasMaxLength(2000);
            b.Property(x => x.RequestedByUserName).HasMaxLength(100);
            b.Property(x => x.ApprovedByUserName).HasMaxLength(100);
            b.Property(x => x.ApprovalComments).HasMaxLength(500);
            b.Property(x => x.ReferenceNumber).HasMaxLength(100);
            b.Property(x => x.ProjectNumber).HasMaxLength(100);
            b.Property(x => x.Department).HasMaxLength(100);
            b.Property(x => x.CancellationReason).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.Subtotal).HasPrecision(18, 2);
            b.Property(x => x.TaxAmount).HasPrecision(18, 2);
            b.Property(x => x.DiscountAmount).HasPrecision(18, 2);
            b.Property(x => x.ShippingCost).HasPrecision(18, 2);
            b.Property(x => x.TotalAmount).HasPrecision(18, 2);
            b.Property(x => x.PaidAmount).HasPrecision(18, 2);
            b.Property(x => x.BalanceAmount).HasPrecision(18, 2);
        });

        builder.Entity<PurchaseOrderItem>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "PurchaseOrderItems", MyCrmAppConsts.DbSchema);
            b.Property(x => x.ProductCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(1000);
            b.Property(x => x.UnitOfMeasure).HasMaxLength(50);
            b.Property(x => x.Notes).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.Quantity).HasPrecision(18, 2);
            b.Property(x => x.UnitPrice).HasPrecision(18, 2);
            b.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
            b.Property(x => x.DiscountAmount).HasPrecision(18, 2);
            b.Property(x => x.TaxRate).HasPrecision(5, 2);
            b.Property(x => x.TaxAmount).HasPrecision(18, 2);
            b.Property(x => x.TotalAmount).HasPrecision(18, 2);
            b.Property(x => x.ReceivedQuantity).HasPrecision(18, 2);
            b.Property(x => x.PendingQuantity).HasPrecision(18, 2);
        });

        builder.Entity<SalesOrder>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "SalesOrders", MyCrmAppConsts.DbSchema);
            b.Property(x => x.OrderNumber).IsRequired().HasMaxLength(50);
            b.Property(x => x.CustomerName).IsRequired().HasMaxLength(200);
            b.Property(x => x.CustomerEmail).HasMaxLength(200);
            b.Property(x => x.CustomerPhone).HasMaxLength(50);
            b.Property(x => x.BillingAddress).HasMaxLength(500);
            b.Property(x => x.ShippingAddress).HasMaxLength(500);
            b.Property(x => x.DeliveryInstructions).HasMaxLength(500);
            b.Property(x => x.ShippingMethod).HasMaxLength(100);
            b.Property(x => x.Currency).HasMaxLength(10);
            b.Property(x => x.PaymentMethod).HasMaxLength(100);
            b.Property(x => x.PaymentTerms).HasMaxLength(200);
            b.Property(x => x.TrackingNumber).HasMaxLength(100);
            b.Property(x => x.Carrier).HasMaxLength(100);
            b.Property(x => x.Notes).HasMaxLength(1000);
            b.Property(x => x.InternalNotes).HasMaxLength(1000);
            b.Property(x => x.TermsAndConditions).HasMaxLength(2000);
            b.Property(x => x.SalesPersonName).HasMaxLength(100);
            b.Property(x => x.SalesPersonEmail).HasMaxLength(200);
            b.Property(x => x.QuoteNumber).HasMaxLength(50);
            b.Property(x => x.ReferenceNumber).HasMaxLength(100);
            b.Property(x => x.ProjectNumber).HasMaxLength(100);
            b.Property(x => x.Department).HasMaxLength(100);
            b.Property(x => x.CancellationReason).HasMaxLength(500);
            b.Property(x => x.ReturnReason).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.Subtotal).HasPrecision(18, 2);
            b.Property(x => x.TaxAmount).HasPrecision(18, 2);
            b.Property(x => x.DiscountAmount).HasPrecision(18, 2);
            b.Property(x => x.ShippingCost).HasPrecision(18, 2);
            b.Property(x => x.TotalAmount).HasPrecision(18, 2);
            b.Property(x => x.PaidAmount).HasPrecision(18, 2);
            b.Property(x => x.BalanceAmount).HasPrecision(18, 2);
            b.Property(x => x.CommissionRate).HasPrecision(5, 2);
            b.Property(x => x.CommissionAmount).HasPrecision(18, 2);
        });

        builder.Entity<SalesOrderItem>(b =>
        {
            b.ToTable(MyCrmAppConsts.DbTablePrefix + "SalesOrderItems", MyCrmAppConsts.DbSchema);
            b.Property(x => x.ProductCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).HasMaxLength(1000);
            b.Property(x => x.UnitOfMeasure).HasMaxLength(50);
            b.Property(x => x.Notes).HasMaxLength(500);
            
            // Configure decimal precision for financial fields
            b.Property(x => x.Quantity).HasPrecision(18, 2);
            b.Property(x => x.UnitPrice).HasPrecision(18, 2);
            b.Property(x => x.DiscountPercentage).HasPrecision(5, 2);
            b.Property(x => x.DiscountAmount).HasPrecision(18, 2);
            b.Property(x => x.TaxRate).HasPrecision(5, 2);
            b.Property(x => x.TaxAmount).HasPrecision(18, 2);
            b.Property(x => x.TotalAmount).HasPrecision(18, 2);
            b.Property(x => x.ShippedQuantity).HasPrecision(18, 2);
            b.Property(x => x.ReturnedQuantity).HasPrecision(18, 2);
            b.Property(x => x.BackorderQuantity).HasPrecision(18, 2);
        });
    }
}
