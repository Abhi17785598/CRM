using AutoMapper;
using System;

namespace MyCrmApp.CRM
{
    public class CrmAutoMapperProfile : Profile
    {
        public CrmAutoMapperProfile()
        {
            CreateMap<Customer, CustomerDto>()
                .ForMember(dest => dest.IsOverdue, opt => opt.MapFrom(src => src.IsOverdue()))
                .ForMember(dest => dest.NeedsFollowUp, opt => opt.MapFrom(src => src.NeedsFollowUp()));
            
            CreateMap<CreateCustomerDto, Customer>()
                .ConstructUsing(src => new Customer(
                    Guid.NewGuid(),
                    src.CustomerCode,
                    src.CompanyName,
                    src.Industry,
                    src.ContactPerson,
                    src.Email,
                    src.Phone,
                    src.Address,
                    src.City,
                    src.State,
                    src.Country,
                    src.PostalCode,
                    src.CustomerType
                ))
                .ForMember(dest => dest.Mobile, opt => opt.MapFrom(src => src.Mobile))
                .ForMember(dest => dest.Website, opt => opt.MapFrom(src => src.Website))
                .ForMember(dest => dest.GSTNumber, opt => opt.MapFrom(src => src.GSTNumber))
                .ForMember(dest => dest.PANNumber, opt => opt.MapFrom(src => src.PANNumber))
                .ForMember(dest => dest.CreditLimit, opt => opt.MapFrom(src => src.CreditLimit))
                .ForMember(dest => dest.PaymentTerms, opt => opt.MapFrom(src => src.PaymentTerms))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo));
            
            CreateMap<UpdateCustomerDto, Customer>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Lead, LeadDto>()
                .ForMember(dest => dest.IsHotLead, opt => opt.MapFrom(src => src.IsHotLead()))
                .ForMember(dest => dest.IsOverdue, opt => opt.MapFrom(src => src.IsOverdue()));
            
            CreateMap<CreateLeadDto, Lead>()
                .ConstructUsing(src => new Lead(
                    Guid.NewGuid(),
                    src.LeadNumber,
                    src.CompanyName,
                    src.ContactPerson,
                    src.Email,
                    src.Phone,
                    src.ProductInterest,
                    src.EstimatedValue,
                    src.Source,
                    src.Priority
                ))
                .ForMember(dest => dest.Mobile, opt => opt.MapFrom(src => src.Mobile))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo))
                .ForMember(dest => dest.ExpectedCloseDate, opt => opt.MapFrom(src => src.ExpectedCloseDate));
            
            CreateMap<UpdateLeadDto, Lead>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<SalesOpportunity, SalesOpportunityDto>()
                .ForMember(dest => dest.ExpectedRevenue, opt => opt.MapFrom(src => src.GetExpectedRevenue()))
                .ForMember(dest => dest.IsClosingSoon, opt => opt.MapFrom(src => src.IsClosingSoon()))
                .ForMember(dest => dest.IsStale, opt => opt.MapFrom(src => src.IsStale()));
            
            CreateMap<CreateOpportunityDto, SalesOpportunity>()
                .ConstructUsing(src => new SalesOpportunity(
                    Guid.NewGuid(),
                    src.OpportunityNumber,
                    src.OpportunityName,
                    src.CustomerId,
                    src.CustomerName,
                    src.ProductService,
                    src.DealValue,
                    src.Probability,
                    src.Stage,
                    src.Priority,
                    src.ExpectedCloseDate
                ))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo));
            
            CreateMap<UpdateOpportunityDto, SalesOpportunity>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
