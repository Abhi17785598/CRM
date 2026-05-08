using AutoMapper;
using System;

namespace MyCrmApp.Payroll
{
    public class PayrollAutoMapperProfile : Profile
    {
        public PayrollAutoMapperProfile()
        {
            CreateMap<Employee, EmployeeDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.GetFullName()))
                .ForMember(dest => dest.YearsOfService, opt => opt.MapFrom(src => src.GetYearsOfService()));
            
            CreateMap<CreateEmployeeDto, Employee>()
                .ConstructUsing(src => new Employee(
                    Guid.NewGuid(),
                    src.EmployeeCode,
                    src.FirstName,
                    src.LastName,
                    src.Email,
                    src.Phone,
                    src.Address,
                    src.DateOfBirth,
                    src.HireDate,
                    src.Department,
                    src.Position,
                    src.BaseSalary,
                    src.BankAccountNumber,
                    src.BankName,
                    src.PANNumber
                ));
            
            CreateMap<UpdateEmployeeDto, Employee>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Payslip, PayslipDto>()
                .ForMember(dest => dest.EmployeeName, opt => opt.Ignore()); // Will be set in service
            
            CreateMap<CreatePayslipDto, Payslip>()
                .ConstructUsing(src => new Payslip(
                    Guid.NewGuid(),
                    src.PayslipNumber,
                    src.EmployeeId,
                    src.PayPeriodStart,
                    src.PayPeriodEnd,
                    src.PaymentDate,
                    src.BaseSalary
                ))
                .ForMember(dest => dest.OvertimeHours, opt => opt.MapFrom(src => src.OvertimeHours))
                .ForMember(dest => dest.OvertimeRate, opt => opt.MapFrom(src => src.OvertimeRate))
                .ForMember(dest => dest.Allowances, opt => opt.MapFrom(src => src.Allowances));
            
            CreateMap<UpdatePayslipDto, Payslip>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
