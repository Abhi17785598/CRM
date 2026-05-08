-- Create LG Products Table SQL Script
-- Run this script directly in your database to create the Products table and populate with LG data

-- Drop existing table if it exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AppProducts]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[AppProducts];
    PRINT 'Dropped existing AppProducts table';
END

-- Drop existing view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[dbo].[vw_LGProducts_Fast]'))
BEGIN
    DROP VIEW [dbo].[vw_LGProducts_Fast];
    PRINT 'Dropped existing vw_LGProducts_Fast view';
END

-- Drop existing procedure if it exists
IF EXISTS (SELECT * FROM sys.procedures WHERE object_id = OBJECT_ID(N'[dbo].[sp_SearchLGProducts]'))
BEGIN
    DROP PROCEDURE [dbo].[sp_SearchLGProducts];
    PRINT 'Dropped existing sp_SearchLGProducts procedure';
END

-- Create Products table
CREATE TABLE [dbo].[AppProducts] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [ProductCode] NVARCHAR(50) NOT NULL,
    [ProductName] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(1000) NULL,
    [Specifications] NVARCHAR(2000) NULL,
    [Brand] NVARCHAR(100) NULL,
    [Model] NVARCHAR(100) NULL,
    [CategoryId] UNIQUEIDENTIFIER NULL,
    [Category] NVARCHAR(100) NOT NULL,
    [SubCategory] NVARCHAR(100) NULL,
    [Tags] NVARCHAR(500) NULL,
    [ProductType] INT NOT NULL DEFAULT 1,
    [Status] INT NOT NULL DEFAULT 1,
    [Weight] DECIMAL(18,3) NULL,
    [Volume] DECIMAL(18,3) NULL,
    [Dimensions] NVARCHAR(100) NULL,
    [UnitOfMeasure] NVARCHAR(50) NULL,
    [Color] NVARCHAR(50) NULL,
    [Material] NVARCHAR(100) NULL,
    [Size] NVARCHAR(100) NULL,
    [CostPrice] DECIMAL(18,2) NOT NULL,
    [SellingPrice] DECIMAL(18,2) NOT NULL,
    [WholesalePrice] DECIMAL(18,2) NULL,
    [RetailPrice] DECIMAL(18,2) NULL,
    [Currency] NVARCHAR(10) NOT NULL DEFAULT 'USD',
    [TaxRate] DECIMAL(5,2) NULL,
    [DiscountPercentage] DECIMAL(5,2) NULL,
    [CurrentStock] INT NOT NULL,
    [MinimumStock] INT NULL,
    [MaximumStock] INT NULL,
    [ReorderLevel] INT NULL,
    [ReorderQuantity] INT NULL,
    [StockLocation] NVARCHAR(100) NULL,
    [Barcode] NVARCHAR(100) NULL,
    [QRCode] NVARCHAR(200) NULL,
    [SKU] NVARCHAR(100) NOT NULL,
    [PrimarySupplierId] UNIQUEIDENTIFIER NULL,
    [PrimarySupplierName] NVARCHAR(200) NULL,
    [SupplierSKU] NVARCHAR(100) NULL,
    [SupplierPrice] DECIMAL(18,2) NULL,
    [LeadTimeDays] INT NULL,
    [IsTaxable] BIT NOT NULL DEFAULT 1,
    [IsDiscountable] BIT NOT NULL DEFAULT 1,
    [IsReturnable] BIT NOT NULL DEFAULT 1,
    [ReturnPeriodDays] INT NOT NULL DEFAULT 30,
    [MinimumOrderQuantity] DECIMAL(18,2) NOT NULL DEFAULT 1,
    [MaximumOrderQuantity] DECIMAL(18,2) NOT NULL DEFAULT 1000,
    [ImageUrls] NVARCHAR(2000) NULL,
    [DocumentUrls] NVARCHAR(2000) NULL,
    [VideoUrl] NVARCHAR(500) NULL,
    [Notes] NVARCHAR(1000) NULL,
    [MetaTitle] NVARCHAR(200) NULL,
    [MetaDescription] NVARCHAR(500) NULL,
    [MetaKeywords] NVARCHAR(500) NULL,
    [LastSoldDate] DATETIME2 NULL,
    [LastPurchaseDate] DATETIME2 NULL,
    [TotalSold] DECIMAL(18,2) NOT NULL DEFAULT 0,
    [TotalPurchased] DECIMAL(18,2) NOT NULL DEFAULT 0,
    [TimesSold] INT NOT NULL DEFAULT 0,
    [TimesPurchased] INT NOT NULL DEFAULT 0,
    [AverageRating] DECIMAL(3,2) NOT NULL DEFAULT 0,
    [ReviewCount] INT NOT NULL DEFAULT 0,
    [CreationTime] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatorId] UNIQUEIDENTIFIER NULL,
    [LastModificationTime] DATETIME2 NULL,
    [LastModifierId] UNIQUEIDENTIFIER NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [DeleterId] UNIQUEIDENTIFIER NULL,
    [DeletionTime] DATETIME2 NULL,
    CONSTRAINT [PK_AppProducts] PRIMARY KEY ([Id]),
    CONSTRAINT [UK_AppProducts_ProductCode] UNIQUE ([ProductCode]),
    CONSTRAINT [UK_AppProducts_SKU] UNIQUE ([SKU])
);

