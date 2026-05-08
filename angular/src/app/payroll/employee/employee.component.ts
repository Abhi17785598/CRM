import { Component, OnInit } from '@angular/core';
import { ListService } from '@abp/ng.core';
import { EmployeeDto } from '../../models/payroll.models';

@Component({
  selector: 'app-employee',
  standalone: false,
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">Employee Management</h3>
        <button class="btn btn-primary" (click)="createEmployee()">
          <i class="fas fa-plus mr-2"></i>Add Employee
        </button>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Search employees..." 
                   [(ngModel)]="filter" (keyup)="search()">
          </div>
          <div class="col-md-3">
            <select class="form-control" [(ngModel)]="departmentFilter" (change)="search()">
              <option value="">All Departments</option>
              <option value="Production">Production</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div class="col-md-2">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" [(ngModel)]="activeOnly" (change)="search()">
              <label class="form-check-label">Active Only</label>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Base Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of employees">
                <td>{{ employee.employeeCode }}</td>
                <td>{{ employee.fullName }}</td>
                <td>{{ employee.department }}</td>
                <td>{{ employee.position }}</td>
                <td>{{ employee.baseSalary | currency }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(employee.isActive)">
                    {{ employee.isActive ? 'Active' : 'Terminated' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-info" (click)="viewEmployee(employee)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" (click)="editEmployee(employee)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-success" (click)="generatePayslip(employee.id)"
                            [disabled]="!employee.isActive">
                      <i class="fas fa-file-invoice-dollar"></i>
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
export class EmployeeComponent implements OnInit {
  employees: EmployeeDto[] = [];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  filter = '';
  departmentFilter = '';
  activeOnly = false;

  constructor(private listService: ListService) {}

  ngOnInit() {
    this.list();
  }

  list() {
    // Mock data for now
    this.employees = [
      {
        id: '1',
        employeeCode: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        phone: '123-456-7890',
        address: '123 Main St, City',
        dateOfBirth: new Date('1985-05-15'),
        hireDate: new Date('2020-01-10'),
        department: 'Production',
        position: 'Production Manager',
        baseSalary: 75000,
        bankAccountNumber: '1234567890',
        bankName: 'ABC Bank',
        panNumber: 'ABCDE1234F',
        isActive: true,
        terminationDate: null,
        terminationReason: null,
        fullName: 'John Smith',
        yearsOfService: 4
      },
      {
        id: '2',
        employeeCode: 'EMP002',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@company.com',
        phone: '098-765-4321',
        address: '456 Oak Ave, City',
        dateOfBirth: new Date('1990-08-22'),
        hireDate: new Date('2021-03-15'),
        department: 'HR',
        position: 'HR Manager',
        baseSalary: 65000,
        bankAccountNumber: '0987654321',
        bankName: 'XYZ Bank',
        panNumber: 'FGHIJ5678K',
        isActive: true,
        terminationDate: null,
        terminationReason: null,
        fullName: 'Jane Doe',
        yearsOfService: 3
      },
      {
        id: '3',
        employeeCode: 'EMP003',
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@company.com',
        phone: '555-123-4567',
        address: '789 Pine St, City',
        dateOfBirth: new Date('1988-12-10'),
        hireDate: new Date('2019-06-01'),
        department: 'Production',
        position: 'Machine Operator',
        baseSalary: 45000,
        bankAccountNumber: '5551234567',
        bankName: 'ABC Bank',
        panNumber: 'LMNOP9012Q',
        isActive: false,
        terminationDate: new Date('2023-12-31'),
        terminationReason: 'Resigned',
        fullName: 'Mike Wilson',
        yearsOfService: 4
      }
    ];
    this.totalItems = this.employees.length;
  }

  search() {
    // Implement search logic
    this.list();
  }

  pageChange(page: number) {
    this.currentPage = page;
    this.list();
  }

  createEmployee() {
    console.log('Create new employee');
  }

  viewEmployee(employee: EmployeeDto) {
    console.log('View employee:', employee);
  }

  editEmployee(employee: EmployeeDto) {
    console.log('Edit employee:', employee);
  }

  generatePayslip(employeeId: string) {
    console.log('Generate payslip for employee:', employeeId);
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-danger';
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
