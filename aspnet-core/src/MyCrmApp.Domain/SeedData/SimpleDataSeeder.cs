using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using MyCrmApp.Manufacturing;
using MyCrmApp.Payroll;
using MyCrmApp.CRM;

namespace MyCrmApp.SeedData
{
    public class SimpleDataSeeder : ITransientDependency
    {
        private readonly ILogger<SimpleDataSeeder> _logger;
        private readonly IRepository<ProductionOrder, Guid> _productionOrderRepository;
        private readonly IRepository<InventoryItem, Guid> _inventoryRepository;
        private readonly IRepository<Employee, Guid> _employeeRepository;
        private readonly IRepository<Payslip, Guid> _payslipRepository;
        private readonly IRepository<Customer, Guid> _customerRepository;
        private readonly IRepository<Lead, Guid> _leadRepository;
        private readonly IRepository<SalesOpportunity, Guid> _opportunityRepository;
        private readonly IRepository<Product, Guid> _productRepository;

        public SimpleDataSeeder(
            ILogger<SimpleDataSeeder> logger,
            IRepository<ProductionOrder, Guid> productionOrderRepository,
            IRepository<InventoryItem, Guid> inventoryRepository,
            IRepository<Employee, Guid> employeeRepository,
            IRepository<Payslip, Guid> payslipRepository,
            IRepository<Customer, Guid> customerRepository,
            IRepository<Lead, Guid> leadRepository,
            IRepository<SalesOpportunity, Guid> opportunityRepository,
            IRepository<Product, Guid> productRepository)
        {
            _logger = logger;
            _productionOrderRepository = productionOrderRepository;
            _inventoryRepository = inventoryRepository;
            _employeeRepository = employeeRepository;
            _payslipRepository = payslipRepository;
            _customerRepository = customerRepository;
            _leadRepository = leadRepository;
            _opportunityRepository = opportunityRepository;
            _productRepository = productRepository;
        }

        public async Task SeedAsync()
        {
            try
            {
                await SeedManufacturingDataAsync();
                await SeedPayrollDataAsync();
                await SeedCrmDataAsync();
                await SeedLGProductsAsync();

                _logger.LogInformation("Sample data seeded successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding sample data");
                throw;
            }
        }

        private async Task SeedManufacturingDataAsync()
        {
            // Sample Production Orders
            var productionOrders = new[]
            {
                new ProductionOrder(
                    Guid.NewGuid(),
                    "PO-2024-001",
                    "CNC Lathe Machine - Model XL2000",
                    5,
                    DateTime.Today.AddDays(-5),
                    DateTime.Today.AddDays(10),
                    Guid.NewGuid(), // productId
                    "Units",
                    "High"
                )
                {
                    Status = ProductionOrderStatus.InProgress,
                    Notes = "Urgent order for key client"
                },
                new ProductionOrder(
                    Guid.NewGuid(),
                    "PO-2024-002", 
                    "Industrial Steel Pipes - 2 inch",
                    100,
                    DateTime.Today.AddDays(-2),
                    DateTime.Today.AddDays(15),
                    Guid.NewGuid(), // productId
                    "Pieces",
                    "Normal"
                )
                {
                    Status = ProductionOrderStatus.Planned,
                    Notes = "Standard production run"
                },
                new ProductionOrder(
                    Guid.NewGuid(),
                    "PO-2024-003",
                    "Assembly Line Conveyor System",
                    2,
                    DateTime.Today.AddDays(-10),
                    DateTime.Today.AddDays(5),
                    Guid.NewGuid(), // productId
                    "Systems",
                    "Medium"
                )
                {
                    Status = ProductionOrderStatus.Completed,
                    Notes = "Completed ahead of schedule"
                }
            };

            foreach (var order in productionOrders)
            {
                await _productionOrderRepository.InsertAsync(order);
            }

            // Sample Inventory Items
            var inventoryItems = new[]
            {
                new InventoryItem(
                    Guid.NewGuid(),
                    "CNC-001",
                    "CNC Machine XL2000",
                    "High-precision CNC lathe machine",
                    "Machinery",
                    250000,
                    15,
                    5,
                    50,
                    "Units"
                )
                {
                    Location = "Warehouse A"
                },
                new InventoryItem(
                    Guid.NewGuid(),
                    "STEEL-002",
                    "Steel Pipes 2 inch",
                    "Industrial grade steel pipes",
                    "Raw Materials",
                    850,
                    500,
                    100,
                    2000,
                    "Pieces"
                )
                {
                    Location = "Warehouse B"
                },
                new InventoryItem(
                    Guid.NewGuid(),
                    "CONV-003",
                    "Conveyor Belt System",
                    "Automated conveyor system",
                    "Equipment",
                    75000,
                    8,
                    2,
                    20,
                    "Sets"
                )
                {
                    Location = "Warehouse C"
                }
            };

            foreach (var item in inventoryItems)
            {
                await _inventoryRepository.InsertAsync(item);
            }
        }