-- Create indexes for fast querying
CREATE INDEX [IX_AppProducts_Category] ON [dbo].[AppProducts] ([Category]);
CREATE INDEX [IX_AppProducts_Brand] ON [dbo].[AppProducts] ([Brand]);
CREATE INDEX [IX_AppProducts_Status] ON [dbo].[AppProducts] ([Status]);
CREATE INDEX [IX_AppProducts_ProductType] ON [dbo].[AppProducts] ([ProductType]);
CREATE INDEX [IX_AppProducts_CurrentStock] ON [dbo].[AppProducts] ([CurrentStock]);
CREATE INDEX [IX_AppProducts_SellingPrice] ON [dbo].[AppProducts] ([SellingPrice]);
CREATE INDEX [IX_AppProducts_CreationTime] ON [dbo].[AppProducts] ([CreationTime]);

-- Insert LG Products Data
INSERT INTO [dbo].[AppProducts] (
    [Id], [ProductCode], [ProductName], [Description], [Category], [Brand], [Model], [SubCategory],
    [Specifications], [Dimensions], [Weight], [UnitOfMeasure], [Color], [Material], [ImageUrls],
    [Tags], [ProductType], [Status], [Barcode], [SKU], [TaxRate], [DiscountPercentage],
    [CurrentStock], [MinimumStock], [MaximumStock], [ReorderLevel], [ReorderQuantity],
    [StockLocation], [CostPrice], [SellingPrice], [WholesalePrice], [RetailPrice],
    [MetaTitle], [MetaDescription], [MetaKeywords], [CreationTime]
) VALUES 
-- LG OLED TV 55"
(NEWID(), 'LG-OLED55C3', 'LG OLED55C3 55" 4K Smart OLED TV', '55-inch OLED TV with AI Picture Pro, Dolby Vision IQ, and Perfect Black', 
 'TVs', 'LG', 'OLED55C3', 'OLED TVs',
 '55" OLED Display, 4K UHD, 120Hz Refresh Rate, AI Picture Pro, Dolby Vision IQ, Dolby Atmos, webOS 23, Smart TV',
 '48.3" x 28.0" x 1.8"', 18.7, 'Units', 'Black', 'Plastic/Metal',
 '["https://example.com/lg-oled55c3-1.jpg", "https://example.com/lg-oled55c3-2.jpg"]',
 'OLED,4K,Smart TV,Dolby Vision,AI', 1, 1, '8806084751234', 'LG-OLED55C3-US', 8.25, 10.00,
 50, 10, 100, 15, 50, 'Warehouse A - Electronics', 1299.99, 1899.99, 1519.99, 1899.99,
 'LG OLED55C3 55" 4K Smart OLED TV - Best Price',
 'Experience perfect black and infinite contrast with LG OLED55C3. Features AI Picture Pro, Dolby Vision IQ, and webOS 23 smart platform.',
 'LG OLED TV, 55 inch TV, 4K OLED, Smart TV, Dolby Vision', GETUTCDATE()),

