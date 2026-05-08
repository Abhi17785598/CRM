using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using MyCrmApp.Localization;
using MyCrmApp.CRM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using MyCrmApp.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MyCrmApp.Controllers
{
    [Route("api/crm")]
    public class CRMController : MyCrmAppController
    {
        private readonly MyCrmAppDbContext _dbContext;

        public CRMController(MyCrmAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Test endpoint
        [HttpGet]
        [Route("test")]
        public async Task<object> TestAsync()
        {
            return new { message = "CRM API is working", timestamp = DateTime.Now };
        }

        // Customer Management
        [HttpGet]
        [Route("customers")]
        public async Task<PagedResultDto<object>> GetCustomersAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var customers = await _dbContext.Customers
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(c => new
                {
                    c.Id,
                    c.CustomerCode,
                    c.CompanyName,
                    c.Industry,
                    c.ContactPerson,
                    c.Email,
                    c.Phone,
                    c.Mobile,
                    c.Address,
                    c.City,
                    c.State,
                    c.Country,
                    c.PostalCode,
                    c.Website,
                    c.GSTNumber,
                    c.PANNumber,
                    c.CustomerType,
                    c.Status,
                    c.CreditLimit,
                    c.CurrentBalance,
                    c.PaymentTerms,
                    c.Notes,
                    c.LastContactDate,
                    c.NextFollowUpDate,
                    c.AssignedTo,
                    c.CreationTime,
                    c.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.Customers.CountAsync();

            return new PagedResultDto<object>
            {
                Items = customers,
                TotalCount = totalCount
            };
        }

        [HttpGet]
        [Route("customers/{id}")]
        public async Task<object> GetCustomerAsync(Guid id)
        {
            var customer = await _dbContext.Customers
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.CustomerCode,
                    c.CompanyName,
                    c.Industry,
                    c.ContactPerson,
                    c.Email,
                    c.Phone,
                    c.Mobile,
                    c.Address,
                    c.City,
                    c.State,
                    c.Country,
                    c.PostalCode,
                    c.Website,
                    c.GSTNumber,
                    c.PANNumber,
                    c.CustomerType,
                    c.Status,
                    c.CreditLimit,
                    c.CurrentBalance,
                    c.PaymentTerms,
                    c.Notes,
                    c.LastContactDate,
                    c.NextFollowUpDate,
                    c.AssignedTo,
                    c.CreationTime,
                    c.LastModificationTime
                })
                .FirstOrDefaultAsync();

            return customer;
        }

        [HttpPost]
        [Route("customers")]
        public async Task<object> CreateCustomerAsync([FromBody] CreateCustomerRequest input)
        {
            var customer = new MyCrmApp.CRM.Customer(
                Guid.NewGuid(),
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
            customer.CurrentBalance = input.CurrentBalance;
            customer.PaymentTerms = input.PaymentTerms;
            customer.Notes = input.Notes;
            customer.LastContactDate = input.LastContactDate;
            customer.NextFollowUpDate = input.NextFollowUpDate;
            customer.AssignedTo = input.AssignedTo;

            _dbContext.Customers.Add(customer);
            await _dbContext.SaveChangesAsync();

            return new { id = customer.Id, message = "Customer created successfully" };
        }

        [HttpPut]
        [Route("customers/{id}")]
        public async Task<object> UpdateCustomerAsync(Guid id, [FromBody] UpdateCustomerRequest input)
        {
            var customer = await _dbContext.Customers.FindAsync(id);
            if (customer == null)
            {
                return new { error = "Customer not found" };
            }

            customer.CompanyName = input.CompanyName ?? customer.CompanyName;
            customer.ContactPerson = input.ContactPerson ?? customer.ContactPerson;
            customer.Email = input.Email ?? customer.Email;
            customer.Phone = input.Phone ?? customer.Phone;
            customer.Mobile = input.Mobile ?? customer.Mobile;
            customer.Address = input.Address ?? customer.Address;
            customer.City = input.City ?? customer.City;
            customer.State = input.State ?? customer.State;
            customer.Country = input.Country ?? customer.Country;
            customer.PostalCode = input.PostalCode ?? customer.PostalCode;
            customer.Website = input.Website ?? customer.Website;
            customer.Notes = input.Notes ?? customer.Notes;
            customer.LastModificationTime = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return new { message = "Customer updated successfully" };
        }

        [HttpDelete]
        [Route("customers/{id}")]
        public async Task<object> DeleteCustomerAsync(Guid id)
        {
            var customer = await _dbContext.Customers.FindAsync(id);
            if (customer == null)
            {
                return new { error = "Customer not found" };
            }

            _dbContext.Customers.Remove(customer);
            await _dbContext.SaveChangesAsync();

            return new { message = "Customer deleted successfully" };
        }

        // AppCustomers Management - Fetch from AppCustomers table
        [HttpGet]
        [Route("appcustomers")]
        public async Task<object> GetAppCustomersAsync()
        {
            try
            {
                // Get from AppCustomers table using Customer entity
                var appCustomers = await _dbContext.Customers
                    .Select(c => new
                    {
                        c.Id,
                        c.CustomerCode,
                        c.CompanyName,
                        c.Industry,
                        c.ContactPerson,
                        c.Email,
                        c.Phone,
                        c.Mobile,
                        c.Address,
                        c.City,
                        c.State,
                        c.Country,
                        c.PostalCode,
                        c.Website,
                        c.GSTNumber,
                        c.PANNumber,
                        c.CustomerType,
                        c.Status,
                        c.CreditLimit,
                        c.CurrentBalance,
                        c.PaymentTerms,
                        c.Notes,
                        c.LastContactDate,
                        c.NextFollowUpDate,
                        c.AssignedTo,
                        c.CreationTime,
                        c.LastModificationTime
                    })
                    .ToListAsync();

                return new { data = appCustomers, totalCount = appCustomers.Count };
            }
            catch (Exception ex)
            {
                // If AppCustomers table doesn't exist, return empty result
                return new { data = new object[0], totalCount = 0, error = ex.Message };
            }
        }

        // Lead Management
        [HttpGet]
        [Route("leads")]
        public async Task<PagedResultDto<object>> GetLeadsAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var leads = await _dbContext.Leads
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(l => new
                {
                    l.Id,
                    l.CompanyName,
                    l.ContactPerson,
                    l.Email,
                    l.Phone,
                    l.Address,
                    l.City,
                    l.State,
                    l.Country,
                    l.Industry,
                    l.Status,
                    l.Value,
                    l.Notes,
                    l.CreationTime,
                    l.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.Leads.CountAsync();

            return new PagedResultDto<object>
            {
                Items = leads,
                TotalCount = totalCount
            };
        }

        // Sales Opportunities
        [HttpGet]
        [Route("opportunities")]
        public async Task<PagedResultDto<object>> GetOpportunitiesAsync([FromQuery] int skipCount = 0, [FromQuery] int maxResultCount = 10)
        {
            var opportunities = await _dbContext.SalesOpportunities
                .Skip(skipCount)
                .Take(maxResultCount)
                .Select(o => new
                {
                    o.Id,
                    o.OpportunityName,
                    o.CustomerName,
                    o.ContactPerson,
                    o.Email,
                    o.Phone,
                    o.Value,
                    o.Stage,
                    o.Description,
                    o.Notes,
                    o.CreationTime,
                    o.LastModificationTime
                })
                .ToListAsync();

            var totalCount = await _dbContext.SalesOpportunities.CountAsync();

            return new PagedResultDto<object>
            {
                Items = opportunities,
                TotalCount = totalCount
            };
        }

        // Analytics
        [HttpGet]
        [Route("analytics/customers")]
        public async Task<object> GetCustomerStatsAsync()
        {
            var totalCustomers = await _dbContext.Customers.CountAsync();
            var activeCustomers = await _dbContext.Customers.CountAsync(c => c.Status == MyCrmApp.CRM.CustomerStatus.Active);
            var newThisMonth = await _dbContext.Customers.CountAsync(c => 
                c.CreationTime >= DateTime.Now.AddDays(-30));
            
            return new
            {
                totalCustomers = totalCustomers,
                activeCustomers = activeCustomers,
                newThisMonth = newThisMonth
            };
        }

        [HttpGet]
        [Route("analytics/sales")]
        public async Task<object> GetSalesStatsAsync()
        {
            var totalOpportunities = await _dbContext.SalesOpportunities.CountAsync();
            var totalValue = await _dbContext.SalesOpportunities.SumAsync(o => o.Value);
            var wonOpportunities = await _dbContext.SalesOpportunities.CountAsync(o => o.Stage == MyCrmApp.CRM.SalesStage.ClosedWon);
            
            return new
            {
                totalOpportunities = totalOpportunities,
                totalValue = totalValue,
                wonOpportunities = wonOpportunities,
                conversionRate = totalOpportunities > 0 ? (double)wonOpportunities / totalOpportunities * 100 : 0
            };
        }

        [HttpGet]
        [Route("analytics/leads")]
        public async Task<object> GetLeadStatsAsync()
        {
            var totalLeads = await _dbContext.Leads.CountAsync();
            var newLeads = await _dbContext.Leads.CountAsync(l => l.Status == MyCrmApp.CRM.LeadStatus.New);
            var qualifiedLeads = await _dbContext.Leads.CountAsync(l => l.Status == MyCrmApp.CRM.LeadStatus.Qualified);
            var totalValue = await _dbContext.Leads.SumAsync(l => l.Value);
            
            return new
            {
                totalLeads = totalLeads,
                newLeads = newLeads,
                qualifiedLeads = qualifiedLeads,
                totalValue = totalValue
            };
        }
    }

    public class CreateCustomerRequest
    {
        public string CustomerCode { get; set; }
        public string CompanyName { get; set; }
        public string Industry { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Website { get; set; }
        public string GSTNumber { get; set; }
        public string PANNumber { get; set; }
        public MyCrmApp.CRM.CustomerType CustomerType { get; set; }
        public decimal CreditLimit { get; set; }
        public decimal CurrentBalance { get; set; }
        public string PaymentTerms { get; set; }
        public string Notes { get; set; }
        public DateTime? LastContactDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
        public string AssignedTo { get; set; }
    }

    public class UpdateCustomerRequest
    {
        public string CompanyName { get; set; }
        public string ContactPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Website { get; set; }
        public string Notes { get; set; }
    }
}
