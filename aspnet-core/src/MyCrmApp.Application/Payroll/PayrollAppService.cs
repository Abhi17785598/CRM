using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace MyCrmApp.Payroll
{
    [Authorize]
    public class PayrollAppService : ApplicationService
    {
        private readonly IRepository<Employee, Guid> _employeeRepository;
        private readonly IRepository<Payslip, Guid> _payslipRepository;

        public PayrollAppService(
            IRepository<Employee, Guid> employeeRepository,
            IRepository<Payslip, Guid> payslipRepository)
        {
            _employeeRepository = employeeRepository;
            _payslipRepository = payslipRepository;
        }

        // Employee Methods
        public async Task<PagedResultDto<EmployeeDto>> GetEmployeesAsync(GetEmployeesInput input)
        {
            var employees = await _employeeRepository.GetListAsync();
            var totalCount = await _employeeRepository.GetCountAsync();
            
            // Apply paging manually if needed
            var pagedEmployees = employees
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            return new PagedResultDto<EmployeeDto>(
                totalCount,
                ObjectMapper.Map<List<Employee>, List<EmployeeDto>>(pagedEmployees)
            );
        }

        public async Task<EmployeeDto> GetEmployeeAsync(Guid id)
        {
            var employee = await _employeeRepository.GetAsync(id);
            return ObjectMapper.Map<Employee, EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto input)
        {
            var employee = new Employee(
                GuidGenerator.Create(),
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

            await _employeeRepository.InsertAsync(employee);
            return ObjectMapper.Map<Employee, EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> UpdateEmployeeAsync(Guid id, UpdateEmployeeDto input)
        {
            var employee = await _employeeRepository.GetAsync(id);
            
            employee.FirstName = input.FirstName;
            employee.LastName = input.LastName;
            employee.Email = input.Email;
            employee.Phone = input.Phone;
            employee.Address = input.Address;
            employee.Department = input.Department;
            employee.Position = input.Position;
            employee.BaseSalary = input.BaseSalary;
            employee.BankAccountNumber = input.BankAccountNumber;
            employee.BankName = input.BankName;
            employee.PANNumber = input.PANNumber;

            await _employeeRepository.UpdateAsync(employee);
            return ObjectMapper.Map<Employee, EmployeeDto>(employee);
        }

        public async Task DeleteEmployeeAsync(Guid id)
        {
            await _employeeRepository.DeleteAsync(id);
        }

        public async Task TerminateEmployeeAsync(Guid id, TerminateEmployeeDto input)
        {
            var employee = await _employeeRepository.GetAsync(id);
            employee.TerminateEmployee(input.TerminationDate, input.Reason);
            await _employeeRepository.UpdateAsync(employee);
        }

        // Payslip Methods
        public async Task<PagedResultDto<PayslipDto>> GetPayslipsAsync(GetPayslipsInput input)
        {
            var payslips = await _payslipRepository.GetListAsync();
            var totalCount = await _payslipRepository.GetCountAsync();
            
            // Apply paging manually if needed
            var pagedPayslips = payslips
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            return new PagedResultDto<PayslipDto>(
                totalCount,
                ObjectMapper.Map<List<Payslip>, List<PayslipDto>>(pagedPayslips)
            );
        }

        public async Task<PayslipDto> GetPayslipAsync(Guid id)
        {
            var payslip = await _payslipRepository.GetAsync(id);
            return ObjectMapper.Map<Payslip, PayslipDto>(payslip);
        }

        public async Task<PayslipDto> CreatePayslipAsync(CreatePayslipDto input)
        {
            var payslip = new Payslip(
                GuidGenerator.Create(),
                input.PayslipNumber,
                input.EmployeeId,
                input.PayPeriodStart,
                input.PayPeriodEnd,
                input.PaymentDate,
                input.BaseSalary
            );

            if (input.OvertimeHours > 0)
            {
                payslip.AddOvertime(input.OvertimeHours, input.OvertimeRate);
            }

            if (input.Allowances > 0)
            {
                payslip.AddAllowances(input.Allowances);
            }

            await _payslipRepository.InsertAsync(payslip);
            return ObjectMapper.Map<Payslip, PayslipDto>(payslip);
        }

        public async Task<PayslipDto> UpdatePayslipAsync(Guid id, UpdatePayslipDto input)
        {
            var payslip = await _payslipRepository.GetAsync(id);
            
            payslip.PayPeriodStart = input.PayPeriodStart;
            payslip.PayPeriodEnd = input.PayPeriodEnd;
            payslip.PaymentDate = input.PaymentDate;
            payslip.BaseSalary = input.BaseSalary;
            payslip.Notes = input.Notes;

            if (input.OvertimeHours > 0)
            {
                payslip.AddOvertime(input.OvertimeHours, input.OvertimeRate);
            }

            if (input.Allowances > 0)
            {
                payslip.AddAllowances(input.Allowances);
            }

            await _payslipRepository.UpdateAsync(payslip);
            return ObjectMapper.Map<Payslip, PayslipDto>(payslip);
        }

        public async Task DeletePayslipAsync(Guid id)
        {
            await _payslipRepository.DeleteAsync(id);
        }

        public async Task<PayslipDto> ProcessPayslipAsync(Guid id, ProcessPayslipDto input)
        {
            var payslip = await _payslipRepository.GetAsync(id);
            
            payslip.CalculateDeductions(input.PFRate, input.ProfessionalTax, input.IncomeTax);
            
            if (input.OtherDeductions > 0)
            {
                payslip.AddOtherDeductions(input.OtherDeductions);
            }

            await _payslipRepository.UpdateAsync(payslip);
            return ObjectMapper.Map<Payslip, PayslipDto>(payslip);
        }

        public async Task MarkPayslipAsPaidAsync(Guid id)
        {
            var payslip = await _payslipRepository.GetAsync(id);
            payslip.MarkAsPaid();
            await _payslipRepository.UpdateAsync(payslip);
        }

        public async Task GenerateMonthlyPayslipsAsync(GenerateMonthlyPayslipsDto input)
        {
            var employees = await _employeeRepository.GetListAsync(e => e.IsActive);
            
            foreach (var employee in employees)
            {
                var payslipNumber = $"PSL-{input.Year}-{input.Month:D2}-{employee.EmployeeCode}";
                
                var existingPayslip = await _payslipRepository.FirstOrDefaultAsync(
                    p => p.PayslipNumber == payslipNumber
                );

                if (existingPayslip == null)
                {
                    var payslip = new Payslip(
                        GuidGenerator.Create(),
                        payslipNumber,
                        employee.Id,
                        input.PayPeriodStart,
                        input.PayPeriodEnd,
                        input.PaymentDate,
                        employee.BaseSalary
                    );

                    await _payslipRepository.InsertAsync(payslip);
                }
            }
        }
    }
}
