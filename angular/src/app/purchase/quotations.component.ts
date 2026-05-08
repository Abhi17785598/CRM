import { Component, OnInit } from '@angular/core';
import { PurchaseService, Quotation } from '../services/purchase.service';

@Component({
  selector: 'app-quotations',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Quotations</h2>
              <p class="text-muted">Manage vendor quotations and bids</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshQuotations()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showCreateForm = true">
                <i class="fas fa-plus me-2"></i>Create Quotation
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
                  <p class="text-muted small mb-1">Total Quotations</p>
                  <h4 class="mb-0 text-primary">{{ stats.totalQuotations }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-file-invoice fa-2x"></i>
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
                  <p class="text-muted small mb-1">Pending</p>
                  <h4 class="mb-0 text-warning">{{ stats.pendingQuotations }}</h4>
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
                  <p class="text-muted small mb-1">Accepted</p>
                  <h4 class="mb-0 text-success">{{ stats.acceptedQuotations }}</h4>
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
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterQuotations()">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Vendor</label>
                  <select class="form-select" [(ngModel)]="selectedVendor" (change)="filterQuotations()">
                    <option value="">All Vendors</option>
                    <option *ngFor="let vendor of vendors" [value]="vendor.id">{{ vendor.vendorName }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Range</label>
                  <select class="form-select" [(ngModel)]="dateRange" (change)="filterQuotations()">
                    <option value="">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by quotation number or vendor..." 
                         [(ngModel)]="searchTerm" (input)="filterQuotations()">
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
        <p class="mt-2">Loading quotations...</p>
      </div>

      <!-- Quotations Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Quotation #</th>
                <th>Vendor</th>
                <th>Quotation Date</th>
                <th>Valid Until</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Days Left</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let quotation of filteredQuotations">
                <td><strong>{{ quotation.quotationNumber }}</strong></td>
                <td>{{ quotation.vendorName }}</td>
                <td>{{ quotation.quotationDate | date:'shortDate' }}</td>
                <td>{{ quotation.validUntil | date:'shortDate' }}</td>
                <td class="fw-bold">{{ formatCurrency(quotation.totalAmount) }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(quotation.status)">
                    {{ quotation.status }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getDaysLeftClass(quotation)">
                    {{ getDaysLeft(quotation) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewQuotation(quotation)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="editQuotation(quotation)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-warning" *ngIf="quotation.status === 'sent'" (click)="acceptQuotation(quotation)">
                      <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" *ngIf="quotation.status === 'sent'" (click)="rejectQuotation(quotation)">
                      <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-outline-info" *ngIf="quotation.status === 'accepted'" (click)="convertToOrder(quotation)">
                      <i class="fas fa-shopping-cart"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredQuotations.length === 0" class="text-center py-5">
        <i class="fas fa-file-invoice fa-3x text-muted mb-3"></i>
        <h4>No quotations found</h4>
        <p class="text-muted">Try adjusting your filters or create a new quotation.</p>
      </div>
    </div>

    <!-- Create Quotation Modal -->
    <div *ngIf="showCreateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Quotation Request</h5>
            <button type="button" class="btn-close" (click)="showCreateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Vendor</label>
                  <select class="form-select" [(ngModel)]="newQuotation.vendorId" name="vendorId" (change)="onVendorChange()">
                    <option value="">Select Vendor</option>
                    <option *ngFor="let vendor of vendors" [value]="vendor.id">{{ vendor.vendorName }}</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Quotation Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newQuotation.quotationDate" name="quotationDate">
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Valid Until</label>
                  <input type="date" class="form-control" [(ngModel)]="newQuotation.validUntil" name="validUntil">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label">Currency</label>
                  <select class="form-select" [(ngModel)]="newQuotation.currency" name="currency">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div class="col-md-8 mb-3">
                  <label class="form-label">Subject/Description</label>
                  <input type="text" class="form-control" [(ngModel)]="newQuotation.description" name="description" 
                         placeholder="Brief description of quotation request">
                </div>
              </div>
              
              <!-- Quotation Items -->
              <div class="row mb-3">
                <div class="col-12">
                  <h6>Request Items</h6>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Product/Service</th>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Estimated Price</th>
                          <th>Lead Time (Days)</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of newQuotation.items; let i = index">
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
                            <input type="number" class="form-control form-control-sm" [(ngModel)]="item.leadTime" name="leadTime_{{i}}">
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
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="newQuotation.notes" name="notes" rows="3"></textarea>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>{{ formatCurrency(newQuotation.subtotal) }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <strong>{{ formatCurrency(newQuotation.taxAmount) }}</strong>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5 class="text-primary">{{ formatCurrency(newQuotation.totalAmount) }}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveQuotation()">Send Request</button>
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
export class QuotationsComponent implements OnInit {
  quotations: Quotation[] = [];
  filteredQuotations: Quotation[] = [];
  loading = false;
  showCreateForm = false;

  selectedStatus = '';
  selectedVendor = '';
  dateRange = '';
  searchTerm = '';

  newQuotation: any = {
    vendorId: '',
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'INR',
    description: '',
    items: [],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
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
    totalQuotations: 0,
    pendingQuotations: 0,
    acceptedQuotations: 0,
    totalValue: 0
  };

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadQuotations();
    this.addNewItem(); // Add one empty item by default
  }

  loadQuotations() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.quotations = [
        {
          id: '1',
          quotationNumber: 'QTN-2024-001',
          vendorId: '1',
          vendorName: 'Tech Solutions Ltd.',
          quotationDate: '2024-01-15',
          validUntil: '2024-02-15',
          status: 'accepted',
          items: [],
          subtotal: 120000,
          taxAmount: 21600,
          totalAmount: 141600,
          currency: 'INR',
          notes: 'Software development services',
          createdBy: 'Admin',
          createdDate: '2024-01-15',
          updatedDate: '2024-01-20'
        },
        {
          id: '2',
          quotationNumber: 'QTN-2024-002',
          vendorId: '2',
          vendorName: 'Office Supplies Co.',
          quotationDate: '2024-01-20',
          validUntil: '2024-02-20',
          status: 'sent',
          items: [],
          subtotal: 45000,
          taxAmount: 8100,
          totalAmount: 53100,
          currency: 'INR',
          notes: 'Office furniture and supplies',
          createdBy: 'Admin',
          createdDate: '2024-01-20',
          updatedDate: '2024-01-20'
        },
        {
          id: '3',
          quotationNumber: 'QTN-2024-003',
          vendorId: '3',
          vendorName: 'Equipment Rental Co.',
          quotationDate: '2024-01-25',
          validUntil: '2024-02-25',
          status: 'rejected',
          items: [],
          subtotal: 25000,
          taxAmount: 4500,
          totalAmount: 29500,
          currency: 'INR',
          notes: 'Heavy equipment rental',
          createdBy: 'Admin',
          createdDate: '2024-01-25',
          updatedDate: '2024-01-28'
        },
        {
          id: '4',
          quotationNumber: 'QTN-2024-004',
          vendorId: '4',
          vendorName: 'Software Vendor Inc.',
          quotationDate: '2024-02-01',
          validUntil: '2024-03-01',
          status: 'sent',
          items: [],
          subtotal: 320000,
          taxAmount: 57600,
          totalAmount: 377600,
          currency: 'INR',
          notes: 'Enterprise software licenses',
          createdBy: 'Admin',
          createdDate: '2024-02-01',
          updatedDate: '2024-02-01'
        },
        {
          id: '5',
          quotationNumber: 'QTN-2024-005',
          vendorId: '5',
          vendorName: 'Manufacturing Supplies Ltd.',
          quotationDate: '2024-02-05',
          validUntil: '2024-03-05',
          status: 'draft',
          items: [],
          subtotal: 180000,
          taxAmount: 32400,
          totalAmount: 212400,
          currency: 'INR',
          notes: 'Raw materials for production',
          createdBy: 'Admin',
          createdDate: '2024-02-05',
          updatedDate: '2024-02-05'
        },
        {
          id: '6',
          quotationNumber: 'QTN-2024-006',
          vendorId: '6',
          vendorName: 'Logistics Services Corp.',
          quotationDate: '2024-02-08',
          validUntil: '2024-03-08',
          status: 'sent',
          items: [],
          subtotal: 75000,
          taxAmount: 13500,
          totalAmount: 88500,
          currency: 'INR',
          notes: 'Logistics and transportation services',
          createdBy: 'Admin',
          createdDate: '2024-02-08',
          updatedDate: '2024-02-08'
        },
        {
          id: '7',
          quotationNumber: 'QTN-2024-007',
          vendorId: '7',
          vendorName: 'Consulting Services LLP',
          quotationDate: '2024-02-10',
          validUntil: '2024-03-10',
          status: 'accepted',
          items: [],
          subtotal: 120000,
          taxAmount: 21600,
          totalAmount: 141600,
          currency: 'INR',
          notes: 'Business consulting services',
          createdBy: 'Admin',
          createdDate: '2024-02-10',
          updatedDate: '2024-02-12'
        },
        {
          id: '8',
          quotationNumber: 'QTN-2024-008',
          vendorId: '8',
          vendorName: 'Maintenance Services Co.',
          quotationDate: '2024-02-12',
          validUntil: '2024-03-12',
          status: 'expired',
          items: [],
          subtotal: 35000,
          taxAmount: 6300,
          totalAmount: 41300,
          currency: 'INR',
          notes: 'Annual maintenance contract',
          createdBy: 'Admin',
          createdDate: '2024-02-12',
          updatedDate: '2024-02-12'
        },
        {
          id: '9',
          quotationNumber: 'QTN-2024-009',
          vendorId: '9',
          vendorName: 'Raw Materials Suppliers Ltd.',
          quotationDate: '2024-02-15',
          validUntil: '2024-03-15',
          status: 'sent',
          items: [],
          subtotal: 280000,
          taxAmount: 50400,
          totalAmount: 330400,
          currency: 'INR',
          notes: 'Bulk raw materials supply',
          createdBy: 'Admin',
          createdDate: '2024-02-15',
          updatedDate: '2024-02-15'
        },
        {
          id: '10',
          quotationNumber: 'QTN-2024-010',
          vendorId: '10',
          vendorName: 'Packaging Solutions Inc.',
          quotationDate: '2024-02-18',
          validUntil: '2024-03-18',
          status: 'draft',
          items: [],
          subtotal: 65000,
          taxAmount: 11700,
          totalAmount: 76700,
          currency: 'INR',
          notes: 'Packaging materials for Q2',
          createdBy: 'Admin',
          createdDate: '2024-02-18',
          updatedDate: '2024-02-18'
        }
      ];
      this.filteredQuotations = this.quotations;
      this.calculateStats();
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalQuotations: this.quotations.length,
      pendingQuotations: this.quotations.filter(q => q.status === 'sent' || q.status === 'draft').length,
      acceptedQuotations: this.quotations.filter(q => q.status === 'accepted').length,
      totalValue: this.quotations.reduce((sum, q) => sum + q.totalAmount, 0)
    };
  }

  filterQuotations() {
    this.filteredQuotations = this.quotations.filter(quotation => {
      const statusMatch = !this.selectedStatus || quotation.status === this.selectedStatus;
      const vendorMatch = !this.selectedVendor || quotation.vendorId === this.selectedVendor;
      const searchMatch = !this.searchTerm || 
        quotation.quotationNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        quotation.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let dateMatch = true;
      if (this.dateRange) {
        const days = parseInt(this.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        dateMatch = new Date(quotation.quotationDate) >= cutoffDate;
      }
      
      return statusMatch && vendorMatch && searchMatch && dateMatch;
    });
  }

  refreshQuotations() {
    this.loadQuotations();
  }

  onVendorChange() {
    // Load vendor details if needed
  }

  addNewItem() {
    this.newQuotation.items.push({
      id: Date.now().toString(),
      productId: '',
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      totalAmount: 0,
      leadTime: 7
    });
  }

  removeItem(index: number) {
    this.newQuotation.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateItemTotal(item: any) {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    item.totalAmount = subtotal - discountAmount;
    this.calculateTotals();
  }

  calculateTotals() {
    this.newQuotation.subtotal = this.newQuotation.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    this.newQuotation.taxAmount = this.newQuotation.subtotal * 0.18; // 18% tax
    this.newQuotation.totalAmount = this.newQuotation.subtotal + this.newQuotation.taxAmount;
  }

  saveQuotation() {
    const vendor = this.vendors.find(v => v.id === this.newQuotation.vendorId);
    
    const quotation: Quotation = {
      id: Date.now().toString(),
      quotationNumber: `QTN-${new Date().getFullYear()}-${String(this.quotations.length + 1).padStart(3, '0')}`,
      vendorId: this.newQuotation.vendorId,
      vendorName: vendor?.vendorName || 'Unknown',
      quotationDate: this.newQuotation.quotationDate,
      validUntil: this.newQuotation.validUntil,
      status: 'draft',
      items: this.newQuotation.items,
      subtotal: this.newQuotation.subtotal,
      taxAmount: this.newQuotation.taxAmount,
      totalAmount: this.newQuotation.totalAmount,
      currency: this.newQuotation.currency,
      notes: this.newQuotation.notes,
      createdBy: 'Admin',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    this.quotations.unshift(quotation);
    this.filteredQuotations = this.quotations;
    this.calculateStats();
    this.showCreateForm = false;
    
    // Reset form
    this.newQuotation = {
      vendorId: '',
      quotationDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'INR',
      description: '',
      items: [],
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      notes: ''
    };
    this.addNewItem();
  }

  viewQuotation(quotation: Quotation) {
    alert(`Viewing quotation: ${quotation.quotationNumber}\nVendor: ${quotation.vendorName}\nAmount: ${this.formatCurrency(quotation.totalAmount)}\nStatus: ${quotation.status}\nValid Until: ${quotation.validUntil}`);
  }

  editQuotation(quotation: Quotation) {
    alert(`Editing quotation: ${quotation.quotationNumber}`);
  }

  acceptQuotation(quotation: Quotation) {
    quotation.status = 'accepted';
    alert(`Quotation ${quotation.quotationNumber} accepted!`);
    this.calculateStats();
  }

  rejectQuotation(quotation: Quotation) {
    const reason = prompt('Please provide reason for rejection:');
    if (reason) {
      quotation.status = 'rejected';
      alert(`Quotation ${quotation.quotationNumber} rejected!\nReason: ${reason}`);
      this.calculateStats();
    }
  }

  convertToOrder(quotation: Quotation) {
    alert(`Converting quotation ${quotation.quotationNumber} to purchase order...`);
  }

  getDaysLeft(quotation: Quotation): string {
    const today = new Date();
    const validDate = new Date(quotation.validUntil);
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires Today';
    if (diffDays <= 7) return `${diffDays} Days`;
    return `${diffDays} Days`;
  }

  getDaysLeftClass(quotation: Quotation): string {
    const today = new Date();
    const validDate = new Date(quotation.validUntil);
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'bg-danger';
    if (diffDays <= 7) return 'bg-warning';
    return 'bg-success';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'bg-success';
      case 'sent': return 'bg-primary';
      case 'draft': return 'bg-secondary';
      case 'rejected': return 'bg-danger';
      case 'expired': return 'bg-dark';
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