-- LG NanoCell TV 75"
(NEWID(), 'LG-NANO756PA', 'LG NanoCell 75" 4K Smart TV', '75-inch NanoCell TV with Real Color, Local Dimming, and webOS',
 'TVs', 'LG', '75Nano756PA', 'NanoCell TVs',
 '75" NanoCell Display, 4K UHD, 60Hz Refresh Rate, Real Color, Local Dimming, webOS 22, Smart TV',
 '65.8" x 38.0" x 2.9"', 52.9, 'Units', 'Black', 'Plastic/Metal',
 '["https://example.com/lg-nano756pa-1.jpg"]',
 'NanoCell,4K,Smart TV,Local Dimming', 1, 1, '8806084755678', 'LG-NANO756PA-US', 8.25, 15.00,
 35, 8, 80, 12, 40, 'Warehouse A - Electronics', 899.99, 1299.99, 1039.99, 1299.99,
 'LG NanoCell 75" 4K Smart TV - Vibrant Colors',
 'LG NanoCell TV with Real Color technology delivers vibrant, accurate colors. Features local dimming and webOS smart platform.',
 'LG NanoCell, 75 inch TV, 4K TV, Smart TV, Local Dimming', GETUTCDATE()),

-- LG French Door Refrigerator
(NEWID(), 'LG-LRFDS3006S', 'LG 30 cu. ft. French Door Refrigerator', 'Large capacity French door refrigerator with InstaView and Craft Ice',
 'Refrigerators', 'LG', 'LRFDS3006S', 'French Door',
 '30 cu. ft. Capacity, French Door, InstaView Door-in-Door, Craft Ice Maker, SmartThinQ, Linear Cooling',
 '35.75" x 35.88" x 70.25"', 280.0, 'Units', 'Stainless Steel', 'Stainless Steel',
 '["https://example.com/lg-lrfds3006s-1.jpg", "https://example.com/lg-lrfds3006s-2.jpg"]',
 'French Door,InstaView,Craft Ice,Smart Refrigerator', 1, 1, '8806084759012', 'LG-LRFDS3006S-US', 8.25, 12.00,
 25, 5, 50, 8, 25, 'Warehouse B - Appliances', 1899.99, 2799.99, 2239.99, 2799.99,
 'LG 30 cu. ft. French Door Refrigerator with InstaView',
 'LG French door refrigerator features InstaView Door-in-Door, Craft Ice maker, and SmartThinQ technology for ultimate convenience.',
 'LG refrigerator, French door fridge, InstaView, Craft Ice, Smart refrigerator', GETUTCDATE()),

-- LG Side-by-Side Refrigerator
(NEWID(), 'LG-LSCS26736S', 'LG 26 cu. ft. Side-by-Side Refrigerator', 'Side-by-side refrigerator with DoorCooling+ and SmartDiagnosis',
 'Refrigerators', 'LG', 'LSCS26736S', 'Side-by-Side',
 '26 cu. ft. Capacity, Side-by-Side, DoorCooling+, SmartDiagnosis, Ice and Water Dispenser',
 '35.75" x 35.88" x 69.88"', 245.0, 'Units', 'Stainless Steel', 'Stainless Steel',
 '["https://example.com/lg-lscs26736s-1.jpg"]',
 'Side-by-Side,DoorCooling,Water Dispenser', 1, 1, '8806084753456', 'LG-LSCS26736S-US', 8.25, 10.00,
 30, 6, 60, 10, 30, 'Warehouse B - Appliances', 1199.99, 1799.99, 1439.99, 1799.99,
 'LG 26 cu. ft. Side-by-Side Refrigerator',
 'LG side-by-side refrigerator with DoorCooling+ technology for even cooling. Features ice and water dispenser.',
 'LG refrigerator, Side-by-side fridge, DoorCooling, Water dispenser', GETUTCDATE()),

-- LG Gram Laptop 17"
(NEWID(), 'LG-GRAM17Z90Q', 'LG Gram 17" Lightweight Laptop', '17-inch ultra-lightweight laptop with Intel 12th Gen processor and long battery life',
 'Laptops', 'LG', '17Z90Q', 'Ultrabook',
 '17" IPS Display, Intel Core i7-1260P, 16GB RAM, 1TB SSD, Intel Iris Xe Graphics, Windows 11 Pro',
 '15.0" x 10.3" x 0.7"', 2.98, 'Units', 'Dark Silver', 'Magnesium Alloy',
 '["https://example.com/lg-gram17z90q-1.jpg", "https://example.com/lg-gram17z90q-2.jpg"]',
 'Ultrabook,Lightweight,Intel i7,Long Battery', 1, 1, '8806084757890', 'LG-GRAM17Z90Q-US', 8.25, 8.00,
 40, 15, 150, 20, 75, 'Warehouse C - Computers', 1299.99, 1799.99, 1655.99, 1799.99,
 'LG Gram 17" Lightweight Laptop - Ultra Portable',
 'LG Gram 17" laptop weighs under 3 pounds with 17-inch display. Features Intel 12th Gen processor and all-day battery life.',
 'LG Gram, 17 inch laptop, ultrabook, lightweight laptop, Intel i7', GETUTCDATE()),

