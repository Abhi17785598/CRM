import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerDto, CustomerType, CustomerStatus } from '../models/crm.models';
import { environment } from '../../environments/environment';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive' | 'prospect';
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string;
  createdDate: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  notes: string;
  createdDate: string;
}

export interface SalesOpportunity {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  products: string[];
  createdDate: string;
  updatedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private baseUrl = `${environment.apis.default.url}/api/crm`;

  constructor(private http: HttpClient) {}

  // Test connection
  testConnection(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test`);
  }

  // Customer Management
  getCustomers(): Observable<CustomerDto[]> {
    return this.http.get<CustomerDto[]>(`${this.baseUrl}/customers`);
  }

  // Fetch customers from AppCustomers table
  getAppCustomers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/appcustomers`);
  }

  // Alternative endpoint for AppCustomers table if needed
  getAppCustomersDirect(): Observable<any> {
    return this.http.get<any>(`${environment.apis.default.url}/api/app/appcustomers`);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, customer);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/customers/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/customers/${id}`);
  }

  // Lead Management
  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.baseUrl}/leads`);
  }

  getLead(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.baseUrl}/leads/${id}`);
  }

  createLead(lead: Partial<Lead>): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/leads`, lead);
  }

  updateLead(id: string, lead: Partial<Lead>): Observable<Lead> {
    return this.http.put<Lead>(`${this.baseUrl}/leads/${id}`, lead);
  }

  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/leads/${id}`);
  }

  convertLeadToCustomer(leadId: string): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/leads/${leadId}/convert`, {});
  }

  // Sales Opportunities
  getSalesOpportunities(): Observable<SalesOpportunity[]> {
    return this.http.get<SalesOpportunity[]>(`${this.baseUrl}/opportunities`);
  }

  getSalesOpportunity(id: string): Observable<SalesOpportunity> {
    return this.http.get<SalesOpportunity>(`${this.baseUrl}/opportunities/${id}`);
  }

  createSalesOpportunity(opportunity: Partial<SalesOpportunity>): Observable<SalesOpportunity> {
    return this.http.post<SalesOpportunity>(`${this.baseUrl}/opportunities`, opportunity);
  }

  updateSalesOpportunity(id: string, opportunity: Partial<SalesOpportunity>): Observable<SalesOpportunity> {
    return this.http.put<SalesOpportunity>(`${this.baseUrl}/opportunities/${id}`, opportunity);
  }

  deleteSalesOpportunity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/opportunities/${id}`);
  }

  // Dashboard Analytics
  getCustomerStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/customers`);
  }

  getSalesStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/sales`);
  }

  getLeadStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/leads`);
  }
}
