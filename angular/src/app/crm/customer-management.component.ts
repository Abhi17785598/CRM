import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CrmService, Customer } from '../../services/crm.service';
import { CsvExportService } from '../../services/csv-export.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Customer Management</h2>
              <p class="text-muted">Manage your customer relationships and track interactions</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshCustomers()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" routerLink="/crm/customers/create">
                <i class="fas fa-user-plus me-2"></i>Add Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Customers</p>
                  <h4 class="mb-0">{{ stats.total }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Active Customers</p>
                  <h4 class="mb-0">{{ stats.active }}</h4>
                </div>
                <div class="text-success">
                  <i class="fas fa-user-check fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">New This Month</p>
                  <h4 class="mb-0">{{ stats.newThisMonth }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-user-plus fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Revenue</p>
                  <h4 class="mb-0">\${{ stats.totalRevenue.toLocaleString() }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-dollar-sign fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="filters.status" (change)="applyFilters()">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Country</label>
                  <select class="form-select" [(ngModel)]="filters.country" (change)="applyFilters()">
                    <option value="">All Countries</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by name, email, or company..." 
                         [(ngModel)]="filters.search" (input)="applyFilters()">
                </div>
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <div class="d-grid">
                    <button class="btn btn-outline-secondary" (click)="clearFilters()">Clear</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Company</th>
                      <th>Contact Info</th>
                      <th>Location</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let customer of filteredCustomers">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                            {{ customer.firstName.charAt(0) }}{{ customer.lastName.charAt(0) }}
                          </div>
                          <div>
                            <strong>{{ customer.firstName }} {{ customer.lastName }}</strong>
                            <br>
                            <small class="text-muted">{{ customer.email }}</small>
                          </div>
                        </div>
                      </td>
                      <td>{{ customer.company }}</td>
                      <td>
                        <div>
                          <i class="fas fa-phone text-muted me-1"></i> {{ customer.phone }}
                          <br>
                          <small class="text-muted">{{ customer.email }}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {{ customer.city }}
                          <br>
                          <small class="text-muted">{{ customer.country }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ customer.totalOrders }}</span>
                      </td>
                      <td>
                        <strong>\${{ customer.totalRevenue.toLocaleString() }}</strong>
                      </td>
                      <td>
                        <span class="badge bg-{{ getStatusColor(customer.status) }}">
                          {{ formatStatus(customer.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  routerLink="/crm/customers/{{ customer.id }}">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-secondary" 
                                  routerLink="/crm/customers/{{ customer.id }}/edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-success" 
                                  (click)="createOrder(customer.id)">
                            <i class="fas fa-shopping-cart"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div *ngIf="filteredCustomers.length === 0" class="text-center py-5">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No customers found</h5>
                <p class="text-muted">Try adjusting your filters or add new customers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomerManagementComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  
  stats = {
    total: 0,
    active: 0,
    newThisMonth: 0,
    totalRevenue: 0
  };
  
  filters = {
    status: '',
    country: '',
    search: ''
  };

  constructor(
    private crmService: CrmService,
    private csvExportService: CsvExportService
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customers$ = this.crmService.getCustomers();
    this.customers$.subscribe({
      next: (customers) => {
        this.customers = customers;
        this.filteredCustomers = customers;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  applyFilters() {
    this.filteredCustomers = this.customers.filter(customer => {
      const statusMatch = !this.filters.status || customer.status === this.filters.status;
      const countryMatch = !this.filters.country || customer.country === this.filters.country;
      const searchMatch = !this.filters.search || 
        customer.firstName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        customer.company.toLowerCase().includes(this.filters.search.toLowerCase());
      
      return statusMatch && countryMatch && searchMatch;
    });
  }

  clearFilters() {
    this.filters = {
      status: '',
      country: '',
      search: ''
    };
    this.filteredCustomers = this.customers;
  }

  calculateStats() {
    this.stats.total = this.customers.length;
    this.stats.active = this.customers.filter(c => c.status === 'active').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.stats.newThisMonth = this.customers.filter(c => {
      const createdDate = new Date(c.createdDate);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    
    this.stats.totalRevenue = this.customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  }

  refreshCustomers() {
    this.loadCustomers();
  }

  exportToCsv() {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'City', 'Country', 'Status', 'Orders', 'Revenue'];
    const data = this.filteredCustomers.map(customer => ({
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      city: customer.city,
      country: customer.country,
      status: this.formatStatus(customer.status),
      orders: customer.totalOrders,
      revenue: customer.totalRevenue
    }));
    
    const filename = this.csvExportService.getTimestampedFilename('customers');
    this.csvExportService.exportToCsv(data, filename, headers);
  }

  createOrder(customerId: string) {
    // This would navigate to order creation with pre-filled customer
    console.log('Create order for customer:', customerId);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'active': 'success',
      'inactive': 'secondary',
      'prospect': 'info'
    };
    return colors[status] || 'secondary';
  }

  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