        private async Task SeedPayrollDataAsync()
        {
            // Sample Employees
            var employees = new[]
            {
                new Employee(
                    Guid.NewGuid(),
                    "EMP001",
                    "Rajesh",
                    "Kumar",
                    "rajesh.kumar@industryerp.com",
                    "9876543210",
                    "123 Industrial Area, Mumbai, Maharashtra 400001",
                    new DateTime(1985, 5, 15),
                    new DateTime(2020, 1, 15),
                    "Production",
                    "Production Manager",
                    85000,
                    "1234567890",
                    "State Bank of India",
                    "ABCDE1234F"
                ),
                new Employee(
                    Guid.NewGuid(),
                    "EMP002", 
                    "Priya",
                    "Sharma",
                    "priya.sharma@industryerp.com",
                    "9876543211",
                    "456 Tech Park, Bangalore, Karnataka 560001",
                    new DateTime(1990, 8, 22),
                    new DateTime(2021, 3, 10),
                    "HR",
                    "HR Manager",
                    75000,
                    "0987654321",
                    "ICICI Bank",
                    "FGHIJ5678K"
                ),
                new Employee(
                    Guid.NewGuid(),
                    "EMP003",
                    "Amit",
                    "Singh",
                    "amit.singh@industryerp.com",
                    "9876543212",
                    "789 Business Hub, Delhi, Delhi 110001",
                    new DateTime(1988, 11, 30),
                    new DateTime(2019, 6, 1),
                    "Finance",
                    "Accountant",
                    65000,
                    "1122334455",
                    "HDFC Bank",
                    "KLMNO9012P"
                )
            };

            foreach (var employee in employees)
            {
                await _employeeRepository.InsertAsync(employee);
            }

            // Sample Payslips
            var payslips = new[]
            {
                new Payslip(
                    Guid.NewGuid(),
                    "PSL-2024-001",
                    employees[0].Id,
                    DateTime.Now.AddMonths(-1),
                    DateTime.Now,
                    DateTime.Now.AddDays(-5),
                    employees[0].BaseSalary
                ),
                new Payslip(
                    Guid.NewGuid(),
                    "PSL-2024-002",
                    employees[1].Id,
                    DateTime.Now.AddMonths(-1),
                    DateTime.Now,
                    DateTime.Now.AddDays(-5),
                    employees[1].BaseSalary
                )
            };

            foreach (var payslip in payslips)
            {
                await _payslipRepository.InsertAsync(payslip);
            }
        }

