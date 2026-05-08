import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HrmsService, Employee } from '../services/hrms.service';
import { CsvExportService } from '../services/csv-export.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Personnel Affairs & HR Functions</h2>
              <p class="text-muted">Manage your workforce, attendance tracking, and payroll operations</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshEmployees()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" routerLink="/hrms/employees/create">
                <i class="fas fa-user-plus me-2"></i>Add Employee
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
                  <p class="text-muted small mb-1">Total Employees</p>
                  <h4 class="mb-0">{{ stats.total }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-users fa-2x"></i>
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
                  <p class="text-muted small mb-1">Active</p>
                  <h4 class="mb-0">{{ stats.active }}</h4>
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
                  <p class="text-muted small mb-1">On Leave</p>
                  <h4 class="mb-0">{{ stats.onLeave }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-calendar-times fa-2x"></i>
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
                  <p class="text-muted small mb-1">New Hires</p>
                  <h4 class="mb-0">{{ stats.newHires }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-user-plus fa-2x"></i>
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
                  <label class="form-label">Department</label>
                  <select class="form-select" [(ngModel)]="filters.department" (change)="applyFilters()">
                    <option value="">All Departments</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="filters.status" (change)="applyFilters()">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by name, email, or ID..." 
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

      <!-- Employees Table -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Contact</th>
                      <th>Hire Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let employee of filteredEmployees">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                            {{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}
                          </div>
                          <div>
                            <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                            <br>
                            <small class="text-muted">{{ employee.email }}</small>
                          </div>
                        </div>
                      </td>
                      <td><code>{{ employee.id }}</code></td>
                      <td>{{ employee.department }}</td>
                      <td>{{ employee.position }}</td>
                      <td>
                        <div>
                          <i class="fas fa-phone text-muted me-1"></i> {{ employee.phone }}
                          <br>
                          <small class="text-muted">{{ employee.email }}</small>
                        </div>
                      </td>
                      <td>{{ employee.hireDate | date:'shortDate' }}</td>
                      <td>
                        <span class="badge bg-{{ getStatusColor(employee.isActive ? 'active' : 'inactive') }}">
                          {{ employee.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" 
                                  routerLink="/hrms/employees/{{ employee.id }}">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-secondary" 
                                  routerLink="/hrms/employees/{{ employee.id }}/edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-success" 
                                  (click)="generatePayslip(employee.id)">
                            <i class="fas fa-file-invoice"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div *ngIf="filteredEmployees.length === 0" class="text-center py-5">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No employees found</h5>
                <p class="text-muted">Try adjusting your filters or add new employees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeManagementComponent implements OnInit {
  employees$!: Observable<Employee[]>;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  
  stats = {
    total: 0,
    active: 0,
    onLeave: 0,
    newHires: 0
  };
  
  filters = {
    department: '',
    status: '',
    search: ''
  };

  constructor(
    private hrmsService: HrmsService,
    private csvExportService: CsvExportService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees$ = this.hrmsService.getEmployees();
    this.employees$.subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  applyFilters() {
    this.filteredEmployees = this.employees.filter(employee => {
      const departmentMatch = !this.filters.department || employee.department === this.filters.department;
      const statusMatch = !this.filters.status || (employee.status === 'active' ? 'active' : 'inactive') === this.filters.status;
      const searchMatch = !this.filters.search || 
        employee.firstName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        employee.id.toLowerCase().includes(this.filters.search.toLowerCase());
      
      return departmentMatch && statusMatch && searchMatch;
    });
  }

  clearFilters() {
    this.filters = {
      department: '',
      status: '',
      search: ''
    };
    this.filteredEmployees = this.employees;
  }

  calculateStats() {
    this.stats.total = this.employees.length;
    this.stats.active = this.employees.filter(e => e.status === 'active').length;
    this.stats.onLeave = this.employees.filter(e => e.status === 'on-leave').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.stats.newHires = this.employees.filter(e => {
      const hireDate = new Date(e.hireDate);
      return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
    }).length;
  }

  refreshEmployees() {
    this.loadEmployees();
  }

  exportToCsv() {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Position', 'Status', 'Hire Date'];
    const data = this.filteredEmployees.map(employee => ({
      employeeId: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      status: employee.status === 'active' ? 'Active' : 'Inactive',
      hireDate: employee.hireDate
    }));
    
    const filename = this.csvExportService.getTimestampedFilename('employees');
    this.csvExportService.exportToCsv(data, filename, headers);
  }

  generatePayslip(employeeId: string) {
    // This would generate a payslip for the employee
    console.log('Generate payslip for employee:', employeeId);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Active': 'success',
      'Inactive': 'secondary',
      'On Leave': 'warning',
      'Terminated': 'danger'
    };
    return colors[status] || 'secondary';
  }

  formatStatus(status: string): string {
    return status.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
