using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Application.Dtos;
using MyCrmApp.EntityFrameworkCore;
using MyCrmApp.Payroll;
using MyCrmApp.Localization;

namespace MyCrmApp.Controllers
{
    [Route("api/hrms")]
    public class HRMSController : AbpControllerBase
    {
        private readonly MyCrmAppDbContext _dbContext;

        public HRMSController(MyCrmAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Employee Management
        [HttpGet]
        [Route("test")]
        public async Task<object> TestConnectionAsync()
        {
            try
            {
                // Test database connection
                var employeeCount = await _dbContext.Employees.CountAsync();
                
                return new
                {
                    success = true,
                    message = "HRMS API is working correctly",
                    employeeCount = employeeCount,
                    databaseConnected = true
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    success = false,
                    message = $"Database connection failed: {ex.Message}",
                    databaseConnected = false
                };
            }
        }

        [HttpGet]
        [Route("employees")]
        public async Task<PagedResultDto<object>> GetEmployeesAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 50)
        {
            try
            {
                List<object> employees;
                int totalCount;

                // Try to get from AppEmployees table first, then fallback to Employees table
                var tableCheckResult = await _dbContext.Database.SqlQueryRaw<CountDto>(
                    "SELECT COUNT(*) as Value FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AppEmployees'"
                ).FirstOrDefaultAsync();
                var appEmployeesExists = tableCheckResult != null && tableCheckResult.Value > 0;

                if (appEmployeesExists)
                {
                    // Use DTO class for proper type mapping - include ALL employees
                    var query = @"
                        SELECT 
                            Id,
                            ISNULL(EmployeeCode, '') as EmployeeCode,
                            ISNULL(FirstName, '') as FirstName,
                            ISNULL(LastName, '') as LastName,
                            ISNULL(Email, '') as Email,
                            ISNULL(Phone, '') as Phone,
                            ISNULL(Address, '') as Address,
                            ISNULL(DateOfBirth, '1900-01-01') as DateOfBirth,
                            ISNULL(HireDate, '1900-01-01') as HireDate,
                            ISNULL(Department, '') as Department,
                            ISNULL(Position, '') as Position,
                            ISNULL(BaseSalary, 0) as BaseSalary,
                            ISNULL(BankAccountNumber, '') as BankAccountNumber,
                            ISNULL(BankName, '') as BankName,
                            ISNULL(PANNumber, '') as PANNumber,
                            ISNULL(IsActive, 0) as IsActive,
                            ISNULL(TerminationDate, NULL) as TerminationDate,
                            ISNULL(TerminationReason, '') as TerminationReason,
                            ISNULL(CreationTime, GETDATE()) as CreationTime,
                            ISNULL(LastModificationTime, NULL) as LastModificationTime
                        FROM AppEmployees 
                        ORDER BY CreationTime DESC
                        OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY";
                    
                    var rawData = await _dbContext.Database.SqlQueryRaw<AppEmployeeDto>(query, skipCount, maxResultCount).ToListAsync();
                    employees = rawData.Cast<object>().ToList();
                    
                    var countResult = await _dbContext.Database.SqlQueryRaw<CountDto>(
                        "SELECT COUNT(*) as Value FROM AppEmployees"
                    ).FirstOrDefaultAsync();
                    totalCount = countResult?.Value ?? 0;
                }
                else
                {
                    // Fallback to Employees table
                    var employeeData = await _dbContext.Employees
                        .Skip(skipCount)
                        .Take(maxResultCount)
                        .Select(e => new
                        {
                            e.Id,
                            e.EmployeeCode,
                            e.FirstName,
                            e.LastName,
                            e.Email,
                            e.Phone,
                            e.Address,
                            e.DateOfBirth,
                            e.HireDate,
                            e.Department,
                            e.Position,
                            e.BaseSalary,
                            e.BankAccountNumber,
                            e.BankName,
                            e.PANNumber,
                            e.IsActive,
                            e.TerminationDate,
                            e.TerminationReason,
                            e.CreationTime,
                            e.LastModificationTime
                        })
                        .ToListAsync();
                    
                    employees = employeeData.Cast<object>().ToList();
                    totalCount = await _dbContext.Employees.CountAsync();
                }

                return new PagedResultDto<object>(totalCount, employees);
            }
            catch (Exception)
            {
                var emptyResult = new PagedResultDto<object>
                {
                    Items = new List<object>(),
                    TotalCount = 0
                };
                return emptyResult;
            }
        }