-- LG Gram Laptop 16" 2-in-1
(NEWID(), 'LG-GRAM16T90Q', 'LG Gram 16" 2-in-1 Laptop', '16-inch 2-in-1 laptop with touchscreen and Intel Evo platform',
 'Laptops', 'LG', '16T90Q', '2-in-1',
 '16" WQXGA Touch Display, Intel Core i7-1260P, 16GB RAM, 1TB SSD, Intel Iris Xe Graphics, Windows 11 Pro',
 '14.1" x 9.8" x 0.7"', 3.26, 'Units', 'Dark Silver', 'Magnesium Alloy',
 '["https://example.com/lg-gram16t90q-1.jpg"]',
 '2-in-1,Touchscreen,Intel Evo,Convertible', 1, 1, '8806084752345', 'LG-GRAM16T90Q-US', 8.25, 10.00,
 35, 12, 120, 18, 60, 'Warehouse C - Computers', 1499.99, 2099.99, 1889.99, 2099.99,
 'LG Gram 16" 2-in-1 Touchscreen Laptop',
 'LG Gram 16" 2-in-1 laptop with WQXGA touchscreen display. Intel Evo certified for premium performance and battery life.',
 'LG Gram, 2-in-1 laptop, touchscreen laptop, convertible laptop, Intel Evo', GETUTCDATE()),

-- LG Washing Machine
(NEWID(), 'LG-WT7305CV', 'LG 5.0 cu. ft. Top Load Washer', 'Large capacity top load washer with TurboWash and AI technology',
 'Washing Machines', 'LG', 'WT7305CV', 'Top Load',
 '5.0 cu. ft. Capacity, Top Load, TurboWash3D, AI DD, SmartThinQ, 14 Cycles',
 '27.0" x 28.0" x 43.0"', 118.0, 'Units', 'Champagne', 'Stainless Steel',
 '["https://example.com/lg-wt7305cv-1.jpg"]',
 'Top Load,TurboWash,AI DD,Smart Washer', 1, 1, '8806084756789', 'LG-WT7305CV-US', 8.25, 15.00,
 45, 10, 100, 15, 50, 'Warehouse B - Appliances', 699.99, 999.99, 849.99, 999.99,
 'LG 5.0 cu. ft. Top Load Washer with TurboWash',
 'LG top load washer with TurboWash3D technology for faster cleaning. Features AI DD for fabric care and SmartThinQ connectivity.',
 'LG washer, top load washing machine, TurboWash, AI DD, smart washer', GETUTCDATE()),

-- LG Dryer
(NEWID(), 'LG-DLE7300WE', 'LG 7.4 cu. ft. Electric Dryer', 'Large capacity electric dryer with sensor dry and smart features',
 'Dryers', 'LG', 'DLE7300WE', 'Electric',
 '7.4 cu. ft. Capacity, Electric, Sensor Dry, SmartThinQ, 14 Drying Programs, Steam Sanitary',
 '27.0" x 29.0" x 43.0"', 125.0, 'Units', 'White', 'Painted Steel',
 '["https://example.com/lg-dle7300we-1.jpg"]',
 'Electric Dryer,Sensor Dry,Steam,Smart Dryer', 1, 1, '8806084758901', 'LG-DLE7300WE-US', 8.25, 12.00,
 40, 10, 100, 15, 50, 'Warehouse B - Appliances', 599.99, 899.99, 791.99, 899.99,
 'LG 7.4 cu. ft. Electric Dryer with Sensor Dry',
 'LG electric dryer with sensor dry technology prevents over-drying. Features steam sanitize cycle and SmartThinQ connectivity.',
 'LG dryer, electric dryer, sensor dry, steam dryer, smart dryer', GETUTCDATE()),

