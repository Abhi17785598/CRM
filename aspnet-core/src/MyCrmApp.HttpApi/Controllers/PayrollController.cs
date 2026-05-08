using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Controllers
{
    [Route("api/payroll")]
    public class PayrollController : MyCrmAppController
    {
        // Demo Employees Data
        private static readonly List<object> _demoEmployees = new List<object>
        {
            new { 
                id = Guid.NewGuid(), 
                employeeCode = "EMP-001", 
                firstName = "John", 
                lastName = "Doe", 
                email = "john.doe@company.com", 
                phone = "123-456-7890",
                department = "Production",
                position = "Production Manager",
                salary = 75000,
                hireDate = DateTime.Now.AddYears(-2),
                status = 1, // Active
                bankAccount = "1234567890"
            },
            new { 
                id = Guid.NewGuid(), 
                employeeCode = "EMP-002", 
                firstName = "Jane", 
                lastName = "Smith", 
                email = "jane.smith@company.com", 
                phone = "098-765-4321",
                department = "HR",
                position = "HR Manager",
                salary = 65000,
                hireDate = DateTime.Now.AddYears(-1),
                status = 1, // Active
                bankAccount = "0987654321"
            },
            new { 
                id = Guid.NewGuid(), 
                employeeCode = "EMP-003", 
                firstName = "Mike", 
                lastName = "Johnson", 
                email = "mike.johnson@company.com", 
                phone = "555-123-4567",
                department = "Finance",
                position = "Accountant",
                salary = 55000,
                hireDate = DateTime.Now.AddMonths(-6),
                status = 1, // Active
                bankAccount = "5551234567"
            }
        };

        // Demo Payslips Data
        private static readonly List<object> _demoPayslips = new List<object>
        {
            new { 
                id = Guid.NewGuid(), 
                employeeId = Guid.NewGuid(), 
                employeeName = "John Doe", 
                payPeriod = "January 2024", 
                basicSalary = 6250,
                overtimePay = 750,
                deductions = 1200,
                netSalary = 5800,
                payDate = DateTime.Now.AddDays(-5),
                status = 1 // Paid
            },
            new { 
                id = Guid.NewGuid(), 
                employeeId = Guid.NewGuid(), 
                employeeName = "Jane Smith", 
                payPeriod = "January 2024", 
                basicSalary = 5416.67m,
                overtimePay = 500,
                deductions = 950,
                netSalary = 4966.67m,
                payDate = DateTime.Now.AddDays(-5),
                status = 1 // Paid
            }
        };

        [HttpGet]
        [Route("employees")]
        public async Task<PagedResultDto<object>> GetEmployeesAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var pagedEmployees = _demoEmployees.Skip(skipCount).Take(maxResultCount).ToList();
            return new PagedResultDto<object>
            {
                Items = pagedEmployees,
                TotalCount = _demoEmployees.Count
            };
        }

        [HttpPost]
        [Route("employees")]
        public async Task<object> CreateEmployeeAsync([FromBody] object input)
        {
            var newEmployee = new {
                id = Guid.NewGuid(),
                employeeCode = $"EMP-{DateTime.Now:HHmmss}",
                firstName = "New",
                lastName = "Employee",
                email = "new.employee@company.com",
                phone = "555-000-0000",
                department = "General",
                position = "Staff",
                salary = 40000,
                hireDate = DateTime.Now,
                status = 1, // Active
                bankAccount = "0000000000"
            };
            
            _demoEmployees.Add(newEmployee);
            return newEmployee;
        }

        [HttpGet]
        [Route("payslips")]
        public async Task<PagedResultDto<object>> GetPayslipsAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var pagedPayslips = _demoPayslips.Skip(skipCount).Take(maxResultCount).ToList();
            return new PagedResultDto<object>
            {
                Items = pagedPayslips,
                TotalCount = _demoPayslips.Count
            };
        }

        [HttpPost]
        [Route("payslips")]
        public async Task<object> CreatePayslipAsync([FromBody] object input)
        {
            var newPayslip = new {
                id = Guid.NewGuid(),
                employeeId = Guid.NewGuid(),
                employeeName = "New Employee",
                payPeriod = $"{DateTime.Now:MMMM yyyy}",
                basicSalary = 4000,
                overtimePay = 0,
                deductions = 800,
                netSalary = 3200,
                payDate = DateTime.Now,
                status = 0 // Pending
            };
            
            _demoPayslips.Add(newPayslip);
            return newPayslip;
        }
    }
}
