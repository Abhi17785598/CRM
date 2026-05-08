import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountingService, Transaction, Invoice } from '../../services/accounting.service';
import { CsvExportService } from '../../services/csv-export.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accounting-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Accounting Dashboard</h2>
              <p class="text-muted">Manage your financial operations and accounting records</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshData()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" routerLink="/accounting/invoices/create">
                <i class="fas fa-plus me-2"></i>New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Overview Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Revenue</p>
                  <h4 class="mb-0">\${{ stats.totalRevenue.toLocaleString() }}</h4>
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
                  <p class="text-muted small mb-1">Total Expenses</p>
                  <h4 class="mb-0">\${{ stats.totalExpenses.toLocaleString() }}</h4>
                </div>
                <div class="text-danger">
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
                  <p class="text-muted small mb-1">Net Profit</p>
                  <h4 class="mb-0">\${{ stats.netProfit.toLocaleString() }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-chart-line fa-2x"></i>
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
                  <p class="text-muted small mb-1">Outstanding</p>
                  <h4 class="mb-0">\${{ stats.outstanding.toLocaleString() }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0">
              <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <button class="btn btn-outline-primary w-100" routerLink="/accounting/invoices/create">
                    <i class="fas fa-file-invoice me-2"></i>Create Invoice
                  </button>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <button class="btn btn-outline-success w-100" routerLink="/accounting/payments/create">
                    <i class="fas fa-money-bill-wave me-2"></i>Record Payment
                  </button>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <button class="btn btn-outline-warning w-100" routerLink="/accounting/expenses/create">
                    <i class="fas fa-receipt me-2"></i>Add Expense
                  </button>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <button class="btn btn-outline-info w-100" routerLink="/accounting/reports">
                    <i class="fas fa-chart-bar me-2"></i>View Reports
                  </button>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <button class="btn btn-outline-secondary w-100" routerLink="/accounting/transactions">
                    <i class="fas fa-list me-2"></i>Transactions
                  </button>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <button class="btn btn-outline-dark w-100" (click)="generateReport()">
                    <i class="fas fa-download me-2"></i>Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="row mb-4">
        <div class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Recent Transactions</h5>
              <button class="btn btn-sm btn-outline-primary" routerLink="/accounting/transactions">
                View All
              </button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let transaction of recentTransactions">
                      <td>{{ transaction.date | date:'shortDate' }}</td>
                      <td>{{ transaction.description }}</td>
                      <td>
                        <span class="badge bg-{{ getTransactionTypeColor(transaction.totalDebit > 0) }}">
                          {{ transaction.totalDebit > 0 ? 'Expense' : 'Income' }}
                        </span>
                      </td>
                      <td class="text-danger">
                        {{ transaction.totalDebit > 0 ? '$' + transaction.totalDebit.toLocaleString() : '-' }}
                      </td>
                      <td class="text-success">
                        {{ transaction.totalCredit > 0 ? '$' + transaction.totalCredit.toLocaleString() : '-' }}
                      </td>
                      <td>
                        <span class="badge bg-{{ getTransactionStatusColor(transaction.status) }}">
                          {{ formatTransactionStatus(transaction.status) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Recent Invoices</h5>
              <button class="btn btn-sm btn-outline-primary" routerLink="/accounting/invoices">
                View All
              </button>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div *ngFor="let invoice of recentInvoices" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">{{ invoice.invoiceNumber }}</h6>
                    <small class="text-muted">{{ invoice.customerName }}</small>
                  </div>
                  <div class="text-end">
                    <strong>\${{ invoice.totalAmount.toLocaleString() }}</strong>
                    <br>
                    <span class="badge bg-{{ getInvoiceStatusColor(invoice.status) }}">
                      {{ formatInvoiceStatus(invoice.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccountingDashboardComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  invoices$!: Observable<Invoice[]>;
  recentTransactions: Transaction[] = [];
  recentInvoices: Invoice[] = [];
  
  stats = {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    outstanding: 0
  };

  constructor(
    private accountingService: AccountingService,
    private csvExportService: CsvExportService
  ) {}

  ngOnInit() {
    this.loadAccountingData();
  }

  loadAccountingData() {
    // Load transactions
    this.transactions$ = this.accountingService.getTransactions();
    this.transactions$.subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(0, 10);
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });

    // Load invoices
    this.invoices$ = this.accountingService.getInvoices();
    this.invoices$.subscribe({
      next: (invoices) => {
        this.recentInvoices = invoices.slice(0, 5);
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
      }
    });
  }

  calculateStats() {
    // Calculate stats from transactions
    const totalRevenue = this.recentTransactions
      .filter(t => t.totalCredit > 0)
      .reduce((sum, t) => sum + t.totalCredit, 0);
    
    const totalExpenses = this.recentTransactions
      .filter(t => t.totalDebit > 0)
      .reduce((sum, t) => sum + t.totalDebit, 0);

    this.stats.totalRevenue = totalRevenue;
    this.stats.totalExpenses = totalExpenses;
    this.stats.netProfit = totalRevenue - totalExpenses;
    
    // Calculate outstanding from invoices
    this.stats.outstanding = this.recentInvoices
      .filter(i => i.status !== 'paid')
      .reduce((sum, i) => sum + i.balanceAmount, 0);
  }

  refreshData() {
    this.loadAccountingData();
  }

  generateReport() {
    const data = [
      { metric: 'Total Revenue', value: this.stats.totalRevenue },
      { metric: 'Total Expenses', value: this.stats.totalExpenses },
      { metric: 'Net Profit', value: this.stats.netProfit },
      { metric: 'Outstanding', value: this.stats.outstanding }
    ];
    
    const headers = ['Metric', 'Value'];
    const filename = this.csvExportService.getTimestampedFilename('accounting_summary');
    this.csvExportService.exportToCsv(data, filename, headers);
  }

  getTransactionTypeColor(isExpense: boolean): string {
    return isExpense ? 'danger' : 'success';
  }

  getTransactionStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'draft': 'secondary',
      'posted': 'success',
      'reversed': 'danger'
    };
    return colors[status] || 'secondary';
  }

  getInvoiceStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'draft': 'secondary',
      'sent': 'info',
      'paid': 'success',
      'overdue': 'danger',
      'cancelled': 'warning'
    };
    return colors[status] || 'secondary';
  }

  formatTransactionStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatInvoiceStatus(status: string): string {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
