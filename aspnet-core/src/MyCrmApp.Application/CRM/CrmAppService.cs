using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace MyCrmApp.CRM
{
    [Authorize]
    public class CrmAppService : ApplicationService
    {
        private readonly IRepository<Customer, Guid> _customerRepository;
        private readonly IRepository<Lead, Guid> _leadRepository;
        private readonly IRepository<SalesOpportunity, Guid> _opportunityRepository;

        public CrmAppService(
            IRepository<Customer, Guid> customerRepository,
            IRepository<Lead, Guid> leadRepository,
            IRepository<SalesOpportunity, Guid> opportunityRepository)
        {
            _customerRepository = customerRepository;
            _leadRepository = leadRepository;
            _opportunityRepository = opportunityRepository;
        }

        // Customer Methods
        public async Task<PagedResultDto<CustomerDto>> GetCustomersAsync(GetCustomersInput input)
        {
            var customers = await _customerRepository.GetListAsync();
            var totalCount = await _customerRepository.GetCountAsync();
            
            // Apply paging manually if needed
            var pagedCustomers = customers
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            return new PagedResultDto<CustomerDto>(
                totalCount,
                ObjectMapper.Map<List<Customer>, List<CustomerDto>>(pagedCustomers)
            );
        }

        public async Task<CustomerDto> GetCustomerAsync(Guid id)
        {
            var customer = await _customerRepository.GetAsync(id);
            return ObjectMapper.Map<Customer, CustomerDto>(customer);
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto input)
        {
            var customer = new Customer(
                GuidGenerator.Create(),
                input.CustomerCode,
                input.CompanyName,
                input.Industry,
                input.ContactPerson,
                input.Email,
                input.Phone,
                input.Address,
                input.City,
                input.State,
                input.Country,
                input.PostalCode,
                input.CustomerType
            );

            customer.Mobile = input.Mobile;
            customer.Website = input.Website;
            customer.GSTNumber = input.GSTNumber;
            customer.PANNumber = input.PANNumber;
            customer.CreditLimit = input.CreditLimit;
            customer.PaymentTerms = input.PaymentTerms;
            customer.Notes = input.Notes;
            customer.AssignedTo = input.AssignedTo;

            await _customerRepository.InsertAsync(customer);
            return ObjectMapper.Map<Customer, CustomerDto>(customer);
        }

        public async Task<CustomerDto> UpdateCustomerAsync(Guid id, UpdateCustomerDto input)
        {
            var customer = await _customerRepository.GetAsync(id);
            
            customer.CompanyName = input.CompanyName;
            customer.Industry = input.Industry;
            customer.ContactPerson = input.ContactPerson;
            customer.Email = input.Email;
            customer.Phone = input.Phone;
            customer.Mobile = input.Mobile;
            customer.Address = input.Address;
            customer.City = input.City;
            customer.State = input.State;
            customer.Country = input.Country;
            customer.PostalCode = input.PostalCode;
            customer.Website = input.Website;
            customer.GSTNumber = input.GSTNumber;
            customer.PANNumber = input.PANNumber;
            customer.CustomerType = input.CustomerType;
            customer.CreditLimit = input.CreditLimit;
            customer.PaymentTerms = input.PaymentTerms;
            customer.Notes = input.Notes;
            customer.AssignedTo = input.AssignedTo;

            await _customerRepository.UpdateAsync(customer);
            return ObjectMapper.Map<Customer, CustomerDto>(customer);
        }

        public async Task DeleteCustomerAsync(Guid id)
        {
            await _customerRepository.DeleteAsync(id);
        }

        // Lead Methods
        public async Task<PagedResultDto<LeadDto>> GetLeadsAsync(GetLeadsInput input)
        {
            var leads = await _leadRepository.GetListAsync();
            var totalCount = await _leadRepository.GetCountAsync();
            
            // Apply paging manually if needed
            var pagedLeads = leads
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            return new PagedResultDto<LeadDto>(
                totalCount,
                ObjectMapper.Map<List<Lead>, List<LeadDto>>(pagedLeads)
            );
        }

        public async Task<LeadDto> GetLeadAsync(Guid id)
        {
            var lead = await _leadRepository.GetAsync(id);
            return ObjectMapper.Map<Lead, LeadDto>(lead);
        }

        public async Task<LeadDto> CreateLeadAsync(CreateLeadDto input)
        {
            var lead = new Lead(
                GuidGenerator.Create(),
                input.LeadNumber,
                input.CompanyName,
                input.ContactPerson,
                input.Email,
                input.Phone,
                input.ProductInterest,
                input.EstimatedValue,
                input.Source,
                input.Priority
            );

            lead.Mobile = input.Mobile;
            lead.Description = input.Description;
            lead.Notes = input.Notes;
            lead.AssignedTo = input.AssignedTo;
            lead.ExpectedCloseDate = input.ExpectedCloseDate;

            await _leadRepository.InsertAsync(lead);
            return ObjectMapper.Map<Lead, LeadDto>(lead);
        }

        public async Task<LeadDto> UpdateLeadAsync(Guid id, UpdateLeadDto input)
        {
            var lead = await _leadRepository.GetAsync(id);
            
            lead.CompanyName = input.CompanyName;
            lead.ContactPerson = input.ContactPerson;
            lead.Email = input.Email;
            lead.Phone = input.Phone;
            lead.Mobile = input.Mobile;
            lead.ProductInterest = input.ProductInterest;
            lead.EstimatedValue = input.EstimatedValue;
            lead.Priority = input.Priority;
            lead.Description = input.Description;
            lead.Notes = input.Notes;
            lead.AssignedTo = input.AssignedTo;
            lead.ExpectedCloseDate = input.ExpectedCloseDate;

            await _leadRepository.UpdateAsync(lead);
            return ObjectMapper.Map<Lead, LeadDto>(lead);
        }

        public async Task DeleteLeadAsync(Guid id)
        {
            await _leadRepository.DeleteAsync(id);
        }

        public async Task<LeadDto> ConvertLeadToCustomerAsync(Guid id, ConvertLeadToCustomerDto input)
        {
            var lead = await _leadRepository.GetAsync(id);
            
            // Create customer from lead
            var customer = new Customer(
                GuidGenerator.Create(),
                input.CustomerCode,
                lead.CompanyName,
                "Manufacturing", // Default industry
                lead.ContactPerson,
                lead.Email,
                lead.Phone,
                "", // Address
                "", // City
                "", // State
                "", // Country
                "", // PostalCode
                CustomerType.Business
            );

            customer.Mobile = lead.Mobile;
            customer.AssignedTo = lead.AssignedTo;

            await _customerRepository.InsertAsync(customer);

            // Update lead status
            lead.ConvertToCustomer(customer.Id);
            await _leadRepository.UpdateAsync(lead);

            return ObjectMapper.Map<Lead, LeadDto>(lead);
        }

        // Sales Opportunity Methods
        public async Task<PagedResultDto<SalesOpportunityDto>> GetOpportunitiesAsync(GetOpportunitiesInput input)
        {
            var opportunities = await _opportunityRepository.GetListAsync();
            var totalCount = await _opportunityRepository.GetCountAsync();
            
            // Apply paging manually if needed
            var pagedOpportunities = opportunities
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToList();

            return new PagedResultDto<SalesOpportunityDto>(
                totalCount,
                ObjectMapper.Map<List<SalesOpportunity>, List<SalesOpportunityDto>>(pagedOpportunities)
            );
        }

        public async Task<SalesOpportunityDto> GetOpportunityAsync(Guid id)
        {
            var opportunity = await _opportunityRepository.GetAsync(id);
            return ObjectMapper.Map<SalesOpportunity, SalesOpportunityDto>(opportunity);
        }

        public async Task<SalesOpportunityDto> CreateOpportunityAsync(CreateOpportunityDto input)
        {
            var opportunity = new SalesOpportunity(
                GuidGenerator.Create(),
                input.OpportunityNumber,
                input.OpportunityName,
                input.CustomerId,
                input.CustomerName,
                input.ProductService,
                input.DealValue,
                input.Probability,
                input.Stage,
                input.Priority,
                input.ExpectedCloseDate
            );

            opportunity.Description = input.Description;
            opportunity.Notes = input.Notes;
            opportunity.AssignedTo = input.AssignedTo;

            await _opportunityRepository.InsertAsync(opportunity);
            return ObjectMapper.Map<SalesOpportunity, SalesOpportunityDto>(opportunity);
        }

        public async Task<SalesOpportunityDto> UpdateOpportunityAsync(Guid id, UpdateOpportunityDto input)
        {
            var opportunity = await _opportunityRepository.GetAsync(id);
            
            opportunity.OpportunityName = input.OpportunityName;
            opportunity.ProductService = input.ProductService;
            opportunity.DealValue = input.DealValue;
            opportunity.Probability = input.Probability;
            opportunity.Stage = input.Stage;
            opportunity.Priority = input.Priority;
            opportunity.ExpectedCloseDate = input.ExpectedCloseDate;
            opportunity.Description = input.Description;
            opportunity.Notes = input.Notes;
            opportunity.AssignedTo = input.AssignedTo;

            await _opportunityRepository.UpdateAsync(opportunity);
            return ObjectMapper.Map<SalesOpportunity, SalesOpportunityDto>(opportunity);
        }

        public async Task DeleteOpportunityAsync(Guid id)
        {
            await _opportunityRepository.DeleteAsync(id);
        }

        public async Task<SalesOpportunityDto> MoveOpportunityStageAsync(Guid id, MoveStageDto input)
        {
            var opportunity = await _opportunityRepository.GetAsync(id);
            
            if (input.Direction == "Next")
            {
                opportunity.MoveToNextStage();
            }
            else if (input.Direction == "Previous")
            {
                opportunity.MoveToPreviousStage();
            }

            await _opportunityRepository.UpdateAsync(opportunity);
            return ObjectMapper.Map<SalesOpportunity, SalesOpportunityDto>(opportunity);
        }

        public async Task<SalesOpportunityDto> WinOpportunityAsync(Guid id)
        {
            var opportunity = await _opportunityRepository.GetAsync(id);
            opportunity.WinDeal();
            await _opportunityRepository.UpdateAsync(opportunity);
            return ObjectMapper.Map<SalesOpportunity, SalesOpportunityDto>(opportunity);
        }

        public async Task<SalesOpportunityDto> LoseOpportunityAsync(Guid id, LoseOpportunityDto input)
        {
            var opportunity = await _opportunityRepository.GetAsync(id);
            opportunity.LoseDeal(input.Reason);
            await _opportunityRepository.UpdateAsync(opportunity);
            return ObjectMapper.Map<SalesOpportunity, SalesOpportunityDto>(opportunity);
        }
    }
}