        [HttpGet]
        [Route("employees/{id}")]
        public async Task<object> GetEmployeeAsync(Guid id)
        {
            try
            {
                var employee = await _dbContext.Employees
                    .Where(e => e.Id == id)
                    .Select(e => new
                    {
                        e.Id,
                        e.EmployeeCode,
                        e.FirstName,
                        e.LastName,
                        e.Email,
                        e.Phone,
                        e.Address,
                        e.DateOfBirth,
                        e.HireDate,
                        e.Department,
                        e.Position,
                        e.BaseSalary,
                        e.BankAccountNumber,
                        e.BankName,
                        e.PANNumber,
                        e.IsActive,
                        e.TerminationDate,
                        e.TerminationReason,
                        e.CreationTime,
                        e.LastModificationTime
                    })
                    .FirstOrDefaultAsync();

                return employee;
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("employees")]
        public async Task<object> CreateEmployeeAsync([FromBody] CreateEmployeeRequest input)
        {
            var employee = new MyCrmApp.Payroll.Employee(
                Guid.NewGuid(),
                input.EmployeeCode,
                input.FirstName,
                input.LastName,
                input.Email,
                input.Phone,
                input.Address,
                input.DateOfBirth,
                input.HireDate,
                input.Department,
                input.Position,
                input.BaseSalary,
                input.BankAccountNumber,
                input.BankName,
                input.PANNumber
            );
            
            _dbContext.Employees.Add(employee);
            await _dbContext.SaveChangesAsync();
            
            return new { id = employee.Id, message = "Employee created successfully" };
        }

        [HttpPut]
        [Route("employees/{id}")]
        public async Task<object> UpdateEmployeeAsync(Guid id, [FromBody] UpdateEmployeeRequest input)
        {
            var employee = await _dbContext.Employees.FindAsync(id);
            if (employee == null)
            {
                return new { error = "Employee not found" };
            }

            employee.FirstName = input.FirstName ?? employee.FirstName;
            employee.LastName = input.LastName ?? employee.LastName;
            employee.Email = input.Email ?? employee.Email;
            employee.Phone = input.Phone ?? employee.Phone;
            employee.Address = input.Address ?? employee.Address;
            employee.Department = input.Department ?? employee.Department;
            employee.Position = input.Position ?? employee.Position;
            employee.BaseSalary = input.BaseSalary ?? employee.BaseSalary;
            employee.LastModificationTime = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return new { message = "Employee updated successfully" };
        }

        [HttpDelete]
        [Route("employees/{id}")]
        public async Task<object> DeleteEmployeeAsync(Guid id)
        {
            var employee = await _dbContext.Employees.FindAsync(id);
            if (employee == null)
            {
                return new { error = "Employee not found" };
            }
            
            _dbContext.Employees.Remove(employee);
            await _dbContext.SaveChangesAsync();
            
            return new { message = "Employee deleted successfully" };
        }

        // Inventory Management
        [HttpGet]
        [Route("inventory-items")]
        public async Task<object> GetInventoryItemsAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 50)
        {
            try
            {
                List<object> inventoryItems;
                int totalCount;

                // Try to get from AppInventoryItems table first, then fallback to other tables
                var tableCheckResult = await _dbContext.Database.SqlQueryRaw<CountDto>(
                    "SELECT COUNT(*) as Value FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AppInventoryItems'"
                ).FirstOrDefaultAsync();
                var inventoryItemsExists = tableCheckResult != null && tableCheckResult.Value > 0;

                if (inventoryItemsExists)
                {
                    // Use DTO class for proper type mapping
                    var query = @"
                        SELECT 
                            Id,
                            ISNULL(ItemCode, '') as ItemCode,
                            ISNULL(ItemName, '') as ItemName,
                            ISNULL(Description, '') as Description,
                            ISNULL(Category, '') as Category,
                            ISNULL(UnitOfMeasure, '') as Unit,
                            ISNULL(CurrentStock, 0) as Quantity,
                            ISNULL(UnitPrice, 0) as UnitPrice,
                            ISNULL(Location, '') as Location,
                            ISNULL('Unknown', '') as Supplier,
                            ISNULL('Active', '') as Status,
                            ISNULL(CreationTime, GETDATE()) as CreationTime,
                            ISNULL(LastModificationTime, NULL) as LastModificationTime
                        FROM AppInventoryItems 
                        ORDER BY CreationTime DESC
                        OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY";
                    
                    var rawData = await _dbContext.Database.SqlQueryRaw<InventoryItemDto>(query, skipCount, maxResultCount).ToListAsync();
                    inventoryItems = rawData.Cast<object>().ToList();
                    
                    var countResult = await _dbContext.Database.SqlQueryRaw<CountDto>(
                        "SELECT COUNT(*) as Value FROM AppInventoryItems"
                    ).FirstOrDefaultAsync();
                    totalCount = countResult?.Value ?? 0;
                }
                else
                {
                    // Fallback to empty list if no inventory table exists
                    inventoryItems = new List<object>();
                    totalCount = 0;
                }

                return new PagedResultDto<object>(totalCount, inventoryItems);
            }
            catch (Exception)
            {
                return new PagedResultDto<object>(0, new List<object>());
            }
        }

