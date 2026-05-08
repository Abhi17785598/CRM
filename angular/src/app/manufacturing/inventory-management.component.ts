import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ManufacturingService, InventoryItem } from '../../services/manufacturing.service';
import { CsvExportService } from '../../services/csv-export.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Inventory Management</h2>
              <p class="text-muted">Track and manage your inventory items in real-time</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshInventory()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" routerLink="/manufacturing/inventory/create">
                <i class="fas fa-plus me-2"></i>Add Item
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
                  <p class="text-muted small mb-1">Total Items</p>
                  <h4 class="mb-0">{{ stats.totalItems }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-boxes fa-2x"></i>
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
                  <p class="text-muted small mb-1">Total Value</p>
                  <h4 class="mb-0">\${{ stats.totalValue.toLocaleString() }}</h4>
                </div>
                <div class="text-success">
                  <i class="fas fa-dollar-sign fa-2x"></i>
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
                  <p class="text-muted small mb-1">Low Stock</p>
                  <h4 class="mb-0">{{ stats.lowStock }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-exclamation-triangle fa-2x"></i>
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
                  <p class="text-muted small mb-1">Out of Stock</p>
                  <h4 class="mb-0">{{ stats.outOfStock }}</h4>
                </div>
                <div class="text-danger">
                  <i class="fas fa-times-circle fa-2x"></i>
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
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="filters.category" (change)="applyFilters()">
                    <option value="">All Categories</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Work in Progress">Work in Progress</option>
                    <option value="Finished Goods">Finished Goods</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="filters.status" (change)="applyFilters()">
                    <option value="">All Status</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by SKU, name, or location..." 
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

      <!-- Inventory Table -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Total Value</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of filteredItems">
                      <td>
                        <strong>{{ item.sku }}</strong>
                        <br>
                        <small class="text-muted" *ngIf="item.barcode">
                          <i class="fas fa-barcode"></i> {{ item.barcode }}
                        </small>
                      </td>
                      <td>
                        <div>
                          <strong>{{ item.name }}</strong>
                          <br>
                          <small class="text-muted">{{ item.description }}</small>
                        </div>
                      </td>
                      <td>{{ item.category }}</td>
                      <td>{{ item.location }}</td>
                      <td>
                        <span [class]="getStockClass(item)">
                          {{ item.quantity }} {{ item.unit }}
                        </span>
                      </td>
                      <td>\${{ item.unitCost.toFixed(2) }}</td>
                      <td>\${{ item.totalValue.toFixed(2) }}</td>
                      <td>
                        <span class="badge bg-{{ getStatusColor(item.status) }}">
                          {{ formatStatus(item.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  routerLink="/manufacturing/inventory/{{ item.id }}">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-secondary" 
                                  routerLink="/manufacturing/inventory/{{ item.id }}/edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-success" 
                                  (click)="adjustStock(item.id)">
                            <i class="fas fa-plus-minus"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div *ngIf="filteredItems.length === 0" class="text-center py-5">
                <i class="fas fa-boxes fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No inventory items found</h5>
                <p class="text-muted">Try adjusting your filters or add new inventory items.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventoryManagementComponent implements OnInit {
  inventoryItems$!: Observable<InventoryItem[]>;
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  
  stats = {
    totalItems: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0
  };
  
  filters = {
    category: '',
    status: '',
    search: ''
  };

  constructor(
    private manufacturingService: ManufacturingService,
    private csvExportService: CsvExportService
  ) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryItems$ = this.manufacturingService.getInventoryItems();
    this.inventoryItems$.subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.filteredItems = items;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
      }
    });
  }

  applyFilters() {
    this.filteredItems = this.inventoryItems.filter(item => {
      const categoryMatch = !this.filters.category || item.category === this.filters.category;
      const statusMatch = !this.filters.status || item.status === this.filters.status;
      const searchMatch = !this.filters.search || 
        item.sku.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        item.location.toLowerCase().includes(this.filters.search.toLowerCase());
      
      return categoryMatch && statusMatch && searchMatch;
    });
  }

  clearFilters() {
    this.filters = {
      category: '',
      status: '',
      search: ''
    };
    this.filteredItems = this.inventoryItems;
  }

  calculateStats() {
    this.stats.totalItems = this.inventoryItems.length;
    this.stats.totalValue = this.inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
    this.stats.lowStock = this.inventoryItems.filter(item => item.status === 'low-stock').length;
    this.stats.outOfStock = this.inventoryItems.filter(item => item.status === 'out-of-stock').length;
  }

  refreshInventory() {
    this.loadInventory();
  }

  exportToCsv() {
    const headers = ['SKU', 'Name', 'Category', 'Location', 'Quantity', 'Unit Cost', 'Total Value', 'Status'];
    const data = this.filteredItems.map(item => ({
      sku: item.sku,
      name: item.name,
      category: item.category,
      location: item.location,
      quantity: `${item.quantity} ${item.unit}`,
      unitCost: item.unitCost,
      totalValue: item.totalValue,
      status: this.formatStatus(item.status)
    }));
    
    const filename = this.csvExportService.getTimestampedFilename('inventory');
    this.csvExportService.exportToCsv(data, filename, headers);
  }

  adjustStock(itemId: string) {
    // This would open a modal for stock adjustment
    console.log('Adjust stock for item:', itemId);
  }

  getStockClass(item: InventoryItem): string {
    if (item.quantity <= 0) return 'text-danger fw-bold';
    if (item.quantity <= item.minStockLevel) return 'text-warning fw-bold';
    return 'text-success';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'in-stock': 'success',
      'low-stock': 'warning',
      'out-of-stock': 'danger',
      'discontinued': 'secondary'
    };
    return colors[status] || 'secondary';
  }

  formatStatus(status: string): string {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
