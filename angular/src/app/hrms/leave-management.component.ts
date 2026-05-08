import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Employee, LeaveRequest } from '../services/hrms.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-leave-management',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Leave Management</h2>
              <p class="text-muted">Manage employee leave requests and approvals</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshLeaves()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" (click)="showLeaveRequestModal()">
                <i class="fas fa-calendar-plus me-2"></i>Request Leave
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
                  <p class="text-muted small mb-1">Pending Requests</p>
                  <h4 class="mb-0 text-warning">{{ stats.pending }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-hourglass-half fa-2x"></i>
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
                  <p class="text-muted small mb-1">Approved Today</p>
                  <h4 class="mb-0 text-success">{{ stats.approvedToday }}</h4>
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
                  <p class="text-muted small mb-1">On Leave Now</p>
                  <h4 class="mb-0 text-info">{{ stats.onLeaveNow }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-calendar-check fa-2x"></i>
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
                  <p class="text-muted small mb-1">Total Requests</p>
                  <h4 class="mb-0 text-primary">{{ stats.total }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-list-alt fa-2x"></i>
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
                  <label class="form-label">Employee</label>
                  <select class="form-select" [(ngModel)]="selectedEmployeeId" (change)="filterLeaves()">
                    <option value="">All Employees</option>
                    <option *ngFor="let employee of employees" [value]="employee.id">
                      {{ employee.firstName }} {{ employee.lastName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterLeaves()">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Leave Type</label>
                  <select class="form-select" [(ngModel)]="selectedLeaveType" (change)="filterLeaves()">
                    <option value="">All Types</option>
                    <option value="annual">Annual</option>
                    <option value="sick">Sick</option>
                    <option value="personal">Personal</option>
                    <option value="maternity">Maternity</option>
                    <option value="paternity">Paternity</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
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
        <p class="mt-2">Loading leave requests...</p>
      </div>

      <!-- Leave Requests Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let leave of filteredLeaves">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                      {{ getEmployeeInitials(leave.employeeId) }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ getEmployeeName(leave.employeeId) }}</div>
                      <small class="text-muted">{{ getEmployeeDepartment(leave.employeeId) }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light text-dark">{{ leave.leaveType }}</span>
                </td>
                <td>{{ formatDate(leave.startDate) }}</td>
                <td>{{ formatDate(leave.endDate) }}</td>
                <td>{{ leave.daysRequested }}</td>
                <td>
                  <div class="text-truncate" style="max-width: 200px;" [title]="leave.reason">
                    {{ leave.reason }}
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(leave.status)">
                    {{ leave.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewLeaveDetails(leave)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button *ngIf="leave.status === 'pending'" class="btn btn-outline-success" (click)="approveLeave(leave.id)">
                      <i class="fas fa-check"></i>
                    </button>
                    <button *ngIf="leave.status === 'pending'" class="btn btn-outline-danger" (click)="rejectLeave(leave.id)">
                      <i class="fas fa-times"></i>
                    </button>
                    <button *ngIf="leave.status === 'approved'" class="btn btn-outline-warning" (click)="cancelLeave(leave.id)">
                      <i class="fas fa-ban"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredLeaves.length === 0" class="text-center py-5">
        <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
        <h4>No leave requests found</h4>
        <p class="text-muted">Try adjusting your filters or create a new leave request.</p>
        <button class="btn btn-primary" (click)="showLeaveRequestModal()">
          <i class="fas fa-calendar-plus"></i> Request Leave
        </button>
      </div>
    </div>

    <!-- Leave Request Modal -->
    <div *ngIf="showLeaveModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Request Leave</h5>
            <button type="button" class="btn-close" (click)="hideLeaveModal()"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Employee</label>
                <select class="form-select" [(ngModel)]="leaveForm.employeeId" required>
                  <option value="">Select Employee</option>
                  <option *ngFor="let employee of employees" [value]="employee.id">
                    {{ employee.firstName }} {{ employee.lastName }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Leave Type</label>
                <select class="form-select" [(ngModel)]="leaveForm.leaveType" required>
                  <option value="">Select Leave Type</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" [(ngModel)]="leaveForm.startDate" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">End Date</label>
                  <input type="date" class="form-control" [(ngModel)]="leaveForm.endDate" (change)="calculateDays()" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Days Requested</label>
                <input type="number" class="form-control" [(ngModel)]="leaveForm.daysRequested" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Reason</label>
                <textarea class="form-control" [(ngModel)]="leaveForm.reason" rows="3" required></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="hideLeaveModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveLeaveRequest()">
              <i class="fas fa-save me-2"></i>Submit Request
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
export class LeaveManagementComponent implements OnInit {
  employees: Employee[] = [];
  leaveRequests: LeaveRequest[] = [];
  filteredLeaves: LeaveRequest[] = [];
  loading = false;

  selectedEmployeeId = '';
  selectedStatus = '';
  selectedLeaveType = '';

  showLeaveModal = false;
  leaveForm = {
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    daysRequested: 0,
    reason: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected' | 'cancelled'
  };

  stats = {
    pending: 0,
    approvedToday: 0,
    onLeaveNow: 0,
    total: 0
  };

  constructor(private hrmsService: HrmsService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.generateLeaveData();
  }

  loadEmployees() {
    this.hrmsService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.items || [];
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees = [];
      }
    });
  }

  generateLeaveData() {
    this.loading = true;
    
    if (this.employees.length === 0) {
      this.leaveRequests = [];
      this.filteredLeaves = [];
      this.loading = false;
      return;
    }

    const leaveRecords: LeaveRequest[] = [];
    const today = new Date();
    
    // Generate sample leave requests for the last 30 days
    for (let i = 0; i < 20; i++) {
      const randomEmployee = this.employees[Math.floor(Math.random() * this.employees.length)];
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
      
      const daysRequested = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const statuses: ('pending' | 'approved' | 'rejected' | 'cancelled')[] = ['pending', 'approved', 'approved', 'rejected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const leaveTypes: ('annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid')[] = ['annual', 'sick', 'personal', 'unpaid'];
      const randomLeaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
      
      leaveRecords.push({
        id: `leave-${randomEmployee.id}-${startDate.getTime()}`,
        employeeId: randomEmployee.id,
        employeeName: `${randomEmployee.firstName} ${randomEmployee.lastName}`,
        leaveType: randomLeaveType,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        daysRequested: daysRequested,
        reason: this.getSampleReason(randomLeaveType),
        status: randomStatus,
        approvedBy: randomStatus === 'approved' ? 'Manager' : undefined,
        approvedDate: randomStatus === 'approved' ? startDate.toISOString().split('T')[0] : undefined,
        rejectionReason: randomStatus === 'rejected' ? 'Insufficient notice' : undefined,
        createdDate: startDate.toISOString().split('T')[0],
        updatedDate: startDate.toISOString().split('T')[0]
      });
    }
    
    this.leaveRequests = leaveRecords.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    this.filteredLeaves = this.leaveRequests;
    this.calculateStats();
    this.loading = false;
  }

  getSampleReason(leaveType: string): string {
    const reasons: { [key: string]: string[] } = {
      'annual': ['Family vacation', 'Personal time off', 'Travel plans', 'Rest and relaxation'],
      'sick': ['Medical appointment', 'Recovery from illness', 'Family member illness', 'Emergency'],
      'personal': ['Family emergency', 'Personal matters', 'Child care', 'Home maintenance'],
      'unpaid': ['Extended travel', 'Personal development', 'Family obligations']
    };
    const typeReasons = reasons[leaveType] || reasons['personal'];
    return typeReasons[Math.floor(Math.random() * typeReasons.length)];
  }

  calculateStats() {
    const today = new Date().toISOString().split('T')[0];
    this.stats = {
      pending: this.leaveRequests.filter(l => l.status === 'pending').length,
      approvedToday: this.leaveRequests.filter(l => l.status === 'approved' && l.approvedDate === today).length,
      onLeaveNow: this.leaveRequests.filter(l => {
        if (l.status !== 'approved') return false;
        const today = new Date();
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        return today >= start && today <= end;
      }).length,
      total: this.leaveRequests.length
    };
  }

  filterLeaves() {
    this.filteredLeaves = this.leaveRequests.filter(leave => {
      if (this.selectedEmployeeId && leave.employeeId !== this.selectedEmployeeId) {
        return false;
      }
      if (this.selectedStatus && leave.status !== this.selectedStatus) {
        return false;
      }
      if (this.selectedLeaveType && leave.leaveType !== this.selectedLeaveType) {
        return false;
      }
      return true;
    });
  }

  refreshLeaves() {
    this.generateLeaveData();
  }

  showLeaveRequestModal() {
    this.leaveForm = {
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      daysRequested: 0,
      reason: '',
      status: 'pending'
    };
    this.showLeaveModal = true;
  }

  hideLeaveModal() {
    this.showLeaveModal = false;
  }

  calculateDays() {
    if (this.leaveForm.startDate && this.leaveForm.endDate) {
      const start = new Date(this.leaveForm.startDate);
      const end = new Date(this.leaveForm.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      this.leaveForm.daysRequested = Math.max(0, days);
    }
  }

  saveLeaveRequest() {
    if (!this.leaveForm.employeeId || !this.leaveForm.leaveType || !this.leaveForm.startDate || !this.leaveForm.endDate || !this.leaveForm.reason) {
      alert('Please fill in all required fields');
      return;
    }

    const employee = this.employees.find(e => e.id === this.leaveForm.employeeId);
    
    const newLeave: LeaveRequest = {
      id: `leave-${this.leaveForm.employeeId}-${Date.now()}`,
      employeeId: this.leaveForm.employeeId,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
      leaveType: this.leaveForm.leaveType as any,
      startDate: this.leaveForm.startDate,
      endDate: this.leaveForm.endDate,
      daysRequested: this.leaveForm.daysRequested,
      reason: this.leaveForm.reason,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    this.leaveRequests.unshift(newLeave);
    this.filterLeaves();
    this.calculateStats();
    this.hideLeaveModal();
    alert('Leave request submitted successfully!');
  }

  approveLeave(id: string) {
    const leave = this.leaveRequests.find(l => l.id === id);
    if (leave) {
      leave.status = 'approved';
      leave.approvedBy = 'Manager';
      leave.approvedDate = new Date().toISOString().split('T')[0];
      leave.updatedDate = new Date().toISOString().split('T')[0];
      this.filterLeaves();
      this.calculateStats();
      alert('Leave request approved!');
    }
  }

  rejectLeave(id: string) {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      const leave = this.leaveRequests.find(l => l.id === id);
      if (leave) {
        leave.status = 'rejected';
        leave.rejectionReason = reason;
        leave.updatedDate = new Date().toISOString().split('T')[0];
        this.filterLeaves();
        this.calculateStats();
        alert('Leave request rejected!');
      }
    }
  }

  cancelLeave(id: string) {
    if (confirm('Are you sure you want to cancel this approved leave?')) {
      const leave = this.leaveRequests.find(l => l.id === id);
      if (leave) {
        leave.status = 'cancelled';
        leave.updatedDate = new Date().toISOString().split('T')[0];
        this.filterLeaves();
        this.calculateStats();
        alert('Leave request cancelled!');
      }
    }
  }

  viewLeaveDetails(leave: LeaveRequest) {
    alert(`Leave Details:\n\nEmployee: ${leave.employeeName}\nType: ${leave.leaveType}\nDuration: ${leave.daysRequested} days\nReason: ${leave.reason}\nStatus: ${leave.status}`);
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }

  getEmployeeDepartment(employeeId: string): string {
    const employee = this.employees.find(emp => emp.id === employeeId);
    return employee ? employee.department : '';
  }

  getEmployeeInitials(employeeId: string): string {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (!employee) return '??';
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'cancelled': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }
}