        // Payslip Management
        [HttpGet]
        [Route("payslips")]
        public async Task<object> GetPayslipsAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 50)
        {
            try
            {
                List<object> payslips;
                int totalCount;

                // Try to get from AppPayslips table first, then fallback to other tables
                var appPayslipsExists = await _dbContext.Database.SqlQueryRaw<CountDto>(
                    "SELECT COUNT(*) as Value FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AppPayslips'"
                ).FirstOrDefaultAsync();
                var payslipsExists = appPayslipsExists != null && appPayslipsExists.Value > 0;

                if (payslipsExists)
                {
                    // Use DTO class for proper type mapping
                    var query = @"
                        SELECT 
                            Id,
                            ISNULL(PayslipNumber, '') as PayslipNumber,
                            ISNULL(EmployeeId, '00000000-0000-0000-0000-000000000000') as EmployeeId,
                            ISNULL(PayPeriodStart, GETDATE()) as PayPeriodStart,
                            ISNULL(PayPeriodEnd, GETDATE()) as PayPeriodEnd,
                            ISNULL(PaymentDate, GETDATE()) as PaymentDate,
                            ISNULL(BaseSalary, 0) as BaseSalary,
                            ISNULL(NetSalary, 0) as NetSalary,
                            ISNULL(PaymentStatus, 'Pending') as PaymentStatus,
                            ISNULL(CreationTime, GETDATE()) as CreationTime,
                            ISNULL(LastModificationTime, NULL) as LastModificationTime
                        FROM AppPayslips 
                        ORDER BY CreationTime DESC
                        OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY";
                    
                    var rawData = await _dbContext.Database.SqlQueryRaw<PayslipDto>(query, skipCount, maxResultCount).ToListAsync();
                    payslips = rawData.Cast<object>().ToList();
                    
                    var countResult = await _dbContext.Database.SqlQueryRaw<CountDto>(
                        "SELECT COUNT(*) as Value FROM AppPayslips"
                    ).FirstOrDefaultAsync();
                    totalCount = countResult?.Value ?? 0;
                }
                else
                {
                    // Fallback to empty list if no payslips table exists
                    payslips = new List<object>();
                    totalCount = 0;
                }

                return new PagedResultDto<object>(totalCount, payslips);
            }
            catch (Exception)
            {
                return new PagedResultDto<object>(0, new List<object>());
            }
        }