-- LG Sound Bar
(NEWID(), 'LG-SP8YA', 'LG 3.1.2 Channel Sound Bar', 'High-resolution audio sound bar with Dolby Atmos and Meridian technology',
 'Audio', 'LG', 'SP8YA', 'Sound Bars',
 '3.1.2 Channel, 440W Total Power, Dolby Atmos, DTS:X, Meridian Technology, Wireless Subwoofer, Bluetooth',
 '40.0" x 2.2" x 5.3"', 15.4, 'Units', 'Black', 'Metal/Plastic',
 '["https://example.com/lg-sp8ya-1.jpg"]',
 'Sound Bar,Dolby Atmos,Meridian,Wireless', 1, 1, '8806084754567', 'LG-SP8YA-US', 8.25, 20.00,
 60, 20, 200, 30, 100, 'Warehouse A - Electronics', 399.99, 599.99, 479.99, 599.99,
 'LG 3.1.2 Channel Sound Bar with Dolby Atmos',
 'LG sound bar with Meridian technology and Dolby Atmos for immersive audio. Includes wireless subwoofer and Bluetooth connectivity.',
 'LG sound bar, Dolby Atmos sound bar, Meridian audio, wireless subwoofer', GETUTCDATE()),

-- LG Air Conditioner
(NEWID(), 'LG-LW1219IVSM', 'LG 12,000 BTU Smart Window Air Conditioner', 'Smart window air conditioner with dual inverter technology',
 'Air Conditioners', 'LG', 'LW1219IVSM', 'Window AC',
 '12,000 BTU, Window Type, Dual Inverter, SmartThinQ, Wi-Fi Enabled, Energy Star Certified',
 '19.5" x 21.5" x 12.1"', 85.0, 'Units', 'White', 'Plastic/Metal',
 '["https://example.com/lg-lw1219ivsm-1.jpg"]',
 'Window AC,Dual Inverter,Smart AC,Energy Star', 1, 1, '8806084753210', 'LG-LW1219IVSM-US', 8.25, 18.00,
 30, 8, 80, 12, 40, 'Warehouse B - Appliances', 449.99, 649.99, 532.99, 649.99,
 'LG 12,000 BTU Smart Window Air Conditioner',
 'LG window air conditioner with dual inverter technology for quiet, efficient cooling. SmartThinQ enabled for remote control.',
 'LG air conditioner, window AC, dual inverter AC, smart AC, Energy Star', GETUTCDATE());

-- Create optimized view for fast frontend queries
GO
CREATE VIEW [dbo].[vw_LGProducts_Fast] AS
SELECT 
    [Id],
    [ProductCode],
    [ProductName],
    [Description],
    [Brand],
    [Model],
    [Category],
    [SubCategory],
    [SellingPrice],
    [RetailPrice],
    [CurrentStock],
    [ImageUrls],
    [Tags],
    [Status],
    [CreationTime]
FROM [dbo].[AppProducts]
WHERE [Brand] = 'LG' AND [Status] = 1;

-- Create stored procedure for fast product search
GO
CREATE PROCEDURE [dbo].[sp_SearchLGProducts]
    @Category NVARCHAR(100) = NULL,
    @MinPrice DECIMAL(18,2) = NULL,
    @MaxPrice DECIMAL(18,2) = NULL,
    @InStock BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [Id],
        [ProductCode],
        [ProductName],
        [Description],
        [Brand],
        [Model],
        [Category],
        [SubCategory],
        [SellingPrice],
        [RetailPrice],
        [CurrentStock],
        [ImageUrls],
        [Tags],
        [Status],
        [CreationTime]
    FROM [dbo].[AppProducts]
    WHERE [Brand] = 'LG' 
    AND [Status] = 1
    AND (@Category IS NULL OR [Category] = @Category)
    AND (@MinPrice IS NULL OR [SellingPrice] >= @MinPrice)
    AND (@MaxPrice IS NULL OR [SellingPrice] <= @MaxPrice)
    AND (@InStock IS NULL OR [CurrentStock] > 0)
    ORDER BY [CreationTime] DESC;
END;

PRINT 'LG Products table created successfully with 10 sample products!';
PRINT 'Total products inserted: 10';
PRINT 'Created optimized view: vw_LGProducts_Fast';
PRINT 'Created stored procedure: sp_SearchLGProducts';
