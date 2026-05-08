import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Employee } from '../services/hrms.service';

@Component({
  selector: 'app-payroll-management',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Payroll Management</h2>
              <p class="text-muted">Manage employee salaries and payroll processing</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshPayroll()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="processPayroll()">
                <i class="fas fa-calculator me-2"></i>Process Payroll
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
                  <p class="text-muted small mb-1">Total Payroll</p>
                  <h4 class="mb-0 text-primary">{{ formatCurrency(stats.totalPayroll) }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-rupee-sign fa-2x"></i>
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
                  <p class="text-muted small mb-1">Active Employees</p>
                  <h4 class="mb-0 text-success">{{ stats.activeEmployees }}</h4>
                </div>
                <div class="text-success">
                  <i class="fas fa-user-check fa-2x"></i>
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
                  <p class="text-muted small mb-1">Avg. Salary</p>
                  <h4 class="mb-0 text-info">{{ formatCurrency(stats.averageSalary) }}</h4>
                </div>
                <div class="text-info">
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
                  <p class="text-muted small mb-1">Last Processed</p>
                  <h4 class="mb-0 text-warning">{{ stats.lastProcessed }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-calendar fa-2x"></i>
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
                  <label class="form-label">Department</label>
                  <select class="form-select" [(ngModel)]="selectedDepartment" (change)="filterEmployees()">
                    <option value="">All Departments</option>
                    <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterEmployees()">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Salary Range</label>
                  <select class="form-select" [(ngModel)]="salaryRange" (change)="filterEmployees()">
                    <option value="">All Ranges</option>
                    <option value="0-30000">Below ₹30,000</option>
                    <option value="30000-50000">₹30,000 - ₹50,000</option>
                    <option value="50000-70000">₹50,000 - ₹70,000</option>
                    <option value="70000+">Above ₹70,000</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search employees..." 
                         [(ngModel)]="searchTerm" (input)="filterEmployees()">
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
        <p class="mt-2">Loading payroll data...</p>
      </div>

      <!-- Payroll Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Base Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of filteredEmployees">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                      {{ getEmployeeInitials(emp.id) }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ emp.firstName }} {{ emp.lastName }}</div>
                      <small class="text-muted">{{ emp.email }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ emp.department }}</td>
                <td>{{ formatCurrency(emp.salary) }}</td>
                <td>{{ formatCurrency(calculateAllowances(emp)) }}</td>
                <td>{{ formatCurrency(calculateDeductions(emp)) }}</td>
                <td class="fw-bold">{{ formatCurrency(calculateNetSalary(emp)) }}</td>
                <td>
                  <span class="badge" [ngClass]="getPaymentStatusClass(getPaymentStatus(emp))">
                    {{ getPaymentStatus(emp) || 'Pending' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewPayrollDetails(emp)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="processEmployeeSalary(emp)">
                      <i class="fas fa-rupee-sign"></i>
                    </button>
                    <button class="btn btn-outline-info" (click)="generatePayslip(emp)">
                      <i class="fas fa-file-invoice"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredEmployees.length === 0" class="text-center py-5">
        <i class="fas fa-users fa-3x text-muted mb-3"></i>
        <h4>No employees found</h4>
        <p class="text-muted">Try adjusting your filters or check if employees have been added.</p>
      </div>
    </div>

    <!-- Payroll Details Modal -->
    <div *ngIf="showPayrollModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Payroll Details - {{ selectedEmployee?.firstName }} {{ selectedEmployee?.lastName }}</h5>
            <button type="button" class="btn-close" (click)="hidePayrollModal()"></button>
          </div>
          <div class="modal-body" *ngIf="selectedEmployee">
            <div class="row">
              <div class="col-md-6">
                <h6>Employee Information</h6>
                <table class="table table-sm">
                  <tr>
                    <td>Name:</td>
                    <td>{{ selectedEmployee.firstName }} {{ selectedEmployee.lastName }}</td>
                  </tr>
                  <tr>
                    <td>Department:</td>
                    <td>{{ selectedEmployee.department }}</td>
                  </tr>
                  <tr>
                    <td>Position:</td>
                    <td>{{ selectedEmployee.position }}</td>
                  </tr>
                  <tr>
                    <td>Employee ID:</td>
                    <td>{{ selectedEmployee.id }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6>Salary Breakdown</h6>
                <table class="table table-sm">
                  <tr>
                    <td>Base Salary:</td>
                    <td>{{ formatCurrency(selectedEmployee.salary) }}</td>
                  </tr>
                  <tr>
                    <td>Allowances:</td>
                    <td>{{ formatCurrency(calculateAllowances(selectedEmployee)) }}</td>
                  </tr>
                  <tr>
                    <td>Gross Salary:</td>
                    <td>{{ formatCurrency(selectedEmployee.salary + calculateAllowances(selectedEmployee)) }}</td>
                  </tr>
                  <tr>
                    <td>Deductions:</td>
                    <td>{{ formatCurrency(calculateDeductions(selectedEmployee)) }}</td>
                  </tr>
                  <tr class="fw-bold">
                    <td>Net Salary:</td>
                    <td>{{ formatCurrency(calculateNetSalary(selectedEmployee)) }}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col-12">
                <h6>Allowance Details</h6>
                <div class="row">
                  <div class="col-md-4">
                    <small>HRA: {{ formatCurrency(selectedEmployee.salary * 0.2) }}</small>
                  </div>
                  <div class="col-md-4">
                    <small>Transport: {{ formatCurrency(selectedEmployee.salary * 0.1) }}</small>
                  </div>
                  <div class="col-md-4">
                    <small>Medical: {{ formatCurrency(selectedEmployee.salary * 0.05) }}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col-12">
                <h6>Deduction Details</h6>
                <div class="row">
                  <div class="col-md-4">
                    <small>PF: {{ formatCurrency(selectedEmployee.salary * 0.12) }}</small>
                  </div>
                  <div class="col-md-4">
                    <small>Tax: {{ formatCurrency(selectedEmployee.salary * 0.1) }}</small>
                  </div>
                  <div class="col-md-4">
                    <small>Other: {{ formatCurrency(selectedEmployee.salary * 0.03) }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="hidePayrollModal()">Close</button>
            <button type="button" class="btn btn-primary" (click)="processEmployeeSalary(selectedEmployee)">
              <i class="fas fa-rupee-sign me-2"></i>Process Salary
            </button>
            <button type="button" class="btn btn-success" (click)="generatePayslip(selectedEmployee)">
              <i class="fas fa-file-invoice me-2"></i>Generate Payslip
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-sm {
      width: 40px;
      height: 40px;
      font-size: 14px;
      font-weight: bold;
    }
    .badge {
      font-size: 0.75rem;
    }
    .modal {
      z-index: 1050;
    }
    .modal.show {
      display: block !important;
    }
  `]
})
export class PayrollManagementComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = false;

  selectedDepartment = '';
  selectedStatus = '';
  salaryRange = '';
  searchTerm = '';

  showPayrollModal = false;
  selectedEmployee: Employee | null = null;

  departments: string[] = [];
  stats = {
    totalPayroll: 0,
    activeEmployees: 0,
    averageSalary: 0,
    lastProcessed: 'Never'
  };

  constructor(private hrmsService: HrmsService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.hrmsService.getEmployees().subscribe({
      next: (response) => {
        this.employees = (response.items || []).map(emp => ({
          ...emp,
          paymentStatus: Math.random() > 0.5 ? 'Paid' : 'Pending'
        }));
        this.filteredEmployees = this.employees;
        this.extractDepartments();
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees = [];
        this.filteredEmployees = [];
        this.loading = false;
      }
    });
  }

  extractDepartments() {
    this.departments = [...new Set(this.employees.map(emp => emp.department).filter(Boolean))];
  }

  calculateStats() {
    const activeEmployees = this.employees.filter(emp => emp.status === 'active');
    this.stats = {
      totalPayroll: activeEmployees.reduce((sum, emp) => sum + this.calculateNetSalary(emp), 0),
      activeEmployees: activeEmployees.length,
      averageSalary: activeEmployees.length > 0 ? activeEmployees.reduce((sum, emp) => sum + emp.salary, 0) / activeEmployees.length : 0,
      lastProcessed: new Date().toLocaleDateString()
    };
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(emp => {
      const deptMatch = !this.selectedDepartment || emp.department === this.selectedDepartment;
      const statusMatch = !this.selectedStatus || 
        (this.selectedStatus === 'active' && emp.status === 'active') ||
        (this.selectedStatus === 'inactive' && emp.status === 'inactive');
      
      let salaryMatch = true;
      if (this.salaryRange) {
        if (this.salaryRange === '0-30000') salaryMatch = emp.salary < 30000;
        else if (this.salaryRange === '30000-50000') salaryMatch = emp.salary >= 30000 && emp.salary < 50000;
        else if (this.salaryRange === '50000-70000') salaryMatch = emp.salary >= 50000 && emp.salary < 70000;
        else if (this.salaryRange === '70000+') salaryMatch = emp.salary >= 70000;
      }
      
      const searchMatch = !this.searchTerm || 
        emp.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return deptMatch && statusMatch && salaryMatch && searchMatch;
    });
  }

  refreshPayroll() {
    this.loadEmployees();
  }

  processPayroll() {
    if (confirm('Process payroll for all active employees?')) {
      this.filteredEmployees.forEach(emp => {
        if (emp.status === 'active') {
          (emp as any).paymentStatus = 'Paid';
        }
      });
      alert('Payroll processed successfully!');
    }
  }

  processEmployeeSalary(employee: Employee) {
    (employee as any).paymentStatus = 'Paid';
    alert(`Salary processed for ${employee.firstName} ${employee.lastName}`);
  }

  generatePayslip(employee: Employee) {
    alert(`Payslip generated for ${employee.firstName} ${employee.lastName}\nNet Salary: ${this.formatCurrency(this.calculateNetSalary(employee))}`);
  }

  viewPayrollDetails(employee: Employee) {
    this.selectedEmployee = employee;
    this.showPayrollModal = true;
  }

  hidePayrollModal() {
    this.showPayrollModal = false;
    this.selectedEmployee = null;
  }

  calculateAllowances(employee: Employee): number {
    return employee.salary * 0.35; // 20% HRA + 10% Transport + 5% Medical
  }

  calculateDeductions(employee: Employee): number {
    return employee.salary * 0.25; // 12% PF + 10% Tax + 3% Other
  }

  calculateNetSalary(employee: Employee): number {
    const gross = employee.salary + this.calculateAllowances(employee);
    const deductions = this.calculateDeductions(employee);
    return gross - deductions;
  }

  getEmployeeInitials(employeeId: string): string {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (!employee) return '??';
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  }

  getPaymentStatus(employee: Employee): string {
    return (employee as any).paymentStatus || 'Pending';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'bg-success';
      case 'Pending': return 'bg-warning';
      case 'Failed': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
