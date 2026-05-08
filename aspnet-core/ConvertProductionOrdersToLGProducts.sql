-- Convert Production Orders to LG Products
-- This script transforms existing AppProductionOrders data into LG products

-- Check if AppProducts table exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AppProducts' AND type = 'U')
BEGIN
    PRINT 'AppProducts table already exists';
END
ELSE
BEGIN
    PRINT 'AppProducts table does not exist - please run CreateLGProductsTable.sql first';
END

-- Clear existing LG products (only if table exists)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'AppProducts' AND type = 'U')
BEGIN
    DELETE FROM [dbo].[AppProducts] WHERE Brand = 'LG';
END

-- Insert LG Products based on Production Orders
INSERT INTO [dbo].[AppProducts] (
    [Id],
    [ProductCode],
    [ProductName],
    [Description],
    [Brand],
    [Model],
    [CategoryId],
    [Category],
    [SubCategory],
    [Tags],
    [ProductType],
    [Status],
    [Weight],
    [Volume],
    [Dimensions],
    [UnitOfMeasure],
    [Color],
    [Material],
    [Size],
    [CostPrice],
    [SellingPrice],
    [WholesalePrice],
    [RetailPrice],
    [Currency],
    [TaxRate],
    [DiscountPercentage],
    [CurrentStock],
    [MinimumStock],
    [MaximumStock],
    [ReorderLevel],
    [ReorderQuantity],
    [StockLocation],
    [Barcode],
    [QRCode],
    [SKU],
    [PrimarySupplierId],
    [PrimarySupplierName],
    [PrimarySupplierSKU],
    [SupplierPrice],
    [LeadTimeDays],
    [IsTaxable],
    [IsDiscountable],
    [IsReturnable],
    [ReturnPeriodDays],
    [MinimumOrderQuantity],
    [MaximumOrderQuantity],
    [ImageUrls],
    [DocumentUrls],
    [VideoUrl],
    [Notes],
    [MetaTitle],
    [MetaDescription],
    [MetaKeywords],
    [LastSoldDate],
    [LastPurchaseDate],
    [TotalSold],
    [TotalPurchased],
    [TimesSold],
    [TimesPurchased],
    [AverageRating],
    [ReviewCount],
    [CreationTime],
    [CreatorId],
    [LastModificationTime],
    [LastModifierId],
    [IsDeleted],
    [DeleterId],
    [DeletionTime]
)
SELECT 
    NEWID() as [Id],
    'LG-' + REPLACE(PO.OrderNumber, 'PO-', '') as [ProductCode],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 'LG ' + PO.ProductName
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 'LG ' + PO.ProductName
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 'LG ' + PO.ProductName
        ELSE 'LG ' + PO.ProductName
    END as [ProductName],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 'LG CNC Lathe Machine - ' + REPLACE(PO.ProductName, 'CNC Lathe Machine - ', '')
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 'LG Assembly Line System - ' + REPLACE(PO.ProductName, 'Assembly Line ', '')
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 'LG Industrial Steel Pipes - ' + REPLACE(PO.ProductName, 'Industrial Steel Pipes - ', '')
        ELSE 'LG ' + PO.ProductName
    END as [Description],
    'LG' as [Brand],
    REPLACE(PO.ProductName, 'CNC Lathe Machine - ', '') as [Model],
    NULL as [CategoryId],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 'Manufacturing Equipment'
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 'Manufacturing Equipment'
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 'Industrial Equipment'
        ELSE 'Manufacturing Equipment'
    END as [Category],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 'CNC Machines'
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 'Assembly Systems'
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 'Steel Processing'
        ELSE 'Equipment'
    END as [SubCategory],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 'CNC,Precision,Metalworking'
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 'Assembly,Automation,Production'
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 'Steel,Pipes,Industrial'
        ELSE 'Manufacturing'
    END as [Tags],
    1 as [ProductType],
    1 as [Status],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 2500.0
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 1800.0
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 1200.0
        ELSE 1000.0
    END as [Weight],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 2.5
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 4.0
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 3.0
        ELSE 2.0
    END as [Volume],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN '120" x 80" x 96"'
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN '240" x 60" x 84"'
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN '180" x 36" x 48"'
        ELSE '96" x 48" x 60"'
    END as [Dimensions],
    'Units' as [UnitOfMeasure],
    'Silver/Gray' as [Color],
    'Steel/Aluminum' as [Material],
    CASE 
        WHEN PO.ProductName LIKE '%CNC Lathe%' THEN 'Large'
        WHEN PO.ProductName LIKE '%Assembly Line%' THEN 'Industrial'
        WHEN PO.ProductName LIKE '%Industrial Steel%' THEN 'Heavy'
        ELSE 'Standard'
    END as [Size],
    PO.Quantity * 5000.0 as [CostPrice],
    PO.Quantity * 7500.0 as [SellingPrice],
    PO.Quantity * 6000.0 as [WholesalePrice],
    PO.Quantity * 7500.0 as [RetailPrice],
    'USD' as [Currency],
    8.25 as [TaxRate],
    10.0 as [DiscountPercentage],
    CASE 
        WHEN PO.Status = 'Completed' THEN 50
        WHEN PO.Status IS NULL THEN 25
        ELSE 10
    END as [CurrentStock],
    5 as [MinimumStock],
    100 as [MaximumStock],
    15 as [ReorderLevel],
    25 as [ReorderQuantity],
    'Warehouse A - Manufacturing' as [StockLocation],
    'LG-' + REPLACE(PO.OrderNumber, 'PO-', '') as [Barcode],
    NULL as [QRCode],
    'LG-' + REPLACE(PO.OrderNumber, 'PO-', '') as [SKU],
    NULL as [PrimarySupplierId],
    'LG Manufacturing Division' as [PrimarySupplierName],
    NULL as [PrimarySupplierSKU],
    PO.Quantity * 4500.0 as [SupplierPrice],
    30 as [LeadTimeDays],
    1 as [IsTaxable],
    1 as [IsDiscountable],
    1 as [IsReturnable],
    30 as [ReturnPeriodDays],
    1.0 as [MinimumOrderQuantity],
    10.0 as [MaximumOrderQuantity],
    '["https://example.com/lg-product.jpg"]' as [ImageUrls],
    '[]' as [DocumentUrls],
    NULL as [VideoUrl],
    PO.Notes as [Notes],
    'LG ' + REPLACE(PO.ProductName, 'CNC Lathe Machine - ', '') + ' - Premium Quality' as [MetaTitle],
    'High-quality LG manufacturing equipment for industrial applications' as [MetaDescription],
    'LG,manufacturing,equipment,industrial' as [MetaKeywords],
    NULL as [LastSoldDate],
    NULL as [LastPurchaseDate],
    0.0 as [TotalSold],
    0.0 as [TotalPurchased],
    0 as [TimesSold],
    0 as [TimesPurchased],
    4.5 as [AverageRating],
    CASE 
        WHEN PO.Status = 'Completed' THEN 25
        WHEN PO.Status IS NULL THEN 15
        ELSE 5
    END as [ReviewCount],
    PO.CreationTime as [CreationTime],
    NULL as [CreatorId],
    PO.LastModificationTime as [LastModificationTime],
    NULL as [LastModifierId],
    0 as [IsDeleted],
    NULL as [DeleterId],
    NULL as [DeletionTime]
FROM [dbo].[AppProductionOrders] PO
WHERE PO.ProductName LIKE '%CNC Lathe%' 
   OR PO.ProductName LIKE '%Assembly Line%' 
   OR PO.ProductName LIKE '%Industrial Steel%';

PRINT 'Successfully converted Production Orders to LG Products';

-- Declare a variable to hold the count
DECLARE @ProductCount INT;
SELECT @ProductCount = COUNT(*) FROM [dbo].[AppProducts] WHERE Brand = 'LG';
PRINT 'Total LG Products created: ' + CAST(@ProductCount AS NVARCHAR(10));
