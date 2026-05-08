export interface CustomerDto {
  id: string;
  customerCode: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  gstNumber: string;
  panNumber: string;
  customerType: CustomerType;
  status: CustomerStatus;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  notes: string;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  assignedTo: string;
  isOverdue: boolean;
  needsFollowUp: boolean;
}

export interface LeadDto {
  id: string;
  leadNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  productInterest: string;
  estimatedValue: number;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  leadDate: Date;
  followUpDate?: Date;
  expectedCloseDate?: Date;
  description: string;
  notes: string;
  assignedTo: string;
  convertedToCustomerId?: string;
  convertedDate?: Date;
  isHotLead: boolean;
  isOverdue: boolean;
}

export interface SalesOpportunityDto {
  id: string;
  opportunityNumber: string;
  opportunityName: string;
  customerId: string;
  customerName: string;
  productService: string;
  dealValue: number;
  probability: number;
  stage: SalesStage;
  priority: OpportunityPriority;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  description: string;
  notes: string;
  assignedTo: string;
  isWon: boolean;
  isLost: boolean;
  lostReason: string;
  createdDate: Date;
  lastActivityDate?: Date;
  expectedRevenue: number;
  isClosingSoon: boolean;
  isStale: boolean;
}

export enum CustomerType {
  Individual = 0,
  Business = 1,
  Government = 2,
  NGO = 3
}

export enum CustomerStatus {
  Active = 0,
  Inactive = 1,
  Prospect = 2,
  Lost = 3
}

export enum LeadSource {
  Website = 0,
  Referral = 1,
  ColdCall = 2,
  Email = 3,
  SocialMedia = 4,
  TradeShow = 5,
  Advertisement = 6,
  Other = 7
}

export enum LeadStatus {
  New = 0,
  Contacted = 1,
  Qualified = 2,
  Proposal = 3,
  Negotiation = 4,
  Converted = 5,
  Lost = 6
}

export enum LeadPriority {
  Low = 0,
  Medium = 1,
  High = 2
}

export enum SalesStage {
  Qualification = 0,
  NeedsAnalysis = 1,
  ValueProposition = 2,
  Proposal = 3,
  Negotiation = 4,
  ClosedWon = 5,
  ClosedLost = 6
}

export enum OpportunityPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface CreateCustomerDto {
  customerCode: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  gstNumber: string;
  panNumber: string;
  customerType: CustomerType;
  creditLimit: number;
  paymentTerms: string;
  notes: string;
  assignedTo: string;
}

export interface UpdateCustomerDto {
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  gstNumber: string;
  panNumber: string;
  customerType: CustomerType;
  creditLimit: number;
  paymentTerms: string;
  notes: string;
  assignedTo: string;
}

export interface CreateLeadDto {
  leadNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  productInterest: string;
  estimatedValue: number;
  source: LeadSource;
  priority: LeadPriority;
  expectedCloseDate?: Date;
  description: string;
  notes: string;
  assignedTo: string;
}

export interface UpdateLeadDto {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  productInterest: string;
  estimatedValue: number;
  priority: LeadPriority;
  expectedCloseDate?: Date;
  description: string;
  notes: string;
  assignedTo: string;
}

export interface CreateOpportunityDto {
  opportunityNumber: string;
  opportunityName: string;
  customerId: string;
  customerName: string;
  productService: string;
  dealValue: number;
  probability: number;
  stage: SalesStage;
  priority: OpportunityPriority;
  expectedCloseDate: Date;
  description: string;
  notes: string;
  assignedTo: string;
}

export interface UpdateOpportunityDto {
  opportunityName: string;
  productService: string;
  dealValue: number;
  probability: number;
  stage: SalesStage;
  priority: OpportunityPriority;
  expectedCloseDate: Date;
  description: string;
  notes: string;
  assignedTo: string;
}
