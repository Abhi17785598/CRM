using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using MyCrmApp.CRM;

namespace MyCrmApp.CRM
{
    public class SalesOpportunity : FullAuditedAggregateRoot<Guid>
    {
        public string OpportunityNumber { get; set; }
        public string OpportunityName { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProductService { get; set; }
        public decimal DealValue { get; set; }
        public decimal Probability { get; set; }
        public SalesStage Stage { get; set; }
        public OpportunityPriority Priority { get; set; }
        public DateTime ExpectedCloseDate { get; set; }
        public DateTime? ActualCloseDate { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string AssignedTo { get; set; }
        public bool IsWon { get; set; }
        public bool IsLost { get; set; }
        public string? LostReason { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
        
        // Additional properties for controller compatibility
        public decimal Value => DealValue;
        public string ContactPerson => CustomerName;
        [NotMapped]
        public string Email { get; set; }
        [NotMapped]
        public string Phone { get; set; }

        protected SalesOpportunity()
        {
        }

        public SalesOpportunity(
            Guid id,
            string opportunityNumber,
            string opportunityName,
            Guid customerId,
            string customerName,
            string productService,
            decimal dealValue,
            decimal probability,
            SalesStage stage,
            OpportunityPriority priority,
            DateTime expectedCloseDate
        ) : base(id)
        {
            OpportunityNumber = opportunityNumber;
            OpportunityName = opportunityName;
            CustomerId = customerId;
            CustomerName = customerName;
            ProductService = productService;
            DealValue = dealValue;
            Probability = probability;
            Stage = stage;
            Priority = priority;
            ExpectedCloseDate = expectedCloseDate;
            IsWon = false;
            IsLost = false;
            CreatedDate = DateTime.Now;
        }

        public void MoveToNextStage()
        {
            if (Stage < SalesStage.ClosedWon)
            {
                Stage++;
                UpdateProbability();
                LastActivityDate = DateTime.Now;
            }
        }

        public void MoveToPreviousStage()
        {
            if (Stage > SalesStage.Qualification)
            {
                Stage--;
                UpdateProbability();
                LastActivityDate = DateTime.Now;
            }
        }

        public void UpdateProbability(decimal newProbability)
        {
            Probability = Math.Max(0, Math.Min(100, newProbability));
        }

        private void UpdateProbability()
        {
            switch (Stage)
            {
                case SalesStage.Qualification:
                    Probability = 20;
                    break;
                case SalesStage.NeedsAnalysis:
                    Probability = 40;
                    break;
                case SalesStage.ValueProposition:
                    Probability = 60;
                    break;
                case SalesStage.Proposal:
                    Probability = 75;
                    break;
                case SalesStage.Negotiation:
                    Probability = 90;
                    break;
                case SalesStage.ClosedWon:
                    Probability = 100;
                    break;
                case SalesStage.ClosedLost:
                    Probability = 0;
                    break;
            }
        }

        public void WinDeal()
        {
            IsWon = true;
            IsLost = false;
            Stage = SalesStage.ClosedWon;
            Probability = 100;
            ActualCloseDate = DateTime.Now;
            LastActivityDate = DateTime.Now;
        }

        public void LoseDeal(string reason)
        {
            IsWon = false;
            IsLost = true;
            Stage = SalesStage.ClosedLost;
            Probability = 0;
            LostReason = reason;
            ActualCloseDate = DateTime.Now;
            LastActivityDate = DateTime.Now;
        }

        public decimal GetExpectedRevenue()
        {
            return DealValue * (Probability / 100);
        }

        public bool IsClosingSoon(int daysThreshold = 30)
        {
            return !IsWon && !IsLost && ExpectedCloseDate <= DateTime.Now.AddDays(daysThreshold);
        }

        public bool IsStale(int daysThreshold = 60)
        {
            return !IsWon && !IsLost && 
                   (!LastActivityDate.HasValue || LastActivityDate < DateTime.Now.AddDays(-daysThreshold));
        }
    }
}
