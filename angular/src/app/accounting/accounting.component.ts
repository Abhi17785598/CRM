import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  `],
  selector: 'app-accounting',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-3">Accounting</h2>
          <p class="text-muted">Manage financial operations and reporting</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="fas fa-file-invoice fa-3x text-primary mb-3"></i>
              <h5>Invoices</h5>
              <p class="text-muted">Manage invoices</p>
              <button class="btn btn-primary" (click)="navigateToInvoices()">View Invoices</button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="fas fa-credit-card fa-3x text-success mb-3"></i>
              <h5>Payments</h5>
              <p class="text-muted">Track payments</p>
              <button class="btn btn-success" (click)="navigateToPayments()">View Payments</button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="fas fa-receipt fa-3x text-warning mb-3"></i>
              <h5>Expenses</h5>
              <p class="text-muted">Manage expenses</p>
              <button class="btn btn-warning" (click)="navigateToExpenses()">View Expenses</button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center h-100">
            <div class="card-body">
              <i class="fas fa-chart-pie fa-3x text-info mb-3"></i>
              <h5>Reports</h5>
              <p class="text-muted">Financial reports</p>
              <button class="btn btn-info" (click)="navigateToReports()">View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccountingComponent {
  constructor(private router: Router) {}

  navigateToInvoices() {
    this.router.navigate(['/accounting/invoices']);
  }

  navigateToPayments() {
    this.router.navigate(['/accounting/payments']);
  }

  navigateToExpenses() {
    this.router.navigate(['/accounting/expenses']);
  }

  navigateToReports() {
    this.router.navigate(['/accounting/reports']);
  }
}