        // Analytics
        [HttpGet]
        [Route("analytics/employees")]
        public async Task<object> GetEmployeeStatsAsync()
        {
            var totalEmployees = await _dbContext.Employees.CountAsync();
            var activeEmployees = await _dbContext.Employees.CountAsync(e => e.IsActive);
            var onLeaveEmployees = await _dbContext.Employees.CountAsync(e => !e.IsActive && e.TerminationDate.HasValue);
            
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;
            var newHires = await _dbContext.Employees.CountAsync(e => 
                e.HireDate.Month == currentMonth && 
                e.HireDate.Year == currentYear);
            
            return new
            {
                totalEmployees = totalEmployees,
                activeEmployees = activeEmployees,
                onLeaveEmployees = onLeaveEmployees,
                newHires = newHires
            };
        }

        [HttpGet]
        [Route("analytics/payroll")]
        public async Task<object> GetPayrollStatsAsync()
        {
            var totalPayslips = await _dbContext.Payslips.CountAsync();
            var totalPayroll = await _dbContext.Payslips.SumAsync(p => p.NetPay);
            var approvedPayslips = await _dbContext.Payslips.CountAsync(p => p.PaymentStatus == "Approved");
            
            return new
            {
                totalPayslips = totalPayslips,
                totalPayroll = totalPayroll,
                approvedPayslips = approvedPayslips
            };
        }
    }
}

// Helper classes for SQL query results
public class CountDto
{
    public int Value { get; set; }
}

public class AppEmployeeDto
{
    public Guid Id { get; set; }
    public string EmployeeCode { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DateTime HireDate { get; set; }
    public string Department { get; set; }
    public string Position { get; set; }
    public decimal BaseSalary { get; set; }
    public string BankAccountNumber { get; set; }
    public string BankName { get; set; }
    public string PANNumber { get; set; }
    public bool IsActive { get; set; }
    public DateTime? TerminationDate { get; set; }
    public string TerminationReason { get; set; }
    public DateTime CreationTime { get; set; }
    public DateTime? LastModificationTime { get; set; }
}

public class InventoryItemDto
{
    public Guid Id { get; set; }
    public string ItemCode { get; set; }
    public string ItemName { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string Unit { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Location { get; set; }
    public string Supplier { get; set; }
    public string Status { get; set; }
    public DateTime CreationTime { get; set; }
    public DateTime? LastModificationTime { get; set; }
}

public class PayslipDto
{
    public Guid Id { get; set; }
    public string PayslipNumber { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime PayPeriodStart { get; set; }
    public DateTime PayPeriodEnd { get; set; }
    public DateTime PaymentDate { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal NetSalary { get; set; }
    public string PaymentStatus { get; set; }
    public DateTime CreationTime { get; set; }
    public DateTime? LastModificationTime { get; set; }
}

public class CreateEmployeeRequest
{
    public string EmployeeCode { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DateTime HireDate { get; set; }
    public string Department { get; set; }
    public string Position { get; set; }
    public decimal BaseSalary { get; set; }
    public string BankAccountNumber { get; set; }
    public string BankName { get; set; }
    public string PANNumber { get; set; }
}

public class UpdateEmployeeRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string Department { get; set; }
    public string Position { get; set; }
    public decimal? BaseSalary { get; set; }
}

public class CreatePayslipRequest
{
    public string PayslipNumber { get; set; }
    public Guid EmployeeId { get; set; }
    public string PayPeriod { get; set; }
    public DateTime PayDate { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Allowances { get; set; }
    public decimal Deductions { get; set; }
}