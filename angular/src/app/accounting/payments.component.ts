import { Component, OnInit } from '@angular/core';
import { AccountingService, Payment } from '../services/accounting.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Payments</h2>
              <p class="text-muted">Track and manage customer payments</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshPayments()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showCreateForm = true">
                <i class="fas fa-plus me-2"></i>Record Payment
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
                  <p class="text-muted small mb-1">Total Payments</p>
                  <h4 class="mb-0 text-primary">{{ stats.totalPayments }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-credit-card fa-2x"></i>
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
                  <h4 class="mb-0 text-success">{{ stats.completedPayments }}</h4>
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
                  <p class="text-muted small mb-1">Pending</p>
                  <h4 class="mb-0 text-warning">{{ stats.pendingPayments }}</h4>
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
                  <p class="text-muted small mb-1">Total Amount</p>
                  <h4 class="mb-0 text-info">{{ formatCurrency(stats.totalAmount) }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-money-check-alt fa-2x"></i>
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
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterPayments()">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Payment Method</label>
                  <select class="form-select" [(ngModel)]="selectedMethod" (change)="filterPayments()">
                    <option value="">All Methods</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Range</label>
                  <select class="form-select" [(ngModel)]="dateRange" (change)="filterPayments()">
                    <option value="">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by payment number or customer..." 
                         [(ngModel)]="searchTerm" (input)="filterPayments()">
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
        <p class="mt-2">Loading payments...</p>
      </div>

      <!-- Payments Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Payment #</th>
                <th>Customer</th>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payment of filteredPayments">
                <td><strong>{{ payment.paymentNumber }}</strong></td>
                <td>{{ payment.customerName }}</td>
                <td>{{ payment.invoiceNumber || '-' }}</td>
                <td>{{ payment.paymentDate | date:'shortDate' }}</td>
                <td class="fw-bold">{{ formatCurrency(payment.amount) }}</td>
                <td>
                  <span class="badge bg-light text-dark">{{ getMethodLabel(payment.paymentMethod) }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(payment.status)">
                    {{ payment.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewPayment(payment)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="editPayment(payment)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-warning" *ngIf="payment.status === 'pending'" (click)="processPayment(payment)">
                      <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" *ngIf="payment.status === 'completed'" (click)="refundPayment(payment)">
                      <i class="fas fa-undo"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredPayments.length === 0" class="text-center py-5">
        <i class="fas fa-credit-card fa-3x text-muted mb-3"></i>
        <h4>No payments found</h4>
        <p class="text-muted">Try adjusting your filters or record a new payment.</p>
      </div>
    </div>

    <!-- Create Payment Modal -->
    <div *ngIf="showCreateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Record New Payment</h5>
            <button type="button" class="btn-close" (click)="showCreateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Customer</label>
                  <select class="form-select" [(ngModel)]="newPayment.customerId" name="customerId" (change)="onCustomerChange()">
                    <option value="">Select Customer</option>
                    <option *ngFor="let customer of customers" [value]="customer.id">{{ customer.name }}</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Invoice (Optional)</label>
                  <select class="form-select" [(ngModel)]="newPayment.invoiceId" name="invoiceId">
                    <option value="">Select Invoice</option>
                    <option *ngFor="let invoice of customerInvoices" [value]="invoice.id">{{ invoice.invoiceNumber }} - {{ formatCurrency(invoice.balanceAmount) }}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label">Payment Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newPayment.paymentDate" name="paymentDate">
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="newPayment.amount" name="amount" step="0.01">
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Payment Method</label>
                  <select class="form-select" [(ngModel)]="newPayment.paymentMethod" name="paymentMethod">
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Reference Number</label>
                  <input type="text" class="form-control" [(ngModel)]="newPayment.reference" name="reference" 
                         placeholder="Check number, transaction ID, etc.">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="newPayment.status" name="status">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="newPayment.notes" name="notes" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="savePayment()">Save Payment</button>
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
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  loading = false;
  showCreateForm = false;

  selectedStatus = '';
  selectedMethod = '';
  dateRange = '';
  searchTerm = '';

  newPayment: any = {
    customerId: '',
    invoiceId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    paymentMethod: 'cash',
    status: 'pending',
    reference: '',
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

  customerInvoices: any[] = [];

  stats = {
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalAmount: 0
  };

  constructor(private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.payments = [
        {
          id: '1',
          paymentNumber: 'PAY-2024-001',
          customerId: '1',
          customerName: 'ABC Corporation',
          invoiceId: '1',
          invoiceNumber: 'INV-2024-001',
          paymentDate: '2024-01-20',
          amount: 59000,
          paymentMethod: 'bank-transfer',
          status: 'completed',
          reference: 'TXN123456789',
          notes: 'Payment for invoice INV-2024-001',
          createdBy: 'Admin',
          createdDate: '2024-01-20',
          updatedDate: '2024-01-20'
        },
        {
          id: '2',
          paymentNumber: 'PAY-2024-002',
          customerId: '3',
          customerName: 'Global Tech Solutions',
          invoiceId: '3',
          invoiceNumber: 'INV-2024-003',
          paymentDate: '2024-01-25',
          amount: 10000,
          paymentMethod: 'check',
          status: 'completed',
          reference: 'CHK001234',
          notes: 'Partial payment for invoice INV-2024-003',
          createdBy: 'Admin',
          createdDate: '2024-01-25',
          updatedDate: '2024-01-25'
        },
        {
          id: '3',
          paymentNumber: 'PAY-2024-003',
          customerId: '2',
          customerName: 'XYZ Industries',
          invoiceId: '',
          invoiceNumber: '',
          paymentDate: '2024-01-28',
          amount: 25000,
          paymentMethod: 'cash',
          status: 'pending',
          reference: '',
          notes: 'Advance payment for future services',
          createdBy: 'Admin',
          createdDate: '2024-01-28',
          updatedDate: '2024-01-28'
        },
        {
          id: '4',
          paymentNumber: 'PAY-2024-004',
          customerId: '5',
          customerName: 'MegaCorp International',
          invoiceId: '4',
          invoiceNumber: 'INV-2024-004',
          paymentDate: '2024-02-20',
          amount: 295000,
          paymentMethod: 'bank-transfer',
          status: 'completed',
          reference: 'TXN987654321',
          notes: 'Full payment for enterprise software implementation',
          createdBy: 'Admin',
          createdDate: '2024-02-20',
          updatedDate: '2024-02-20'
        },
        {
          id: '5',
          paymentNumber: 'PAY-2024-005',
          customerId: '6',
          customerName: 'TechGiant Solutions',
          invoiceId: '5',
          invoiceNumber: 'INV-2024-005',
          paymentDate: '2024-02-15',
          amount: 50000,
          paymentMethod: 'credit-card',
          status: 'completed',
          reference: 'CC456789123',
          notes: 'Partial payment for cloud infrastructure services',
          createdBy: 'Admin',
          createdDate: '2024-02-15',
          updatedDate: '2024-02-15'
        },
        {
          id: '6',
          paymentNumber: 'PAY-2024-006',
          customerId: '8',
          customerName: 'Digital Dynamics Inc.',
          invoiceId: '7',
          invoiceNumber: 'INV-2024-007',
          paymentDate: '2024-02-18',
          amount: 141600,
          paymentMethod: 'online',
          status: 'completed',
          reference: 'ONL789456123',
          notes: 'Full payment for digital transformation consulting',
          createdBy: 'Admin',
          createdDate: '2024-02-18',
          updatedDate: '2024-02-18'
        },
        {
          id: '7',
          paymentNumber: 'PAY-2024-007',
          customerId: '10',
          customerName: 'DataDriven Analytics',
          invoiceId: '9',
          invoiceNumber: 'INV-2024-009',
          paymentDate: '2024-02-25',
          amount: 20000,
          paymentMethod: 'bank-transfer',
          status: 'completed',
          reference: 'TXN456789987',
          notes: 'Partial payment for business intelligence platform',
          createdBy: 'Admin',
          createdDate: '2024-02-25',
          updatedDate: '2024-02-25'
        },
        {
          id: '8',
          paymentNumber: 'PAY-2024-008',
          customerId: '11',
          customerName: 'Smart Manufacturing Co.',
          invoiceId: '10',
          invoiceNumber: 'INV-2024-010',
          paymentDate: '2024-03-10',
          amount: 377600,
          paymentMethod: 'bank-transfer',
          status: 'completed',
          reference: 'TXN321654987',
          notes: 'Full payment for IoT implementation project',
          createdBy: 'Admin',
          createdDate: '2024-03-10',
          updatedDate: '2024-03-10'
        },
        {
          id: '9',
          paymentNumber: 'PAY-2024-009',
          customerId: '12',
          customerName: 'Financial Services Group',
          invoiceId: '11',
          invoiceNumber: 'INV-2024-011',
          paymentDate: '2024-03-05',
          amount: 75000,
          paymentMethod: 'check',
          status: 'completed',
          reference: 'CHK567890123',
          notes: 'Partial payment for cybersecurity assessment',
          createdBy: 'Admin',
          createdDate: '2024-03-05',
          updatedDate: '2024-03-05'
        },
        {
          id: '10',
          paymentNumber: 'PAY-2024-010',
          customerId: '14',
          customerName: 'Retail Chain International',
          invoiceId: '13',
          invoiceNumber: 'INV-2024-013',
          paymentDate: '2024-03-15',
          amount: 112100,
          paymentMethod: 'online',
          status: 'completed',
          reference: 'ONL147258369',
          notes: 'Full payment for point of sale system upgrade',
          createdBy: 'Admin',
          createdDate: '2024-03-15',
          updatedDate: '2024-03-15'
        },
        {
          id: '11',
          paymentNumber: 'PAY-2024-011',
          customerId: '4',
          customerName: 'Innovate Systems',
          invoiceId: '15',
          invoiceNumber: 'INV-2024-015',
          paymentDate: '2024-03-01',
          amount: 30000,
          paymentMethod: 'cash',
          status: 'completed',
          reference: '',
          notes: 'Partial payment for mobile app development',
          createdBy: 'Admin',
          createdDate: '2024-03-01',
          updatedDate: '2024-03-01'
        },
        {
          id: '12',
          paymentNumber: 'PAY-2024-012',
          customerId: '7',
          customerName: 'Enterprise Systems Ltd.',
          invoiceId: '',
          invoiceNumber: '',
          paymentDate: '2024-03-10',
          amount: 50000,
          paymentMethod: 'bank-transfer',
          status: 'pending',
          reference: 'TXN963258741',
          notes: 'Advance payment for upcoming ERP project',
          createdBy: 'Admin',
          createdDate: '2024-03-10',
          updatedDate: '2024-03-10'
        },
        {
          id: '13',
          paymentNumber: 'PAY-2024-013',
          customerId: '9',
          customerName: 'CloudFirst Technologies',
          invoiceId: '8',
          invoiceNumber: 'INV-2024-008',
          paymentDate: '2024-03-08',
          amount: 50000,
          paymentMethod: 'credit-card',
          status: 'completed',
          reference: 'CC789456123',
          notes: 'Partial payment for cloud migration services',
          createdBy: 'Admin',
          createdDate: '2024-03-08',
          updatedDate: '2024-03-08'
        },
        {
          id: '14',
          paymentNumber: 'PAY-2024-014',
          customerId: '13',
          customerName: 'Healthcare Plus Network',
          invoiceId: '',
          invoiceNumber: '',
          paymentDate: '2024-03-12',
          amount: 75000,
          paymentMethod: 'bank-transfer',
          status: 'pending',
          reference: 'TXN258147963',
          notes: 'Advance payment for healthcare system development',
          createdBy: 'Admin',
          createdDate: '2024-03-12',
          updatedDate: '2024-03-12'
        },
        {
          id: '15',
          paymentNumber: 'PAY-2024-015',
          customerId: '15',
          customerName: 'Logistics Masters Ltd.',
          invoiceId: '14',
          invoiceNumber: 'INV-2024-014',
          paymentDate: '2024-03-18',
          amount: 100000,
          paymentMethod: 'check',
          status: 'completed',
          reference: 'CHK987654321',
          notes: 'Partial payment for supply chain management solution',
          createdBy: 'Admin',
          createdDate: '2024-03-18',
          updatedDate: '2024-03-18'
        }
      ];
      this.filteredPayments = this.payments;
      this.calculateStats();
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalPayments: this.payments.length,
      completedPayments: this.payments.filter(p => p.status === 'completed').length,
      pendingPayments: this.payments.filter(p => p.status === 'pending').length,
      totalAmount: this.payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
    };
  }

  filterPayments() {
    this.filteredPayments = this.payments.filter(payment => {
      const statusMatch = !this.selectedStatus || payment.status === this.selectedStatus;
      const methodMatch = !this.selectedMethod || payment.paymentMethod === this.selectedMethod;
      const searchMatch = !this.searchTerm || 
        payment.paymentNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let dateMatch = true;
      if (this.dateRange) {
        const days = parseInt(this.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        dateMatch = new Date(payment.paymentDate) >= cutoffDate;
      }
      
      return statusMatch && methodMatch && searchMatch && dateMatch;
    });
  }

  refreshPayments() {
    this.loadPayments();
  }

  onCustomerChange() {
    // Load customer's unpaid invoices
    this.customerInvoices = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        balanceAmount: 0
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        balanceAmount: 88500
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        balanceAmount: 25400
      }
    ].filter(inv => inv.balanceAmount > 0);
  }

  savePayment() {
    const customer = this.customers.find(c => c.id === this.newPayment.customerId);
    const invoice = this.customerInvoices.find(inv => inv.id === this.newPayment.invoiceId);
    
    const payment: Payment = {
      id: Date.now().toString(),
      paymentNumber: `PAY-${new Date().getFullYear()}-${String(this.payments.length + 1).padStart(3, '0')}`,
      customerId: this.newPayment.customerId,
      customerName: customer?.name || 'Unknown',
      invoiceId: this.newPayment.invoiceId,
      invoiceNumber: invoice?.invoiceNumber,
      paymentDate: this.newPayment.paymentDate,
      amount: this.newPayment.amount,
      paymentMethod: this.newPayment.paymentMethod,
      status: this.newPayment.status,
      reference: this.newPayment.reference,
      notes: this.newPayment.notes,
      createdBy: 'Admin',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    this.payments.unshift(payment);
    this.filteredPayments = this.payments;
    this.calculateStats();
    this.showCreateForm = false;
    
    // Reset form
    this.newPayment = {
      customerId: '',
      invoiceId: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      paymentMethod: 'cash',
      status: 'pending',
      reference: '',
      notes: ''
    };
  }

  viewPayment(payment: Payment) {
    alert(`Viewing payment: ${payment.paymentNumber}\nCustomer: ${payment.customerName}\nAmount: ${this.formatCurrency(payment.amount)}\nMethod: ${this.getMethodLabel(payment.paymentMethod)}\nStatus: ${payment.status}`);
  }

  editPayment(payment: Payment) {
    alert(`Editing payment: ${payment.paymentNumber}`);
  }

  processPayment(payment: Payment) {
    payment.status = 'completed';
    alert(`Payment ${payment.paymentNumber} marked as completed!`);
  }

  refundPayment(payment: Payment) {
    if (confirm(`Are you sure you want to refund payment ${payment.paymentNumber}?`)) {
      payment.status = 'refunded';
      alert(`Payment ${payment.paymentNumber} refunded successfully!`);
    }
  }

  getMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'cash': 'Cash',
      'check': 'Check',
      'bank-transfer': 'Bank Transfer',
      'credit-card': 'Credit Card',
      'online': 'Online'
    };
    return labels[method] || method;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'failed': return 'bg-danger';
      case 'refunded': return 'bg-info';
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
