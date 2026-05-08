using System;

namespace MyCrmApp.CRM
{
    public enum CustomerType
    {
        Individual = 0,
        Business = 1,
        Government = 2,
        NGO = 3
    }

    public enum CustomerStatus
    {
        Active = 0,
        Inactive = 1,
        Prospect = 2,
        Lost = 3
    }

    public enum LeadSource
    {
        Website = 0,
        Referral = 1,
        ColdCall = 2,
        Email = 3,
        SocialMedia = 4,
        TradeShow = 5,
        Advertisement = 6
    }

    public enum LeadPriority
    {
        Low = 0,
        Medium = 1,
        High = 2
    }

    public enum LeadStatus
    {
        New = 0,
        Contacted = 1,
        Qualified = 2,
        Proposal = 3,
        Negotiation = 4,
        Converted = 5,
        Lost = 6
    }

    public enum SalesStage
    {
        Qualification = 0,
        NeedsAnalysis = 1,
        ValueProposition = 2,
        Proposal = 3,
        Negotiation = 4,
        ClosedWon = 5,
        ClosedLost = 6
    }

    public enum OpportunityPriority
    {
        Low = 0,
        Medium = 1,
        High = 2,
        Critical = 3
    }
}
