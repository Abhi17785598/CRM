import { Component, OnInit } from '@angular/core';
import { ListService } from '@abp/ng.core';
import { PayslipDto } from '../../models/payroll.models';

@Component({
  selector: 'app-payslip',
  standalone: false,
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">Payslip Management</h3>
        <div>
          <button class="btn btn-success mr-2" (click)="generateMonthlyPayslips()">
            <i class="fas fa-calendar-alt mr-2"></i>Generate Monthly
          </button>
          <button class="btn btn-primary" (click)="createPayslip()">
            <i class="fas fa-plus mr-2"></i>Add Payslip
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-3">
            <input type="text" class="form-control" placeholder="Search payslips..." 
                   [(ngModel)]="filter" (keyup)="search()">
          </div>
          <div class="col-md-2">
            <select class="form-control" [(ngModel)]="statusFilter" (change)="search()">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div class="col-md-2">
            <input type="month" class="form-control" [(ngModel)]="monthFilter" (change)="search()">
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Payslip Number</th>
                <th>Employee Name</th>
                <th>Pay Period</th>
                <th>Gross Salary</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payslip of payslips">
                <td>{{ payslip.payslipNumber }}</td>
                <td>{{ payslip.employeeName }}</td>
                <td>{{ formatDate(payslip.payPeriodStart) }} - {{ formatDate(payslip.payPeriodEnd) }}</td>
                <td>{{ payslip.grossSalary | currency }}</td>
                <td>{{ payslip.totalDeductions | currency }}</td>
                <td class="font-weight-bold">{{ payslip.netSalary | currency }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(payslip.paymentStatus)">
                    {{ payslip.paymentStatus }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-info" (click)="viewPayslip(payslip)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" (click)="editPayslip(payslip)"
                            [disabled]="payslip.paymentStatus === 'Paid'">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-success" (click)="processPayslip(payslip.id)"
                            [disabled]="payslip.paymentStatus === 'Paid'">
                      <i class="fas fa-calculator"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" (click)="markAsPaid(payslip.id)"
                            [disabled]="payslip.paymentStatus === 'Paid'">
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <a class="page-link" href="#" (click)="pageChange(currentPage - 1); $event.preventDefault()">Previous</a>
            </li>
            <li class="page-item" [class.active]="page === currentPage" *ngFor="let page of getPages()">
              <a class="page-link" href="#" (click)="pageChange(page); $event.preventDefault()">{{ page }}</a>
            </li>
            <li class="page-item" [class.disabled]="currentPage === getTotalPages()">
              <a class="page-link" href="#" (click)="pageChange(currentPage + 1); $event.preventDefault()">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
})
export class PayslipComponent implements OnInit {
  payslips: PayslipDto[] = [];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  filter = '';
  statusFilter = '';
  monthFilter = '';

  constructor(private listService: ListService) {}

  ngOnInit() {
    this.list();
  }

  list() {
    // Mock data for now
    this.payslips = [
      {
        id: '1',
        payslipNumber: 'PSL-2024-01-EMP001',
        employeeId: '1',
        employeeName: 'John Smith',
        payPeriodStart: new Date('2024-01-01'),
        payPeriodEnd: new Date('2024-01-31'),
        paymentDate: new Date('2024-01-31'),
        baseSalary: 75000,
        overtimeHours: 10,
        overtimeRate: 500,
        overtimePay: 5000,
        allowances: 2000,
        grossSalary: 82000,
        pfContribution: 8200,
        professionalTax: 200,
        incomeTax: 12000,
        otherDeductions: 0,
        totalDeductions: 20400,
        netSalary: 61600,
        paymentStatus: 'Paid',
        notes: null
      },
      {
        id: '2',
        payslipNumber: 'PSL-2024-01-EMP002',
        employeeId: '2',
        employeeName: 'Jane Doe',
        payPeriodStart: new Date('2024-01-01'),
        payPeriodEnd: new Date('2024-01-31'),
        paymentDate: new Date('2024-01-31'),
        baseSalary: 65000,
        overtimeHours: 5,
        overtimeRate: 400,
        overtimePay: 2000,
        allowances: 1500,
        grossSalary: 68500,
        pfContribution: 6850,
        professionalTax: 200,
        incomeTax: 9000,
        otherDeductions: 500,
        totalDeductions: 16550,
        netSalary: 51950,
        paymentStatus: 'Pending',
        notes: 'Awaiting approval'
      }
    ];
    this.totalItems = this.payslips.length;
  }

  search() {
    // Implement search logic
    this.list();
  }

  pageChange(page: number) {
    this.currentPage = page;
    this.list();
  }

  createPayslip() {
    console.log('Create new payslip');
  }

  viewPayslip(payslip: PayslipDto) {
    console.log('View payslip:', payslip);
  }

  editPayslip(payslip: PayslipDto) {
    console.log('Edit payslip:', payslip);
  }

  processPayslip(payslipId: string) {
    console.log('Process payslip:', payslipId);
  }

  markAsPaid(payslipId: string) {
    console.log('Mark payslip as paid:', payslipId);
  }

  generateMonthlyPayslips() {
    console.log('Generate monthly payslips');
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'badge-success';
      case 'Pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
