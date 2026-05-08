-- Create Orders table migration
CREATE TABLE [dbo].[AppOrders] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [OrderId] NVARCHAR(50) NOT NULL,
    [CustomerName] NVARCHAR(200) NOT NULL,
    [Amount] DECIMAL(18,2) NOT NULL,
    [Status] NVARCHAR(50) NOT NULL,
    [ProductDescription] NVARCHAR(500) NOT NULL,
    [OrderDate] DATETIME2 NOT NULL,
    [DeliveryDate] DATETIME2 NULL,
    [PaymentMethod] NVARCHAR(100) NOT NULL,
    [ShippingAddress] NVARCHAR(200) NOT NULL,
    [Notes] NVARCHAR(500) NULL,
    [AssignedTo] NVARCHAR(100) NOT NULL,
    [CreationTime] DATETIME2 NOT NULL,
    [LastModificationTime] DATETIME2 NULL,
    CONSTRAINT [PK_AppOrders] PRIMARY KEY ([Id])
);

GO

-- Insert sample data
INSERT INTO [dbo].[AppOrders] ([OrderId], [CustomerName], [Amount], [Status], [ProductDescription], [OrderDate], [PaymentMethod], [ShippingAddress], [Notes], [AssignedTo], [CreationTime])
VALUES 
    ('ORD-001', 'Tech Solutions Inc.', 15000.00, 'Delivered', 'Enterprise Software License', GETDATE(), 'Bank Transfer', '123 Tech Street, Bangalore, India', 'Priority customer - expedited delivery', 'Sales Team A', GETDATE()),
    ('ORD-002', 'Manufacturing Co.', 8500.00, 'Processing', 'Industrial Equipment Parts', GETDATE(), 'Credit Card', '456 Industry Ave, Mumbai, India', 'Standard delivery required', 'Sales Team B', GETDATE()),
    ('ORD-003', 'Retail Solutions Ltd.', 22000.00, 'Pending', 'Point of Sale System', GETDATE(), 'Net Banking', '789 Commerce Blvd, Delhi, India', 'Installation required', 'Sales Team C', GETDATE()),
    ('ORD-004', 'Global Industries Corp.', 45000.00, 'Shipped', 'Manufacturing Equipment', DATEADD(day, -2, GETDATE()), 'Wire Transfer', '789 Industrial Park, Pune, India', 'International shipping required', 'Sales Team A', GETDATE()),
    ('ORD-005', 'Smart Systems Ltd.', 32000.00, 'Processing', 'IoT Sensors and Controllers', DATEADD(day, -5, GETDATE()), 'Online Payment', '456 Tech Park, Hyderabad, India', 'Technical consultation needed', 'Sales Team B', GETDATE()),
    ('ORD-006', 'PowerGrid Energy', 18000.00, 'Delivered', 'Solar Panel Installation', DATEADD(day, -10, GETDATE()), 'Bank Transfer', '123 Renewable Energy Dr, Chennai, India', 'Government project - priority delivery', 'Sales Team C', GETDATE()),
    ('ORD-007', 'AutoParts Plus', 9500.00, 'Pending', 'Automotive Spare Parts', DATEADD(day, -1, GETDATE()), 'Cash on Delivery', '567 Motor Parts St, Delhi, India', 'Urgent delivery requested', 'Sales Team A', GETDATE()),
    ('ORD-008', 'Construction Materials Co.', 56000.00, 'Processing', 'Building Materials', DATEADD(day, -3, GETDATE()), 'Credit Card', '789 Construction Site, Mumbai, India', 'Bulk order - site delivery', 'Sales Team B', GETDATE()),
    ('ORD-009', 'FoodTech Industries', 28000.00, 'Delivered', 'Food Processing Equipment', DATEADD(day, -15, GETDATE()), 'Bank Transfer', '321 Food Processing Zone, Delhi, India', 'Food grade equipment', 'Sales Team C', GETDATE()),
    ('ORD-010', 'Textile Mills Ltd.', 41000.00, 'Shipped', 'Textile Machinery', DATEADD(day, -7, GETDATE()), 'Letter of Credit', '987 Textile Estate, Surat, India', 'Export quality inspection pending', 'Sales Team A', GETDATE()),
    ('ORD-011', 'PharmaMed Solutions', 67000.00, 'Pending', 'Medical Equipment', DATEADD(day, -4, GETDATE()), 'Net Banking', '456 Medical Park, Bangalore, India', 'Medical certification required', 'Sales Team C', GETDATE()),
    ('ORD-012', 'Logistics Solutions Inc.', 39000.00, 'Delivered', 'Logistics Software', DATEADD(day, -8, GETDATE()), 'Wire Transfer', '123 Logistics Hub, Delhi, India', 'Annual contract - standard delivery', 'Sales Team A', GETDATE()),
    ('ORD-013', 'Steel Fabricators Ltd.', 52000.00, 'Processing', 'Steel Fabrication Tools', DATEADD(day, -6, GETDATE()), 'Purchase Order', '789 Steel Industrial Area, Jamshedpur, India', 'Heavy machinery delivery', 'Sales Team B', GETDATE()),
    ('ORD-014', 'ChemCo Industries', 78000.00, 'Delivered', 'Chemical Processing Equipment', DATEADD(day, -12, GETDATE()), 'Documentary Credit', '654 Chemical Zone, Mumbai, India', 'Safety inspection completed', 'Sales Team C', GETDATE()),
    ('ORD-015', 'ElectroTech Solutions', 23000.00, 'Pending', 'Electronic Components', DATEADD(day, -2, GETDATE()), 'Online Payment', '890 Electronics Park, Bangalore, India', 'Prototype approval pending', 'Sales Team B', GETDATE()),
    ('ORD-016', 'Mineral Extractors Co.', 89000.00, 'Shipped', 'Mining Equipment', DATEADD(day, -20, GETDATE()), 'Bank Guarantee', '456 Mining Region, Jamshedpur, India', 'Heavy equipment transport', 'Sales Team A', GETDATE());

GO

-- Update total orders count in home component (optional)
-- You can update the totalOrders property in home.component.ts to fetch from database
-- Example: this.orderService.getOrders().subscribe(response => this.totalOrders = response.totalCount);
