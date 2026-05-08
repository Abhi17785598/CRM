import { Component, OnInit } from '@angular/core';
import { PurchaseService, PurchaseOrder } from '../services/purchase.service';

@Component({
  selector: 'app-purchase-orders',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Purchase Orders</h2>
              <p class="text-muted">Manage and track purchase orders</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshOrders()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showCreateForm = true">
                <i class="fas fa-plus me-2"></i>Create Order
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
                  <h4 class="mb-0 text-primary">{{ stats.totalOrders }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-shopping-cart fa-2x"></i>
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
                  <p class="text-muted small mb-1">Pending Orders</p>
                  <h4 class="mb-0 text-warning">{{ stats.pendingOrders }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-clock fa-2x"></i>
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
                  <p class="text-muted small mb-1">Delivered Orders</p>
                  <h4 class="mb-0 text-success">{{ stats.deliveredOrders }}</h4>
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
                  <p class="text-muted small mb-1">Total Value</p>
                  <h4 class="mb-0 text-info">{{ formatCurrency(stats.totalValue) }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-money-bill-wave fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterOrders()">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Priority</label>
                  <select class="form-select" [(ngModel)]="selectedPriority" (change)="filterOrders()">
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Range</label>
                  <select class="form-select" [(ngModel)]="dateRange" (change)="filterOrders()">
                    <option value="">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by order number or vendor..." 
                         [(ngModel)]="searchTerm" (input)="filterOrders()">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading purchase orders...</p>
      </div>

      <!-- Orders Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Vendor</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders">
                <td><strong>{{ order.orderNumber }}</strong></td>
                <td>{{ order.vendorName }}</td>
                <td>{{ order.orderDate | date:'shortDate' }}</td>
                <td>{{ order.expectedDeliveryDate | date:'shortDate' }}</td>
                <td class="fw-bold">{{ formatCurrency(order.totalAmount) }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getPriorityClass(order.priority)">
                    {{ order.priority }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewOrder(order)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="editOrder(order)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-info" *ngIf="order.status === 'draft'" (click)="sendOrder(order)">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                    <button class="btn btn-outline-warning" *ngIf="order.status === 'sent'" (click)="confirmOrder(order)">
                      <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-secondary" *ngIf="order.status === 'confirmed'" (click)="receiveItems(order)">
                      <i class="fas fa-box"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredOrders.length === 0" class="text-center py-5">
        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
        <h4>No purchase orders found</h4>
        <p class="text-muted">Try adjusting your filters or create a new purchase order.</p>
      </div>
    </div>

    <!-- Create Order Modal -->
    <div *ngIf="showCreateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Purchase Order</h5>
            <button type="button" class="btn-close" (click)="showCreateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Vendor</label>
                  <select class="form-select" [(ngModel)]="newOrder.vendorId" name="vendorId" (change)="onVendorChange()">
                    <option value="">Select Vendor</option>
                    <option *ngFor="let vendor of vendors" [value]="vendor.id">{{ vendor.vendorName }}</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Order Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newOrder.orderDate" name="orderDate">
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Expected Delivery</label>
                  <input type="date" class="form-control" [(ngModel)]="newOrder.expectedDeliveryDate" name="expectedDeliveryDate">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label">Priority</label>
                  <select class="form-select" [(ngModel)]="newOrder.priority" name="priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Payment Terms</label>
                  <select class="form-select" [(ngModel)]="newOrder.paymentTerms" name="paymentTerms">
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Currency</label>
                  <select class="form-select" [(ngModel)]="newOrder.currency" name="currency">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="row mb-3">
                <div class="col-12">
                  <h6>Order Items</h6>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Product/Service</th>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Discount</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of newOrder.items; let i = index">
                          <td>
                            <input type="text" class="form-control form-control-sm" [(ngModel)]="item.productName" name="productName_{{i}}">
                          </td>
                          <td>
                            <input type="text" class="form-control form-control-sm" [(ngModel)]="item.description" name="description_{{i}}">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm" [(ngModel)]="item.quantity" name="quantity_{{i}}" (change)="calculateItemTotal(item)">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm" [(ngModel)]="item.unitPrice" name="unitPrice_{{i}}" (change)="calculateItemTotal(item)">
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm" [(ngModel)]="item.discount" name="discount_{{i}}" (change)="calculateItemTotal(item)">
                          </td>
                          <td class="fw-bold">{{ formatCurrency(item.totalAmount) }}</td>
                          <td>
                            <button class="btn btn-sm btn-danger" (click)="removeItem(i)">
                              <i class="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-primary" (click)="addNewItem()">
                    <i class="fas fa-plus me-2"></i>Add Item
                  </button>
                </div>
              </div>

              <!-- Totals -->
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Delivery Address</label>
                  <textarea class="form-control" [(ngModel)]="newOrder.deliveryAddress" name="deliveryAddress" rows="3"></textarea>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>{{ formatCurrency(newOrder.subtotal) }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <strong>{{ formatCurrency(newOrder.taxAmount) }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <strong>{{ formatCurrency(newOrder.shippingAmount) }}</strong>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5 class="text-primary">{{ formatCurrency(newOrder.totalAmount) }}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="newOrder.notes" name="notes" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveOrder()">Save Order</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Professional Component Styles */
    .container-fluid {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 2rem;
      margin: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      min-height: calc(100vh - 2rem);
    }

    .card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 1px solid rgba(102, 126, 234, 0.1);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0 !important;
      border: none;
      padding: 1.25rem;
    }

    .card-body {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 0 0 12px 12px;
    }

    .table {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      overflow: hidden;
    }

    .table thead th {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      border: none;
      font-weight: 600;
      padding: 1rem;
    }

    .table tbody tr {
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
    }

    .table tbody tr:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: scale(1.01);
    }

    .modal-content {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 15px;
      border: none;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px 15px 0 0;
      border: none;
    }

    .modal-body {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 0 0 15px 15px;
    }

    .form-control, .form-select {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
      background: rgba(255, 255, 255, 1);
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .btn {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      border: none;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
    }

    .btn-warning {
      background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
      color: white;
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
    }

    .btn-info {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      color: white;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
      color: white;
    }

    .badge {
      border-radius: 6px;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
    }

    .card.border-0 {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 1px solid rgba(102, 126, 234, 0.1) !important;
    }

    .spinner-border {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .alert {
      border-radius: 10px;
      border: none;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }

    .text-muted {
      color: #6c757d !important;
    }

    .text-primary {
      color: #667eea !important;
    }

    .text-success {
      color: #28a745 !important;
    }

    .text-warning {
      color: #ffc107 !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }

    .text-info {
      color: #17a2b8 !important;
    }

    @media (max-width: 768px) {
      .container-fluid {
        padding: 1rem;
        margin: 0.5rem;
      }
      
      .card {
        margin-bottom: 1rem;
      }
    }

    @media (prefers-color-scheme: dark) {
      .container-fluid {
        background: rgba(30, 30, 46, 0.95);
        color: #ffffff;
      }
      
      .card {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        color: #ffffff;
      }
      
      .table {
        background: rgba(45, 55, 72, 0.95);
        color: #ffffff;
      }
      
      .form-control, .form-select {
        background: rgba(45, 55, 72, 0.9);
        color: #ffffff;
        border-color: rgba(102, 126, 234, 0.3);
      }
    }

    * {
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(102, 126, 234, 0.1);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .modal {
      z-index: 1050;
    }
    .modal.show {
      display: block !important;
    }
  `]
})
export class PurchaseOrdersComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  loading = false;
  showCreateForm = false;

  selectedStatus = '';
  selectedPriority = '';
  dateRange = '';
  searchTerm = '';

  newOrder: any = {
    vendorId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    paymentTerms: 'Net 30',
    currency: 'INR',
    items: [],
    subtotal: 0,
    taxAmount: 0,
    shippingAmount: 0,
    totalAmount: 0,
    deliveryAddress: '',
    notes: ''
  };

  vendors = [
    { id: '1', vendorName: 'Tech Solutions Ltd.' },
    { id: '2', vendorName: 'Office Supplies Co.' },
    { id: '3', vendorName: 'Equipment Rental Co.' },
    { id: '4', vendorName: 'Software Vendor Inc.' },
    { id: '5', vendorName: 'Manufacturing Supplies Ltd.' },
    { id: '6', vendorName: 'Logistics Services Corp.' },
    { id: '7', vendorName: 'Consulting Services LLP' },
    { id: '8', vendorName: 'Maintenance Services Co.' },
    { id: '9', vendorName: 'Raw Materials Suppliers Ltd.' },
    { id: '10', vendorName: 'Packaging Solutions Inc.' }
  ];

  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalValue: 0
  };

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.addNewItem(); // Add one empty item by default
  }

  loadOrders() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.orders = [
        {
          id: '1',
          orderNumber: 'PO-2024-001',
          vendorId: '1',
          vendorName: 'Tech Solutions Ltd.',
          orderDate: '2024-01-15',
          expectedDeliveryDate: '2024-01-25',
          actualDeliveryDate: '2024-01-24',
          status: 'delivered',
          priority: 'high',
          items: [],
          subtotal: 150000,
          taxAmount: 27000,
          shippingAmount: 5000,
          totalAmount: 182000,
          currency: 'INR',
          paymentTerms: 'Net 30',
          deliveryAddress: 'Main Office, Bangalore',
          notes: 'Urgent software licenses',
          createdBy: 'Admin',
          createdDate: '2024-01-15',
          updatedDate: '2024-01-24'
        },
        {
          id: '2',
          orderNumber: 'PO-2024-002',
          vendorId: '2',
          vendorName: 'Office Supplies Co.',
          orderDate: '2024-01-20',
          expectedDeliveryDate: '2024-01-30',
          status: 'confirmed',
          priority: 'medium',
          items: [],
          subtotal: 45000,
          taxAmount: 8100,
          shippingAmount: 1500,
          totalAmount: 54600,
          currency: 'INR',
          paymentTerms: 'Net 15',
          deliveryAddress: 'Corporate Office, Mumbai',
          notes: 'Monthly office supplies',
          createdBy: 'Admin',
          createdDate: '2024-01-20',
          updatedDate: '2024-01-22'
        },
        {
          id: '3',
          orderNumber: 'PO-2024-003',
          vendorId: '3',
          vendorName: 'Equipment Rental Co.',
          orderDate: '2024-01-25',
          expectedDeliveryDate: '2024-02-05',
          status: 'shipped',
          priority: 'low',
          items: [],
          subtotal: 25000,
          taxAmount: 4500,
          shippingAmount: 2000,
          totalAmount: 31500,
          currency: 'INR',
          paymentTerms: 'Net 30',
          deliveryAddress: 'Branch Office, Delhi',
          notes: 'Equipment for new project',
          createdBy: 'Admin',
          createdDate: '2024-01-25',
          updatedDate: '2024-01-28'
        },
        {
          id: '4',
          orderNumber: 'PO-2024-004',
          vendorId: '4',
          vendorName: 'Software Vendor Inc.',
          orderDate: '2024-02-01',
          expectedDeliveryDate: '2024-02-10',
          status: 'sent',
          priority: 'urgent',
          items: [],
          subtotal: 320000,
          taxAmount: 57600,
          shippingAmount: 8000,
          totalAmount: 385600,
          currency: 'INR',
          paymentTerms: 'Net 45',
          deliveryAddress: 'Head Office, Bangalore',
          notes: 'Enterprise software licenses',
          createdBy: 'Admin',
          createdDate: '2024-02-01',
          updatedDate: '2024-02-01'
        },
        {
          id: '5',
          orderNumber: 'PO-2024-005',
          vendorId: '5',
          vendorName: 'Manufacturing Supplies Ltd.',
          orderDate: '2024-02-05',
          expectedDeliveryDate: '2024-02-20',
          status: 'draft',
          priority: 'medium',
          items: [],
          subtotal: 180000,
          taxAmount: 32400,
          shippingAmount: 12000,
          totalAmount: 224400,
          currency: 'INR',
          paymentTerms: 'Net 60',
          deliveryAddress: 'Factory Unit, Pune',
          notes: 'Raw materials for production',
          createdBy: 'Admin',
          createdDate: '2024-02-05',
          updatedDate: '2024-02-05'
        },
        {
          id: '6',
          orderNumber: 'PO-2024-006',
          vendorId: '6',
          vendorName: 'Logistics Services Corp.',
          orderDate: '2024-02-08',
          expectedDeliveryDate: '2024-02-15',
          status: 'delivered',
          priority: 'high',
          items: [],
          subtotal: 75000,
          taxAmount: 13500,
          shippingAmount: 3000,
          totalAmount: 91500,
          currency: 'INR',
          paymentTerms: 'Net 15',
          deliveryAddress: 'Warehouse, Chennai',
          notes: 'Logistics and transportation services',
          createdBy: 'Admin',
          createdDate: '2024-02-08',
          updatedDate: '2024-02-14'
        },
        {
          id: '7',
          orderNumber: 'PO-2024-007',
          vendorId: '7',
          vendorName: 'Consulting Services LLP',
          orderDate: '2024-02-10',
          expectedDeliveryDate: '2024-02-25',
          status: 'confirmed',
          priority: 'medium',
          items: [],
          subtotal: 120000,
          taxAmount: 21600,
          shippingAmount: 0,
          totalAmount: 141600,
          currency: 'INR',
          paymentTerms: 'Net 30',
          deliveryAddress: 'Corporate Office, Mumbai',
          notes: 'Business consulting services',
          createdBy: 'Admin',
          createdDate: '2024-02-10',
          updatedDate: '2024-02-12'
        },
        {
          id: '8',
          orderNumber: 'PO-2024-008',
          vendorId: '8',
          vendorName: 'Maintenance Services Co.',
          orderDate: '2024-02-12',
          expectedDeliveryDate: '2024-02-20',
          status: 'sent',
          priority: 'low',
          items: [],
          subtotal: 35000,
          taxAmount: 6300,
          shippingAmount: 1000,
          totalAmount: 42300,
          currency: 'INR',
          paymentTerms: 'Net 30',
          deliveryAddress: 'Branch Office, Delhi',
          notes: 'Annual maintenance contract',
          createdBy: 'Admin',
          createdDate: '2024-02-12',
          updatedDate: '2024-02-12'
        },
        {
          id: '9',
          orderNumber: 'PO-2024-009',
          vendorId: '9',
          vendorName: 'Raw Materials Suppliers Ltd.',
          orderDate: '2024-02-15',
          expectedDeliveryDate: '2024-03-01',
          status: 'shipped',
          priority: 'high',
          items: [],
          subtotal: 280000,
          taxAmount: 50400,
          shippingAmount: 15000,
          totalAmount: 345400,
          currency: 'INR',
          paymentTerms: 'Net 45',
          deliveryAddress: 'Factory Unit, Pune',
          notes: 'Bulk raw materials order',
          createdBy: 'Admin',
          createdDate: '2024-02-15',
          updatedDate: '2024-02-20'
        },
        {
          id: '10',
          orderNumber: 'PO-2024-010',
          vendorId: '10',
          vendorName: 'Packaging Solutions Inc.',
          orderDate: '2024-02-18',
          expectedDeliveryDate: '2024-02-28',
          status: 'draft',
          priority: 'medium',
          items: [],
          subtotal: 65000,
          taxAmount: 11700,
          shippingAmount: 3500,
          totalAmount: 80200,
          currency: 'INR',
          paymentTerms: 'Net 30',
          deliveryAddress: 'Factory Unit, Pune',
          notes: 'Packaging materials for Q2',
          createdBy: 'Admin',
          createdDate: '2024-02-18',
          updatedDate: '2024-02-18'
        }
      ];
      this.filteredOrders = this.orders;
      this.calculateStats();
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalOrders: this.orders.length,
      pendingOrders: this.orders.filter(o => o.status === 'draft' || o.status === 'sent' || o.status === 'confirmed').length,
      deliveredOrders: this.orders.filter(o => o.status === 'delivered').length,
      totalValue: this.orders.reduce((sum, o) => sum + o.totalAmount, 0)
    };
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const statusMatch = !this.selectedStatus || order.status === this.selectedStatus;
      const priorityMatch = !this.selectedPriority || order.priority === this.selectedPriority;
      const searchMatch = !this.searchTerm || 
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let dateMatch = true;
      if (this.dateRange) {
        const days = parseInt(this.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        dateMatch = new Date(order.orderDate) >= cutoffDate;
      }
      
      return statusMatch && priorityMatch && searchMatch && dateMatch;
    });
  }

  refreshOrders() {
    this.loadOrders();
  }

  onVendorChange() {
    // Load vendor details if needed
  }

  addNewItem() {
    this.newOrder.items.push({
      id: Date.now().toString(),
      productId: '',
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      totalAmount: 0,
      receivedQuantity: 0,
      pendingQuantity: 0
    });
  }

  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateItemTotal(item: any) {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    item.totalAmount = subtotal - discountAmount;
    this.calculateTotals();
  }

  calculateTotals() {
    this.newOrder.subtotal = this.newOrder.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    this.newOrder.taxAmount = this.newOrder.subtotal * 0.18; // 18% tax
    this.newOrder.totalAmount = this.newOrder.subtotal + this.newOrder.taxAmount + this.newOrder.shippingAmount;
  }

  saveOrder() {
    const vendor = this.vendors.find(v => v.id === this.newOrder.vendorId);
    
    const order: PurchaseOrder = {
      id: Date.now().toString(),
      orderNumber: `PO-${new Date().getFullYear()}-${String(this.orders.length + 1).padStart(3, '0')}`,
      vendorId: this.newOrder.vendorId,
      vendorName: vendor?.vendorName || 'Unknown',
      orderDate: this.newOrder.orderDate,
      expectedDeliveryDate: this.newOrder.expectedDeliveryDate,
      status: 'draft',
      priority: this.newOrder.priority,
      items: this.newOrder.items,
      subtotal: this.newOrder.subtotal,
      taxAmount: this.newOrder.taxAmount,
      shippingAmount: this.newOrder.shippingAmount,
      totalAmount: this.newOrder.totalAmount,
      currency: this.newOrder.currency,
      paymentTerms: this.newOrder.paymentTerms,
      deliveryAddress: this.newOrder.deliveryAddress,
      notes: this.newOrder.notes,
      createdBy: 'Admin',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    this.orders.unshift(order);
    this.filteredOrders = this.orders;
    this.calculateStats();
    this.showCreateForm = false;
    
    // Reset form
    this.newOrder = {
      vendorId: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      paymentTerms: 'Net 30',
      currency: 'INR',
      items: [],
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      deliveryAddress: '',
      notes: ''
    };
    this.addNewItem();
  }

  viewOrder(order: PurchaseOrder) {
    alert(`Viewing order: ${order.orderNumber}\nVendor: ${order.vendorName}\nAmount: ${this.formatCurrency(order.totalAmount)}\nStatus: ${order.status}\nPriority: ${order.priority}`);
  }

  editOrder(order: PurchaseOrder) {
    alert(`Editing order: ${order.orderNumber}`);
  }

  sendOrder(order: PurchaseOrder) {
    order.status = 'sent';
    alert(`Order ${order.orderNumber} sent to vendor!`);
  }

  confirmOrder(order: PurchaseOrder) {
    order.status = 'confirmed';
    alert(`Order ${order.orderNumber} confirmed by vendor!`);
  }

  receiveItems(order: PurchaseOrder) {
    order.status = 'delivered';
    order.actualDeliveryDate = new Date().toISOString().split('T')[0];
    alert(`Items received for order ${order.orderNumber}!`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered': return 'bg-success';
      case 'shipped': return 'bg-info';
      case 'confirmed': return 'bg-primary';
      case 'sent': return 'bg-warning';
      case 'draft': return 'bg-secondary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-danger';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-info';
      case 'low': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
