import { Component, OnInit } from '@angular/core';
import { AccountingService, Expense } from '../services/accounting.service';

@Component({
  selector: 'app-expenses',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Expenses</h2>
              <p class="text-muted">Manage and track business expenses</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshExpenses()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showCreateForm = true">
                <i class="fas fa-plus me-2"></i>Add Expense
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
                  <p class="text-muted small mb-1">Total Expenses</p>
                  <h4 class="mb-0 text-primary">{{ stats.totalExpenses }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-receipt fa-2x"></i>
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
                  <p class="text-muted small mb-1">Approved</p>
                  <h4 class="mb-0 text-success">{{ stats.approvedExpenses }}</h4>
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
                  <h4 class="mb-0 text-warning">{{ stats.pendingExpenses }}</h4>
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
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterExpenses()">
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="selectedCategory" (change)="filterExpenses()">
                    <option value="">All Categories</option>
                    <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Range</label>
                  <select class="form-select" [(ngModel)]="dateRange" (change)="filterExpenses()">
                    <option value="">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by expense number or vendor..." 
                         [(ngModel)]="searchTerm" (input)="filterExpenses()">
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
        <p class="mt-2">Loading expenses...</p>
      </div>

      <!-- Expenses Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Expense #</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let expense of filteredExpenses">
                <td><strong>{{ expense.expenseNumber }}</strong></td>
                <td>{{ expense.vendorName }}</td>
                <td>{{ expense.expenseDate | date:'shortDate' }}</td>
                <td>
                  <span class="badge bg-light text-dark">{{ expense.category }}</span>
                </td>
                <td>{{ expense.description }}</td>
                <td class="fw-bold">{{ formatCurrency(expense.amount) }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(expense.status)">
                    {{ expense.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewExpense(expense)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="editExpense(expense)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-warning" *ngIf="expense.status === 'submitted'" (click)="approveExpense(expense)">
                      <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" *ngIf="expense.status === 'submitted'" (click)="rejectExpense(expense)">
                      <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-outline-info" *ngIf="expense.receipt" (click)="viewReceipt(expense)">
                      <i class="fas fa-file-image"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredExpenses.length === 0" class="text-center py-5">
        <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
        <h4>No expenses found</h4>
        <p class="text-muted">Try adjusting your filters or add a new expense.</p>
      </div>
    </div>

    <!-- Create Expense Modal -->
    <div *ngIf="showCreateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Expense</h5>
            <button type="button" class="btn-close" (click)="showCreateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Vendor</label>
                  <select class="form-select" [(ngModel)]="newExpense.vendorId" name="vendorId">
                    <option value="">Select Vendor</option>
                    <option *ngFor="let vendor of vendors" [value]="vendor.id">{{ vendor.name }}</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="newExpense.category" name="category">
                    <option value="">Select Category</option>
                    <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label">Expense Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newExpense.expenseDate" name="expenseDate">
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="newExpense.amount" name="amount" step="0.01">
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Currency</label>
                  <select class="form-select" [(ngModel)]="newExpense.currency" name="currency">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="newExpense.description" name="description" rows="3"></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Receipt</label>
                  <input type="file" class="form-control" (change)="onReceiptUpload($event)" accept="image/*,.pdf">
                  <small class="text-muted">Upload receipt image or PDF</small>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Notes</label>
                  <textarea class="form-control" [(ngModel)]="newExpense.notes" name="notes" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveExpense()">Save Expense</button>
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
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  loading = false;
  showCreateForm = false;

  selectedStatus = '';
  selectedCategory = '';
  dateRange = '';
  searchTerm = '';

  newExpense: any = {
    vendorId: '',
    expenseDate: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: 0,
    currency: 'INR',
    receipt: '',
    notes: ''
  };

  vendors = [
    { id: '1', name: 'Office Supplies Co.' },
    { id: '2', name: 'Tech Solutions Ltd.' },
    { id: '3', name: 'Travel Agency Inc.' },
    { id: '4', name: 'Food Services Corp.' },
    { id: '5', name: 'Utility Providers Ltd.' },
    { id: '6', name: 'Cloud Hosting Services' },
    { id: '7', name: 'Marketing Agency Pro' },
    { id: '8', name: 'Legal Services LLP' },
    { id: '9', name: 'Insurance Brokers Inc.' },
    { id: '10', name: 'Training Institute Ltd.' },
    { id: '11', name: 'Equipment Rental Co.' },
    { id: '12', name: 'Software Vendor Inc.' },
    { id: '13', name: 'Telecom Services Ltd.' },
    { id: '14', name: 'Security Services Corp.' },
    { id: '15', name: 'Facility Management Co.' }
  ];

  categories = [
    'Office Supplies',
    'Software & IT',
    'Travel & Entertainment',
    'Marketing & Advertising',
    'Utilities',
    'Rent & Lease',
    'Insurance',
    'Professional Services',
    'Training & Development',
    'Other'
  ];

  stats = {
    totalExpenses: 0,
    approvedExpenses: 0,
    pendingExpenses: 0,
    totalAmount: 0
  };

  constructor(private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.expenses = [
        {
          id: '1',
          expenseNumber: 'EXP-2024-001',
          vendorId: '1',
          vendorName: 'Office Supplies Co.',
          expenseDate: '2024-01-15',
          category: 'Office Supplies',
          description: 'Stationery and office supplies',
          amount: 5500,
          currency: 'INR',
          status: 'approved',
          receipt: 'receipt001.jpg',
          approvedBy: 'Manager',
          approvedDate: '2024-01-16',
          notes: 'Monthly office supplies',
          createdBy: 'Admin',
          createdDate: '2024-01-15',
          updatedDate: '2024-01-16'
        },
        {
          id: '2',
          expenseNumber: 'EXP-2024-002',
          vendorId: '2',
          vendorName: 'Tech Solutions Ltd.',
          expenseDate: '2024-01-20',
          category: 'Software & IT',
          description: 'Software license renewal',
          amount: 25000,
          currency: 'INR',
          status: 'submitted',
          receipt: 'receipt002.pdf',
          approvedBy: '',
          approvedDate: '',
          notes: 'Annual software subscription',
          createdBy: 'Admin',
          createdDate: '2024-01-20',
          updatedDate: '2024-01-20'
        },
        {
          id: '3',
          expenseNumber: 'EXP-2024-003',
          vendorId: '3',
          vendorName: 'Travel Agency Inc.',
          expenseDate: '2024-01-25',
          category: 'Travel & Entertainment',
          description: 'Business trip to Mumbai',
          amount: 15000,
          currency: 'INR',
          status: 'paid',
          receipt: 'receipt003.jpg',
          approvedBy: 'Manager',
          approvedDate: '2024-01-26',
          notes: 'Flight and hotel expenses',
          createdBy: 'Admin',
          createdDate: '2024-01-25',
          updatedDate: '2024-01-27'
        },
        {
          id: '4',
          expenseNumber: 'EXP-2024-004',
          vendorId: '4',
          vendorName: 'Food Services Corp.',
          expenseDate: '2024-01-28',
          category: 'Travel & Entertainment',
          description: 'Team lunch for project celebration',
          amount: 3500,
          currency: 'INR',
          status: 'draft',
          receipt: '',
          approvedBy: '',
          approvedDate: '',
          notes: 'Team celebration lunch',
          createdBy: 'Admin',
          createdDate: '2024-01-28',
          updatedDate: '2024-01-28'
        },
        {
          id: '5',
          expenseNumber: 'EXP-2024-005',
          vendorId: '5',
          vendorName: 'Utility Providers Ltd.',
          expenseDate: '2024-02-01',
          category: 'Utilities',
          description: 'Electricity and water bills',
          amount: 12000,
          currency: 'INR',
          status: 'approved',
          receipt: 'receipt005.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-02-02',
          notes: 'Monthly utility payments',
          createdBy: 'Admin',
          createdDate: '2024-02-01',
          updatedDate: '2024-02-02'
        },
        {
          id: '6',
          expenseNumber: 'EXP-2024-006',
          vendorId: '6',
          vendorName: 'Cloud Hosting Services',
          expenseDate: '2024-02-05',
          category: 'Software & IT',
          description: 'Cloud server hosting fees',
          amount: 18000,
          currency: 'INR',
          status: 'paid',
          receipt: 'receipt006.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-02-06',
          notes: 'Quarterly cloud hosting',
          createdBy: 'Admin',
          createdDate: '2024-02-05',
          updatedDate: '2024-02-08'
        },
        {
          id: '7',
          expenseNumber: 'EXP-2024-007',
          vendorId: '7',
          vendorName: 'Marketing Agency Pro',
          expenseDate: '2024-02-08',
          category: 'Marketing & Advertising',
          description: 'Digital marketing campaign',
          amount: 35000,
          currency: 'INR',
          status: 'submitted',
          receipt: 'receipt007.pdf',
          approvedBy: '',
          approvedDate: '',
          notes: 'Q1 marketing campaign',
          createdBy: 'Admin',
          createdDate: '2024-02-08',
          updatedDate: '2024-02-08'
        },
        {
          id: '8',
          expenseNumber: 'EXP-2024-008',
          vendorId: '8',
          vendorName: 'Legal Services LLP',
          expenseDate: '2024-02-10',
          category: 'Professional Services',
          description: 'Legal consultation fees',
          amount: 22000,
          currency: 'INR',
          status: 'approved',
          receipt: 'receipt008.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-02-11',
          notes: 'Contract review services',
          createdBy: 'Admin',
          createdDate: '2024-02-10',
          updatedDate: '2024-02-11'
        },
        {
          id: '9',
          expenseNumber: 'EXP-2024-009',
          vendorId: '9',
          vendorName: 'Insurance Brokers Inc.',
          expenseDate: '2024-02-12',
          category: 'Insurance',
          description: 'Office insurance premium',
          amount: 45000,
          currency: 'INR',
          status: 'paid',
          receipt: 'receipt009.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-02-13',
          notes: 'Annual insurance premium',
          createdBy: 'Admin',
          createdDate: '2024-02-12',
          updatedDate: '2024-02-15'
        },
        {
          id: '10',
          expenseNumber: 'EXP-2024-010',
          vendorId: '10',
          vendorName: 'Training Institute Ltd.',
          expenseDate: '2024-02-15',
          category: 'Training & Development',
          description: 'Employee training program',
          amount: 28000,
          currency: 'INR',
          status: 'submitted',
          receipt: 'receipt010.pdf',
          approvedBy: '',
          approvedDate: '',
          notes: 'Technical skills training',
          createdBy: 'Admin',
          createdDate: '2024-02-15',
          updatedDate: '2024-02-15'
        },
        {
          id: '11',
          expenseNumber: 'EXP-2024-011',
          vendorId: '11',
          vendorName: 'Equipment Rental Co.',
          expenseDate: '2024-02-18',
          category: 'Rent & Lease',
          description: 'Office equipment rental',
          amount: 8500,
          currency: 'INR',
          status: 'approved',
          receipt: 'receipt011.jpg',
          approvedBy: 'Manager',
          approvedDate: '2024-02-19',
          notes: 'Monthly equipment rental',
          createdBy: 'Admin',
          createdDate: '2024-02-18',
          updatedDate: '2024-02-19'
        },
        {
          id: '12',
          expenseNumber: 'EXP-2024-012',
          vendorId: '12',
          vendorName: 'Software Vendor Inc.',
          expenseDate: '2024-02-20',
          category: 'Software & IT',
          description: 'Development tools subscription',
          amount: 15000,
          currency: 'INR',
          status: 'paid',
          receipt: 'receipt012.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-02-21',
          notes: 'Annual dev tools license',
          createdBy: 'Admin',
          createdDate: '2024-02-20',
          updatedDate: '2024-02-22'
        },
        {
          id: '13',
          expenseNumber: 'EXP-2024-013',
          vendorId: '13',
          vendorName: 'Telecom Services Ltd.',
          expenseDate: '2024-02-22',
          category: 'Utilities',
          description: 'Internet and phone services',
          amount: 6500,
          currency: 'INR',
          status: 'approved',
          receipt: 'receipt013.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-02-23',
          notes: 'Monthly telecom services',
          createdBy: 'Admin',
          createdDate: '2024-02-22',
          updatedDate: '2024-02-23'
        },
        {
          id: '14',
          expenseNumber: 'EXP-2024-014',
          vendorId: '14',
          vendorName: 'Security Services Corp.',
          expenseDate: '2024-02-25',
          category: 'Professional Services',
          description: 'Security system maintenance',
          amount: 9500,
          currency: 'INR',
          status: 'submitted',
          receipt: 'receipt014.jpg',
          approvedBy: '',
          approvedDate: '',
          notes: 'Quarterly security maintenance',
          createdBy: 'Admin',
          createdDate: '2024-02-25',
          updatedDate: '2024-02-25'
        },
        {
          id: '15',
          expenseNumber: 'EXP-2024-015',
          vendorId: '15',
          vendorName: 'Facility Management Co.',
          expenseDate: '2024-02-28',
          category: 'Rent & Lease',
          description: 'Office rent and maintenance',
          amount: 75000,
          currency: 'INR',
          status: 'paid',
          receipt: 'receipt015.pdf',
          approvedBy: 'Manager',
          approvedDate: '2024-03-01',
          notes: 'Monthly office rent',
          createdBy: 'Admin',
          createdDate: '2024-02-28',
          updatedDate: '2024-03-02'
        }
      ];
      this.filteredExpenses = this.expenses;
      this.calculateStats();
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalExpenses: this.expenses.length,
      approvedExpenses: this.expenses.filter(e => e.status === 'approved' || e.status === 'paid').length,
      pendingExpenses: this.expenses.filter(e => e.status === 'submitted').length,
      totalAmount: this.expenses.filter(e => e.status === 'approved' || e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)
    };
  }

  filterExpenses() {
    this.filteredExpenses = this.expenses.filter(expense => {
      const statusMatch = !this.selectedStatus || expense.status === this.selectedStatus;
      const categoryMatch = !this.selectedCategory || expense.category === this.selectedCategory;
      const searchMatch = !this.searchTerm || 
        expense.expenseNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        expense.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let dateMatch = true;
      if (this.dateRange) {
        const days = parseInt(this.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        dateMatch = new Date(expense.expenseDate) >= cutoffDate;
      }
      
      return statusMatch && categoryMatch && searchMatch && dateMatch;
    });
  }

  refreshExpenses() {
    this.loadExpenses();
  }

  onReceiptUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newExpense.receipt = file.name;
    }
  }

  saveExpense() {
    const vendor = this.vendors.find(v => v.id === this.newExpense.vendorId);
    
    const expense: Expense = {
      id: Date.now().toString(),
      expenseNumber: `EXP-${new Date().getFullYear()}-${String(this.expenses.length + 1).padStart(3, '0')}`,
      vendorId: this.newExpense.vendorId,
      vendorName: vendor?.name || 'Unknown',
      expenseDate: this.newExpense.expenseDate,
      category: this.newExpense.category,
      description: this.newExpense.description,
      amount: this.newExpense.amount,
      currency: this.newExpense.currency,
      status: 'draft',
      receipt: this.newExpense.receipt,
      approvedBy: '',
      approvedDate: '',
      notes: this.newExpense.notes,
      createdBy: 'Admin',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    this.expenses.unshift(expense);
    this.filteredExpenses = this.expenses;
    this.calculateStats();
    this.showCreateForm = false;
    
    // Reset form
    this.newExpense = {
      vendorId: '',
      expenseDate: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: 0,
      currency: 'INR',
      receipt: '',
      notes: ''
    };
  }

  viewExpense(expense: Expense) {
    alert(`Viewing expense: ${expense.expenseNumber}\nVendor: ${expense.vendorName}\nCategory: ${expense.category}\nAmount: ${this.formatCurrency(expense.amount)}\nStatus: ${expense.status}\nDescription: ${expense.description}`);
  }

  editExpense(expense: Expense) {
    alert(`Editing expense: ${expense.expenseNumber}`);
  }

  approveExpense(expense: Expense) {
    expense.status = 'approved';
    expense.approvedBy = 'Manager';
    expense.approvedDate = new Date().toISOString();
    alert(`Expense ${expense.expenseNumber} approved successfully!`);
    this.calculateStats();
  }

  rejectExpense(expense: Expense) {
    if (confirm(`Are you sure you want to reject expense ${expense.expenseNumber}?`)) {
      expense.status = 'rejected';
      alert(`Expense ${expense.expenseNumber} rejected!`);
      this.calculateStats();
    }
  }

  viewReceipt(expense: Expense) {
    alert(`Viewing receipt for expense: ${expense.expenseNumber}\nReceipt file: ${expense.receipt}`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'submitted': return 'bg-warning';
      case 'draft': return 'bg-secondary';
      case 'rejected': return 'bg-danger';
      case 'paid': return 'bg-info';
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
