import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ManufacturingService, ProductionOrder } from '../../services/manufacturing.service';
import { CsvExportService } from '../../services/csv-export.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-production-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Production Orders</h2>
              <p class="text-muted">Manage manufacturing production orders and track progress</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshOrders()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" routerLink="/manufacturing/production-orders/create">
                <i class="fas fa-plus me-2"></i>New Production Order
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
                  <p class="text-muted small mb-1">Total Orders</p>
                  <h4 class="mb-0">{{ stats.total }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-clipboard-list fa-2x"></i>
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
                  <p class="text-muted small mb-1">In Progress</p>
                  <h4 class="mb-0">{{ stats.inProgress }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-cogs fa-2x"></i>
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
                  <p class="text-muted small mb-1">Completed</p>
                  <h4 class="mb-0">{{ stats.completed }}</h4>
                </div>
                <div class="text-success">
                  <i class="fas fa-check-circle fa-2x"></i>
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
                  <p class="text-muted small mb-1">Overdue</p>
                  <h4 class="mb-0">{{ stats.overdue }}</h4>
                </div>
                <div class="text-danger">
                  <i class="fas fa-exclamation-triangle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Production Orders Table -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Progress</th>
                      <th>Start Date</th>
                      <th>Expected End</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let order of filteredOrders">
                      <td>
                        <strong>{{ order.orderNumber }}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{{ order.productName }}</strong>
                          <br>
                          <small class="text-muted">{{ order.unit }}</small>
                        </div>
                      </td>
                      <td>{{ order.quantity }}</td>
                      <td>
                        <span class="badge bg-{{ getStatusColor(order.status) }}">
                          {{ formatStatus(order.status) }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-{{ getPriorityColor(order.priority) }}">
                          {{ order.priority.toUpperCase() }}
                        </span>
                      </td>
                      <td>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar" 
                               [class.bg-success]="order.progress >= 80"
                               [class.bg-warning]="order.progress >= 50 && order.progress < 80"
                               [class.bg-danger]="order.progress < 50"
                               [style.width.%]="order.progress">
                            {{ order.progress }}%
                          </div>
                        </div>
                      </td>
                      <td>{{ order.startDate | date:'shortDate' }}</td>
                      <td>{{ order.expectedEndDate | date:'shortDate' }}</td>
                      <td>{{ order.assignedTo }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  routerLink="/manufacturing/production-orders/{{ order.id }}">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-secondary" 
                                  routerLink="/manufacturing/production-orders/{{ order.id }}/edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-success" 
                                  *ngIf="order.status === 'in-progress'"
                                  (click)="updateProgress(order.id)">
                            <i class="fas fa-tasks"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div *ngIf="filteredOrders.length === 0" class="text-center py-5">
                <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No production orders found</h5>
                <p class="text-muted">Try adjusting your filters or create a new production order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductionOrdersComponent implements OnInit {
  productionOrders$!: Observable<ProductionOrder[]>;
  productionOrders: ProductionOrder[] = [];
  filteredOrders: ProductionOrder[] = [];
  
  stats = {
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  };
  
  filters = {
    status: '',
    priority: '',
    search: ''
  };

  constructor(
    private manufacturingService: ManufacturingService,
    private csvExportService: CsvExportService
  ) {}

  ngOnInit() {
    this.loadProductionOrders();
  }

  loadProductionOrders() {
    this.productionOrders$ = this.manufacturingService.getProductionOrders();
    this.productionOrders$.subscribe({
      next: (orders) => {
        this.productionOrders = orders;
        this.filteredOrders = orders;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading production orders:', error);
      }
    });
  }

  applyFilters() {
    this.filteredOrders = this.productionOrders.filter(order => {
      const statusMatch = !this.filters.status || order.status === this.filters.status;
      const priorityMatch = !this.filters.priority || order.priority === this.filters.priority;
      const searchMatch = !this.filters.search || 
        order.orderNumber.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        order.productName.toLowerCase().includes(this.filters.search.toLowerCase());
      
      return statusMatch && priorityMatch && searchMatch;
    });
  }

  clearFilters() {
    this.filters = {
      status: '',
      priority: '',
      search: ''
    };
    this.filteredOrders = this.productionOrders;
  }

  calculateStats() {
    this.stats.total = this.productionOrders.length;
    this.stats.inProgress = this.productionOrders.filter(o => o.status === 'in-progress').length;
    this.stats.completed = this.productionOrders.filter(o => o.status === 'completed').length;
    this.stats.overdue = this.productionOrders.filter(o => 
      o.status !== 'completed' && 
      new Date(o.expectedEndDate) < new Date()
    ).length;
  }

  refreshOrders() {
    this.loadProductionOrders();
  }

  exportToCsv() {
    const headers = ['Order Number', 'Product', 'Quantity', 'Status', 'Priority', 'Start Date', 'Expected End Date', 'Assigned To'];
    const data = this.filteredOrders.map(order => ({
      orderNumber: order.orderNumber,
      productName: order.productName,
      quantity: order.quantity,
      status: this.formatStatus(order.status),
      priority: order.priority.toUpperCase(),
      startDate: order.startDate,
      expectedEndDate: order.expectedEndDate,
      assignedTo: order.assignedTo
    }));
    
    const filename = this.csvExportService.getTimestampedFilename('production_orders');
    this.csvExportService.exportToCsv(data, filename, headers);
  }

  updateProgress(orderId: string) {
    // This would open a modal or navigate to progress update page
    console.log('Update progress for order:', orderId);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'secondary',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': 'info',
      'medium': 'primary',
      'high': 'warning',
      'urgent': 'danger'
    };
    return colors[priority] || 'secondary';
  }

  formatStatus(status: string): string {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
