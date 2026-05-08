import { Component, OnInit } from '@angular/core';
import { AccountingService, Invoice } from '../services/accounting.service';

@Component({
  selector: 'app-invoices',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Invoices</h2>
              <p class="text-muted">Manage customer invoices and billing</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshInvoices()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showCreateForm = true">
                <i class="fas fa-plus me-2"></i>Create Invoice
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
                  <p class="text-muted small mb-1">Total Invoices</p>
                  <h4 class="mb-0 text-primary">{{ stats.totalInvoices }}</h4>
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
                  <p class="text-muted small mb-1">Paid Invoices</p>
                  <h4 class="mb-0 text-success">{{ stats.paidInvoices }}</h4>
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
                  <p class="text-muted small mb-1">Pending Invoices</p>
                  <h4 class="mb-0 text-warning">{{ stats.pendingInvoices }}</h4>
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
                  <p class="text-muted small mb-1">Total Revenue</p>
                  <h4 class="mb-0 text-info">{{ formatCurrency(stats.totalRevenue) }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-chart-line fa-2x"></i>
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
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterInvoices()">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Range</label>
                  <select class="form-select" [(ngModel)]="dateRange" (change)="filterInvoices()">
                    <option value="">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by invoice number or customer..." 
                         [(ngModel)]="searchTerm" (input)="filterInvoices()">
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
        <p class="mt-2">Loading invoices...</p>
      </div>

      <!-- Invoices Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let invoice of filteredInvoices">
                <td><strong>{{ invoice.invoiceNumber }}</strong></td>
                <td>{{ invoice.customerName }}</td>
                <td>{{ invoice.invoiceDate | date:'shortDate' }}</td>
                <td>{{ invoice.dueDate | date:'shortDate' }}</td>
                <td>{{ formatCurrency(invoice.totalAmount) }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(invoice.status)">
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="fw-bold">{{ formatCurrency(invoice.balanceAmount) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewInvoice(invoice)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="editInvoice(invoice)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-info" (click)="sendInvoice(invoice)">
                      <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn btn-outline-warning" (click)="downloadInvoice(invoice)">
                      <i class="fas fa-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredInvoices.length === 0" class="text-center py-5">
        <i class="fas fa-file-invoice fa-3x text-muted mb-3"></i>
        <h4>No invoices found</h4>
        <p class="text-muted">Try adjusting your filters or create a new invoice.</p>
      </div>
    </div>

    <!-- Create/Edit Invoice Modal -->
    <div *ngIf="showCreateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Invoice</h5>
            <button type="button" class="btn-close" (click)="showCreateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Customer</label>
                  <select class="form-select" [(ngModel)]="newInvoice.customerId" name="customerId">
                    <option value="">Select Customer</option>
                    <option *ngFor="let customer of customers" [value]="customer.id">{{ customer.name }}</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Invoice Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newInvoice.invoiceDate" name="invoiceDate">
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Due Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newInvoice.dueDate" name="dueDate">
                </div>
              </div>
              
              <!-- Invoice Items -->
              <div class="row mb-3">
                <div class="col-12">
                  <h6>Invoice Items</h6>
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
                        <tr *ngFor="let item of newInvoice.items; let i = index">
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
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="newInvoice.notes" name="notes" rows="3"></textarea>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>{{ formatCurrency(newInvoice.subtotal) }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <strong>{{ formatCurrency(newInvoice.taxAmount) }}</strong>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5 class="text-primary">{{ formatCurrency(newInvoice.totalAmount) }}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveInvoice()">Save Invoice</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      z-index: 1050;
    }
    .modal.show {
      display: block !important;
    }
  `]
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = false;
  showCreateForm = false;

  selectedStatus = '';
  dateRange = '';
  searchTerm = '';

  newInvoice: any = {
    customerId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    notes: ''
  };

  customers = [
    { id: '1', name: 'ABC Corporation' },
    { id: '2', name: 'XYZ Industries' },
    { id: '3', name: 'Global Tech Solutions' },
    { id: '4', name: 'Innovate Systems' },
    { id: '5', name: 'MegaCorp International' },
    { id: '6', name: 'TechGiant Solutions' },
    { id: '7', name: 'Enterprise Systems Ltd.' },
    { id: '8', name: 'Digital Dynamics Inc.' },
    { id: '9', name: 'CloudFirst Technologies' },
    { id: '10', name: 'DataDriven Analytics' },
    { id: '11', name: 'Smart Manufacturing Co.' },
    { id: '12', name: 'Financial Services Group' },
    { id: '13', name: 'Healthcare Plus Network' },
    { id: '14', name: 'Retail Chain International' },
    { id: '15', name: 'Logistics Masters Ltd.' }
  ];

  stats = {
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0
  };

  constructor(private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.addNewItem(); // Add one empty item by default
  }

  loadInvoices() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.invoices = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          customerId: '1',
          customerName: 'ABC Corporation',
          invoiceDate: '2024-01-15',
          dueDate: '2024-02-15',
          status: 'paid',
          items: [],
          subtotal: 50000,
          taxAmount: 9000,
          totalAmount: 59000,
          paidAmount: 59000,
          balanceAmount: 0,
          paymentTerms: 'Net 30',
          notes: 'Payment for consulting services',
          createdBy: 'Admin',
          createdDate: '2024-01-15',
          updatedDate: '2024-01-20'
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          customerId: '2',
          customerName: 'XYZ Industries',
          invoiceDate: '2024-01-20',
          dueDate: '2024-02-20',
          status: 'sent',
          items: [],
          subtotal: 75000,
          taxAmount: 13500,
          totalAmount: 88500,
          paidAmount: 0,
          balanceAmount: 88500,
          paymentTerms: 'Net 30',
          notes: 'Software license renewal',
          createdBy: 'Admin',
          createdDate: '2024-01-20',
          updatedDate: '2024-01-20'
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          customerId: '3',
          customerName: 'Global Tech Solutions',
          invoiceDate: '2024-01-10',
          dueDate: '2024-01-25',
          status: 'overdue',
          items: [],
          subtotal: 30000,
          taxAmount: 5400,
          totalAmount: 35400,
          paidAmount: 10000,
          balanceAmount: 25400,
          paymentTerms: 'Net 15',
          notes: 'Hardware purchase',
          createdBy: 'Admin',
          createdDate: '2024-01-10',
          updatedDate: '2024-01-26'
        },
        {
          id: '4',
          invoiceNumber: 'INV-2024-004',
          customerId: '5',
          customerName: 'MegaCorp International',
          invoiceDate: '2024-01-25',
          dueDate: '2024-02-25',
          status: 'paid',
          items: [],
          subtotal: 250000,
          taxAmount: 45000,
          totalAmount: 295000,
          paidAmount: 295000,
          balanceAmount: 0,
          paymentTerms: 'Net 45',
          notes: 'Enterprise software implementation',
          createdBy: 'Admin',
          createdDate: '2024-01-25',
          updatedDate: '2024-02-20'
        },
        {
          id: '5',
          invoiceNumber: 'INV-2024-005',
          customerId: '6',
          customerName: 'TechGiant Solutions',
          invoiceDate: '2024-01-28',
          dueDate: '2024-02-28',
          status: 'sent',
          items: [],
          subtotal: 180000,
          taxAmount: 32400,
          totalAmount: 212400,
          paidAmount: 50000,
          balanceAmount: 162400,
          paymentTerms: 'Net 30',
          notes: 'Cloud infrastructure services',
          createdBy: 'Admin',
          createdDate: '2024-01-28',
          updatedDate: '2024-01-28'
        },
        {
          id: '6',
          invoiceNumber: 'INV-2024-006',
          customerId: '7',
          customerName: 'Enterprise Systems Ltd.',
          invoiceDate: '2024-02-01',
          dueDate: '2024-03-01',
          status: 'draft',
          items: [],
          subtotal: 95000,
          taxAmount: 17100,
          totalAmount: 112100,
          paidAmount: 0,
          balanceAmount: 112100,
          paymentTerms: 'Net 30',
          notes: 'ERP system customization',
          createdBy: 'Admin',
          createdDate: '2024-02-01',
          updatedDate: '2024-02-01'
        },
        {
          id: '7',
          invoiceNumber: 'INV-2024-007',
          customerId: '8',
          customerName: 'Digital Dynamics Inc.',
          invoiceDate: '2024-02-05',
          dueDate: '2024-03-05',
          status: 'paid',
          items: [],
          subtotal: 120000,
          taxAmount: 21600,
          totalAmount: 141600,
          paidAmount: 141600,
          balanceAmount: 0,
          paymentTerms: 'Net 15',
          notes: 'Digital transformation consulting',
          createdBy: 'Admin',
          createdDate: '2024-02-05',
          updatedDate: '2024-02-18'
        },
        {
          id: '8',
          invoiceNumber: 'INV-2024-008',
          customerId: '9',
          customerName: 'CloudFirst Technologies',
          invoiceDate: '2024-02-10',
          dueDate: '2024-03-10',
          status: 'sent',
          items: [],
          subtotal: 85000,
          taxAmount: 15300,
          totalAmount: 100300,
          paidAmount: 0,
          balanceAmount: 100300,
          paymentTerms: 'Net 30',
          notes: 'Cloud migration services',
          createdBy: 'Admin',
          createdDate: '2024-02-10',
          updatedDate: '2024-02-10'
        },
        {
          id: '9',
          invoiceNumber: 'INV-2024-009',
          customerId: '10',
          customerName: 'DataDriven Analytics',
          invoiceDate: '2024-02-12',
          dueDate: '2024-03-12',
          status: 'overdue',
          items: [],
          subtotal: 45000,
          taxAmount: 8100,
          totalAmount: 53100,
          paidAmount: 20000,
          balanceAmount: 33100,
          paymentTerms: 'Net 15',
          notes: 'Business intelligence platform',
          createdBy: 'Admin',
          createdDate: '2024-02-12',
          updatedDate: '2024-03-01'
        },
        {
          id: '10',
          invoiceNumber: 'INV-2024-010',
          customerId: '11',
          customerName: 'Smart Manufacturing Co.',
          invoiceDate: '2024-02-15',
          dueDate: '2024-03-15',
          status: 'paid',
          items: [],
          subtotal: 320000,
          taxAmount: 57600,
          totalAmount: 377600,
          paidAmount: 377600,
          balanceAmount: 0,
          paymentTerms: 'Net 45',
          notes: 'IoT implementation project',
          createdBy: 'Admin',
          createdDate: '2024-02-15',
          updatedDate: '2024-03-10'
        },
        {
          id: '11',
          invoiceNumber: 'INV-2024-011',
          customerId: '12',
          customerName: 'Financial Services Group',
          invoiceDate: '2024-02-18',
          dueDate: '2024-03-18',
          status: 'sent',
          items: [],
          subtotal: 150000,
          taxAmount: 27000,
          totalAmount: 177000,
          paidAmount: 75000,
          balanceAmount: 102000,
          paymentTerms: 'Net 30',
          notes: 'Cybersecurity assessment',
          createdBy: 'Admin',
          createdDate: '2024-02-18',
          updatedDate: '2024-02-18'
        },
        {
          id: '12',
          invoiceNumber: 'INV-2024-012',
          customerId: '13',
          customerName: 'Healthcare Plus Network',
          invoiceDate: '2024-02-20',
          dueDate: '2024-03-20',
          status: 'draft',
          items: [],
          subtotal: 200000,
          taxAmount: 36000,
          totalAmount: 236000,
          paidAmount: 0,
          balanceAmount: 236000,
          paymentTerms: 'Net 60',
          notes: 'Healthcare management system',
          createdBy: 'Admin',
          createdDate: '2024-02-20',
          updatedDate: '2024-02-20'
        },
        {
          id: '13',
          invoiceNumber: 'INV-2024-013',
          customerId: '14',
          customerName: 'Retail Chain International',
          invoiceDate: '2024-02-22',
          dueDate: '2024-03-22',
          status: 'paid',
          items: [],
          subtotal: 95000,
          taxAmount: 17100,
          totalAmount: 112100,
          paidAmount: 112100,
          balanceAmount: 0,
          paymentTerms: 'Net 30',
          notes: 'Point of sale system upgrade',
          createdBy: 'Admin',
          createdDate: '2024-02-22',
          updatedDate: '2024-03-15'
        },
        {
          id: '14',
          invoiceNumber: 'INV-2024-014',
          customerId: '15',
          customerName: 'Logistics Masters Ltd.',
          invoiceDate: '2024-02-25',
          dueDate: '2024-03-25',
          status: 'sent',
          items: [],
          subtotal: 175000,
          taxAmount: 31500,
          totalAmount: 206500,
          paidAmount: 0,
          balanceAmount: 206500,
          paymentTerms: 'Net 30',
          notes: 'Supply chain management solution',
          createdBy: 'Admin',
          createdDate: '2024-02-25',
          updatedDate: '2024-02-25'
        },
        {
          id: '15',
          invoiceNumber: 'INV-2024-015',
          customerId: '4',
          customerName: 'Innovate Systems',
          invoiceDate: '2024-02-28',
          dueDate: '2024-03-28',
          status: 'overdue',
          items: [],
          subtotal: 65000,
          taxAmount: 11700,
          totalAmount: 76700,
          paidAmount: 30000,
          balanceAmount: 46700,
          paymentTerms: 'Net 15',
          notes: 'Mobile app development',
          createdBy: 'Admin',
          createdDate: '2024-02-28',
          updatedDate: '2024-03-05'
        }
      ];
      this.filteredInvoices = this.invoices;
      this.calculateStats();
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalInvoices: this.invoices.length,
      paidInvoices: this.invoices.filter(inv => inv.status === 'paid').length,
      pendingInvoices: this.invoices.filter(inv => inv.status === 'sent' || inv.status === 'draft').length,
      totalRevenue: this.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0)
    };
  }

  filterInvoices() {
    this.filteredInvoices = this.invoices.filter(invoice => {
      const statusMatch = !this.selectedStatus || invoice.status === this.selectedStatus;
      const searchMatch = !this.searchTerm || 
        invoice.invoiceNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let dateMatch = true;
      if (this.dateRange) {
        const days = parseInt(this.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        dateMatch = new Date(invoice.invoiceDate) >= cutoffDate;
      }
      
      return statusMatch && searchMatch && dateMatch;
    });
  }

  refreshInvoices() {
    this.loadInvoices();
  }

  addNewItem() {
    this.newInvoice.items.push({
      id: Date.now().toString(),
      productId: '',
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      totalAmount: 0
    });
  }

  removeItem(index: number) {
    this.newInvoice.items.splice(index, 1);
    this.calculateTotals();
  }

  calculateItemTotal(item: any) {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    item.totalAmount = subtotal - discountAmount;
    this.calculateTotals();
  }

  calculateTotals() {
    this.newInvoice.subtotal = this.newInvoice.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    this.newInvoice.taxAmount = this.newInvoice.subtotal * 0.18; // 18% tax
    this.newInvoice.totalAmount = this.newInvoice.subtotal + this.newInvoice.taxAmount;
  }

  saveInvoice() {
    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(this.invoices.length + 1).padStart(3, '0')}`;
    
    const customer = this.customers.find(c => c.id === this.newInvoice.customerId);
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber,
      customerId: this.newInvoice.customerId,
      customerName: customer?.name || 'Unknown',
      invoiceDate: this.newInvoice.invoiceDate,
      dueDate: this.newInvoice.dueDate,
      status: 'draft',
      items: this.newInvoice.items,
      subtotal: this.newInvoice.subtotal,
      taxAmount: this.newInvoice.taxAmount,
      totalAmount: this.newInvoice.totalAmount,
      paidAmount: 0,
      balanceAmount: this.newInvoice.totalAmount,
      paymentTerms: 'Net 30',
      notes: this.newInvoice.notes,
      createdBy: 'Admin',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    this.invoices.unshift(invoice);
    this.filteredInvoices = this.invoices;
    this.calculateStats();
    this.showCreateForm = false;
    
    // Reset form
    this.newInvoice = {
      customerId: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [],
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      notes: ''
    };
    this.addNewItem();
  }

  viewInvoice(invoice: Invoice) {
    alert(`Viewing invoice: ${invoice.invoiceNumber}`);
  }

  editInvoice(invoice: Invoice) {
    alert(`Editing invoice: ${invoice.invoiceNumber}`);
  }

  sendInvoice(invoice: Invoice) {
    invoice.status = 'sent';
    alert(`Invoice ${invoice.invoiceNumber} sent to customer!`);
  }

  downloadInvoice(invoice: Invoice) {
    alert(`Downloading invoice: ${invoice.invoiceNumber}`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success';
      case 'sent': return 'bg-primary';
      case 'draft': return 'bg-secondary';
      case 'overdue': return 'bg-danger';
      case 'cancelled': return 'bg-dark';
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
