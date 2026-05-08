import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SearchResult {
  id: string;
  type: 'customer' | 'lead' | 'opportunity' | 'employee' | 'payslip' | 'inventory' | 'production-order' | 'work-order' | 'maintenance' | 'quality-check';
  title: string;
  description: string;
  module: string;
  url: string;
  details?: any;
  relevanceScore?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResults = new BehaviorSubject<SearchResult[]>([]);
  searchResults$ = this.searchResults.asObservable();
  
  private mockData: SearchResult[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock search data from all modules
    this.mockData = [
      // CRM Customers
      {
        id: '1',
        type: 'customer',
        title: 'Tech Solutions Inc.',
        description: 'Technology - John Smith - john.smith@techsolutions.com',
        module: 'CRM',
        url: '/crm/customers',
        details: { customerCode: 'CUST-001', status: 'Active', creditLimit: 50000 }
      },
      {
        id: '2',
        type: 'customer',
        title: 'Manufacturing Co.',
        description: 'Manufacturing - ₹35,000 - Sarah Johnson - sarah.j@manufacturingco.com',
        module: 'CRM',
        url: '/crm/customers',
        details: { customerCode: 'CUST-002', status: 'Active', creditLimit: 75000 }
      },
      
      // CRM Leads
      {
        id: '3',
        type: 'lead',
        title: 'Tech Solutions Inc.',
        description: 'High priority lead worth ₹50,000',
        module: 'CRM',
        url: '/crm/leads',
        details: { leadNumber: 'L-2024-001', status: 'New', priority: 'High' }
      },
      {
        id: '4',
        type: 'lead',
        title: 'Manufacturing Co.',
        description: 'Medium priority lead worth ₹35,000',
        module: 'CRM',
        url: '/crm/leads',
        details: { leadNumber: 'L-2024-002', status: 'Qualified', priority: 'Medium' }
      },
      
      // CRM Opportunities
      {
        id: '5',
        type: 'opportunity',
        title: 'Enterprise Manufacturing Software',
        description: 'Enterprise Manufacturing Software - ₹150,000 - 75% probability',
        module: 'CRM',
        url: '/crm/opportunities',
        details: { opportunityNumber: 'O-2024-001', stage: 'Proposal', probability: 75 }
      },
      
      // Production Orders
      {
        id: '8',
        type: 'production-order',
        title: 'Steel Beams',
        description: 'Steel Beams - ₹500 units - In Progress',
        module: 'Manufacturing',
        url: '/manufacturing/production-orders',
        details: { orderNumber: 'PO-001', quantity: 500, status: 'In Progress' }
      },
      
      // Payroll Employees
      {
        id: '9',
        type: 'employee',
        title: 'John Smith',
        description: 'Production Manager - ₹75,000 salary',
        module: 'Payroll',
        url: '/payroll/employees',
        details: { employeeCode: 'EMP-001', department: 'Production', baseSalary: 75000 }
      },
      {
        id: '10',
        type: 'employee',
        title: 'Sarah Johnson',
        description: 'HR Specialist - ₹55,000 salary',
        module: 'Payroll',
        url: '/payroll/employees',
        details: { employeeCode: 'EMP-002', department: 'HR', baseSalary: 55000 }
      }
    ];
  }

  search(query: string, filters?: {
    modules?: string[];
    types?: string[];
    limit?: number;
  }) {
    if (!query || query.trim().length < 2) {
      this.searchResults.next([]);
      return;
    }

    let results = this.mockData.filter(item => {
      const searchStr = query.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchStr);
      const descriptionMatch = item.description.toLowerCase().includes(searchStr);
      const moduleMatch = item.module.toLowerCase().includes(searchStr);
      const typeMatch = item.type.toLowerCase().includes(searchStr);
      
      return titleMatch || descriptionMatch || moduleMatch || typeMatch;
    });

    // Apply filters
    if (filters?.modules && filters.modules.length > 0) {
      results = results.filter(item => filters.modules!.includes(item.module));
    }
    
    if (filters?.types && filters.types.length > 0) {
      results = results.filter(item => filters.types!.includes(item.type));
    }

    // Calculate relevance score
    results = results.map(item => {
      const searchStr = query.toLowerCase();
      let score = 0;
      
      // Title matches get highest score
      if (item.title.toLowerCase().includes(searchStr)) {
        score += 10;
      }
      
      // Description matches get medium score
      if (item.description.toLowerCase().includes(searchStr)) {
        score += 5;
      }
      
      // Exact matches get bonus
      if (item.title.toLowerCase() === searchStr) {
        score += 20;
      }
      
      return { ...item, relevanceScore: score };
    });

    // Sort by relevance score
    results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Apply limit
    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }

    this.searchResults.next(results);
  }

  searchByType(type: string, query: string) {
    return this.search(query, { types: [type] });
  }

  searchByModule(module: string, query: string) {
    return this.search(query, { modules: [module] });
  }

  getRecentSearches(limit: number = 5): SearchResult[] {
    // Return some mock recent searches
    return this.mockData.slice(0, limit);
  }

  getPopularSearches(): string[] {
    return [
      'Tech Solutions',
      'Steel',
      'John Smith',
      'Production',
      'Aluminum',
      'High Priority',
      'Active Orders'
    ];
  }

  clearResults() {
    this.searchResults.next([]);
  }

  // Advanced search with multiple criteria
  advancedSearch(criteria: {
    query?: string;
    modules?: string[];
    types?: string[];
    dateRange?: { start: Date; end: Date };
    status?: string[];
    priority?: string[];
  }) {
    let results = [...this.mockData];

    // Text search
    if (criteria.query) {
      const searchStr = criteria.query.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchStr) ||
        item.description.toLowerCase().includes(searchStr)
      );
    }

    // Module filter
    if (criteria.modules && criteria.modules.length > 0) {
      results = results.filter(item => criteria.modules!.includes(item.module));
    }

    // Type filter
    if (criteria.types && criteria.types.length > 0) {
      results = results.filter(item => criteria.types!.includes(item.type));
    }

    // Status filter (based on details)
    if (criteria.status && criteria.status.length > 0) {
      results = results.filter(item => {
        if (item.details?.status) {
          return criteria.status!.includes(item.details.status);
        }
        return true;
      });
    }

    // Priority filter
    if (criteria.priority && criteria.priority.length > 0) {
      results = results.filter(item => {
        if (item.details?.priority) {
          return criteria.priority!.includes(item.details.priority);
        }
        return true;
      });
    }

    this.searchResults.next(results);
  }
}
