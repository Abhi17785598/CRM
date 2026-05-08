import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEmployeeDto } from '../../models/payroll.models';

@Component({
  selector: 'app-employee-create',
  standalone: false,
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Create New Employee</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form #employeeForm="ngForm">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Employee Code *</label>
              <input type="text" class="form-control" name="employeeCode" 
                     [(ngModel)]="employee.employeeCode" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Department *</label>
              <select class="form-select" name="department" 
                      [(ngModel)]="employee.department" required>
                <option value="">Select Department</option>
                <option value="Production">Production</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Management">Management</option>
                <option value="Sales">Sales</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">First Name *</label>
              <input type="text" class="form-control" name="firstName" 
                     [(ngModel)]="employee.firstName" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Last Name *</label>
              <input type="text" class="form-control" name="lastName" 
                     [(ngModel)]="employee.lastName" required>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input type="email" class="form-control" name="email" 
                     [(ngModel)]="employee.email" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Phone *</label>
              <input type="tel" class="form-control" name="phone" 
                     [(ngModel)]="employee.phone" required>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Address</label>
          <textarea class="form-control" name="address" rows="2"
                    [(ngModel)]="employee.address"></textarea>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">Position *</label>
              <input type="text" class="form-control" name="position" 
                     [(ngModel)]="employee.position" required>
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">Base Salary *</label>
              <input type="number" class="form-control" name="baseSalary" 
                     [(ngModel)]="employee.baseSalary" min="0" required>
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">Date of Birth *</label>
              <input type="date" class="form-control" name="dateOfBirth" 
                     [(ngModel)]="employee.dateOfBirth" required>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Hire Date *</label>
              <input type="date" class="form-control" name="hireDate" 
                     [(ngModel)]="employee.hireDate" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">PAN Number *</label>
              <input type="text" class="form-control" name="panNumber" 
                     [(ngModel)]="employee.panNumber" required>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Bank Name *</label>
              <input type="text" class="form-control" name="bankName" 
                     [(ngModel)]="employee.bankName" required>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Bank Account Number *</label>
              <input type="text" class="form-control" name="bankAccountNumber" 
                     [(ngModel)]="employee.bankAccountNumber" required>
            </div>
          </div>
        </div>

        <div class="alert alert-success">
          <i class="fas fa-calculator me-2"></i>
          <strong>Salary Summary:</strong><br>
          Base Salary: {{ employee.baseSalary | currency }}<br>
          Annual Salary: {{ (employee.baseSalary * 12) | currency }}<br>
          Employee: {{ employee.firstName }} {{ employee.lastName }}
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        Cancel
      </button>
      <button type="button" class="btn btn-primary" (click)="saveEmployee()"
              [disabled]="!employeeForm.form.valid">
        Create Employee
      </button>
    </div>
  `,
})
export class EmployeeCreateComponent implements OnInit {
  employee: CreateEmployeeDto = {
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: new Date(),
    hireDate: new Date(),
    department: '',
    position: '',
    baseSalary: 0,
    bankAccountNumber: '',
    bankName: '',
    panNumber: ''
  };

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    // Generate employee code
    this.employee.employeeCode = 'EMP' + Date.now().toString().slice(-4);
    
    // Set default hire date to today
    this.employee.hireDate = new Date();
  }

  saveEmployee() {
    console.log('Creating employee:', this.employee);
    // Here you would call your API service
    this.activeModal.close(this.employee);
  }
}