        private async Task SeedCrmDataAsync()
        {
            // Sample Customers
            var customers = new[]
            {
                new Customer(
                    Guid.NewGuid(),
                    "CUST001",
                    "ABC Manufacturing Ltd",
                    "Manufacturing",
                    "Raj Kumar",
                    "raj.kumar@abcmanufacturing.com",
                    "011-23456789",
                    "123 Industrial Area, Mumbai, Maharashtra 400001",
                    "Mumbai",
                    "Maharashtra",
                    "India",
                    "400001",
                    CustomerType.Business
                )
                {
                    Mobile = "9876543210",
                    Website = "www.abcmanufacturing.com",
                    GSTNumber = "27AAAPL1234C1ZV",
                    PANNumber = "AAAPL1234C",
                    CreditLimit = 1000000,
                    CurrentBalance = 250000,
                    Notes = "Regular customer since 2020",
                    AssignedTo = "Sales Team A"
                },
                new Customer(
                    Guid.NewGuid(),
                    "CUST002",
                    "XYZ Steel Works",
                    "Steel",
                    "Amit Singh",
                    "amit.singh@xyzsteel.com",
                    "022-34567890",
                    "456 Steel Complex, Delhi, Delhi 110001",
                    "Delhi",
                    "Delhi",
                    "India",
                    "110001",
                    CustomerType.Business
                )
                {
                    Mobile = "9876543211",
                    Website = "www.xyzsteel.com",
                    GSTNumber = "07AAAPL5678B2ZY",
                    PANNumber = "AAAPL5678B",
                    CreditLimit = 750000,
                    CurrentBalance = 800000,
                    Notes = "High-value customer",
                    AssignedTo = "Sales Team B"
                }
            };

            foreach (var customer in customers)
            {
                await _customerRepository.InsertAsync(customer);
            }

            // Sample Leads
            var leads = new[]
            {
                new Lead(
                    Guid.NewGuid(),
                    "LD-2024-001",
                    "Tech Solutions India",
                    "Priya Sharma",
                    "priya.sharma@techsolutions.com",
                    "080-12345678",
                    "Industrial Machinery",
                    2500000,
                    LeadSource.Website,
                    LeadPriority.High
                )
                {
                    Mobile = "9876543212",
                    Status = LeadStatus.Qualified,
                    Priority = LeadPriority.High,
                    LeadDate = DateTime.Now.AddDays(-10),
                    FollowUpDate = DateTime.Now.AddDays(5),
                    ExpectedCloseDate = DateTime.Now.AddDays(30),
                    Description = "Interested in CNC machines for their manufacturing unit",
                    Notes = "Hot lead, follow up required",
                    AssignedTo = "Sales Team A"
                },
                new Lead(
                    Guid.NewGuid(),
                    "LD-2024-002",
                    "Global Exports Ltd",
                    "Michael Chen",
                    "michael.chen@globalexports.com",
                    "044-98765432",
                    "Steel Pipes",
                    850000,
                    LeadSource.TradeShow,
                    LeadPriority.Medium
                )
                {
                    Mobile = "9876543213",
                    Status = LeadStatus.Contacted,
                    Priority = LeadPriority.Medium,
                    LeadDate = DateTime.Now.AddDays(-7),
                    FollowUpDate = DateTime.Now.AddDays(2),
                    ExpectedCloseDate = DateTime.Now.AddDays(20),
                    Description = "Met at Industrial Trade Show 2024",
                    Notes = "Waiting for quotation approval",
                    AssignedTo = "Sales Team B"
                }
            };

            foreach (var lead in leads)
            {
                await _leadRepository.InsertAsync(lead);
            }

            // Sample Sales Opportunities
            var opportunities = new[]
            {
                new SalesOpportunity(
                    Guid.NewGuid(),
                    "OPP-2024-001",
                    "CNC Machine Purchase",
                    customers[0].Id,
                    "ABC Manufacturing Ltd",
                    "CNC Lathe Machine",
                    2500000,
                    75,
                    SalesStage.Proposal,
                    OpportunityPriority.High,
                    DateTime.Now.AddDays(15)
                )
                {
                    Description = "Purchase of 2 CNC machines for production expansion",
                    Notes = "Proposal submitted, awaiting approval",
                    AssignedTo = "Sales Team A",
                    CreatedDate = DateTime.Now.AddDays(-20),
                    LastActivityDate = DateTime.Now.AddDays(-5)
                },
                new SalesOpportunity(
                    Guid.NewGuid(),
                    "OPP-2024-002",
                    "Steel Pipe Supply Contract",
                    customers[1].Id,
                    "XYZ Steel Works",
                    "Industrial Steel Pipes",
                    1200000,
                    40,
                    SalesStage.NeedsAnalysis,
                    OpportunityPriority.Medium,
                    DateTime.Now.AddDays(30)
                )
                {
                    Description = "Annual supply contract for steel pipes",
                    Notes = "Requirements gathering in progress",
                    AssignedTo = "Sales Team B",
                    CreatedDate = DateTime.Now.AddDays(-15),
                    LastActivityDate = DateTime.Now.AddDays(-3)
                }
            };

            foreach (var opportunity in opportunities)
            {
                await _opportunityRepository.InsertAsync(opportunity);
            }
        }

        private async Task SeedLGProductsAsync()
        {
            // Skip seeding since we already populated via SQL script
            _logger.LogInformation("LG products seeding skipped - already populated via SQL script");
            return;
        }
    }
}
