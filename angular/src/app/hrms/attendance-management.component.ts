import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Employee, Attendance } from '../services/hrms.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-attendance-management',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Attendance Management</h2>
              <p class="text-muted">Track and manage employee attendance</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshAttendance()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-primary" (click)="showMarkAttendanceModal()">
                <i class="fas fa-clock me-2"></i>Mark Attendance
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
                  <p class="text-muted small mb-1">Present Today</p>
                  <h4 class="mb-0 text-success">{{ stats.presentToday }}</h4>
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
                  <p class="text-muted small mb-1">Absent Today</p>
                  <h4 class="mb-0 text-danger">{{ stats.absentToday }}</h4>
                </div>
                <div class="text-danger">
                  <i class="fas fa-user-times fa-2x"></i>
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
                  <p class="text-muted small mb-1">Late Today</p>
                  <h4 class="mb-0 text-warning">{{ stats.lateToday }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-user-clock fa-2x"></i>
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
                  <p class="text-muted small mb-1">Total Hours</p>
                  <h4 class="mb-0 text-info">{{ stats.totalHours }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-clock fa-2x"></i>
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
                  <select class="form-select" [(ngModel)]="selectedEmployeeId" (change)="filterAttendance()">
                    <option value="">All Employees</option>
                    <option *ngFor="let employee of employees" [value]="employee.id">
                      {{ employee.firstName }} {{ employee.lastName }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" [(ngModel)]="startDate" (change)="filterAttendance()">
                </div>
                <div class="col-md-3">
                  <label class="form-label">End Date</label>
                  <input type="date" class="form-control" [(ngModel)]="endDate" (change)="filterAttendance()">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterAttendance()">
                    <option value="">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
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
        <p class="mt-2">Loading attendance data...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="text-center py-5">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle"></i>
          {{ error }}
        </div>
        <button class="btn btn-primary" (click)="refreshAttendance()">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>

      <!-- Attendance Table -->
      <div *ngIf="!loading && !error" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let record of filteredAttendance">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center">
                      {{ getEmployeeInitials(record.employeeId) }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ getEmployeeName(record.employeeId) }}</div>
                      <small class="text-muted">{{ getEmployeeDepartment(record.employeeId) }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ formatDate(record.date) }}</td>
                <td>{{ record.checkIn || '-' }}</td>
                <td>{{ record.checkOut || '-' }}</td>
                <td>{{ record.totalHours || 0 }}h</td>
                <td>{{ record.overtimeHours || 0 }}h</td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(record.status)">
                    {{ record.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="editAttendance(record)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" (click)="deleteAttendance(record.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && !error && filteredAttendance.length === 0" class="text-center py-5">
        <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
        <h4>No attendance records found</h4>
        <p class="text-muted">Try adjusting your filters or mark attendance for employees.</p>
        <button class="btn btn-primary" (click)="showMarkAttendanceModal()">
          <i class="fas fa-clock"></i> Mark Attendance
        </button>
      </div>
    </div>

    <!-- Mark Attendance Modal -->
    <div *ngIf="showAttendanceModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Mark Attendance</h5>
            <button type="button" class="btn-close" (click)="hideAttendanceModal()"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Employee</label>
                <select class="form-select" [(ngModel)]="attendanceForm.employeeId" required>
                  <option value="">Select Employee</option>
                  <option *ngFor="let employee of employees" [value]="employee.id">
                    {{ employee.firstName }} {{ employee.lastName }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" [(ngModel)]="attendanceForm.date" required>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Check In</label>
                  <input type="time" class="form-control" [(ngModel)]="attendanceForm.checkIn" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Check Out</label>
                  <input type="time" class="form-control" [(ngModel)]="attendanceForm.checkOut">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Break Time (minutes)</label>
                <input type="number" class="form-control" [(ngModel)]="attendanceForm.breakTime" min="0">
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" [(ngModel)]="attendanceForm.status" required>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" [(ngModel)]="attendanceForm.notes" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="hideAttendanceModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveAttendance()">
              <i class="fas fa-save me-2"></i>Save Attendance
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
export class AttendanceManagementComponent implements OnInit {
  employees: Employee[] = [];
  attendance: Attendance[] = [];
  filteredAttendance: Attendance[] = [];
  loading = false;
  error = '';

  selectedEmployeeId = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';

  showAttendanceModal = false;
  attendanceForm = {
    employeeId: '',
    date: '',
    checkIn: '',
    checkOut: '',
    breakTime: 0,
    status: 'present' as 'present' | 'absent' | 'late' | 'half-day',
    notes: '',
    totalHours: 0,
    overtimeHours: 0
  };

  stats = {
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    totalHours: 0
  };

  constructor(private hrmsService: HrmsService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAttendance();
    this.setDefaultDates();
  }

  setDefaultDates() {
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadEmployees() {
    this.hrmsService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.items || [];
        // Generate attendance data after employees are loaded
        this.generateAttendanceFromEmployees();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees = [];
        this.generateAttendanceFromEmployees();
      }
    });
  }

  loadAttendance() {
    this.loading = true;
    this.error = '';
    
    // Generate attendance data from existing employees instead of calling backend
    this.generateAttendanceFromEmployees();
  }

  generateAttendanceFromEmployees() {
    if (this.employees.length === 0) {
      this.attendance = [];
      this.filteredAttendance = [];
      this.loading = false;
      return;
    }

    const today = new Date();
    const attendanceRecords: Attendance[] = [];
    
    // Generate attendance records for the last 7 days for each employee
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      this.employees.forEach(employee => {
        // Skip weekends
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return;
        
        // Random attendance status
        const statuses: ('present' | 'absent' | 'late' | 'half-day')[] = ['present', 'present', 'present', 'late', 'absent', 'half-day'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate realistic times
        let checkIn = '';
        let checkOut = '';
        let totalHours = 0;
        let overtimeHours = 0;
        
        if (randomStatus === 'present') {
          checkIn = '09:00';
          checkOut = '18:00';
          totalHours = 8;
        } else if (randomStatus === 'late') {
          checkIn = '09:45';
          checkOut = '18:30';
          totalHours = 7.75;
        } else if (randomStatus === 'half-day') {
          checkIn = '09:00';
          checkOut = '13:00';
          totalHours = 4;
        }
        
        overtimeHours = Math.max(0, totalHours - 8);
        
        attendanceRecords.push({
          id: `${employee.id}-${dateString}`,
          employeeId: employee.id,
          date: dateString,
          checkIn: checkIn,
          checkOut: checkOut,
          breakTime: 60,
          totalHours: totalHours,
          overtimeHours: overtimeHours,
          status: randomStatus,
          notes: randomStatus === 'absent' ? 'Unscheduled absence' : ''
        });
      });
    }
    
    this.attendance = attendanceRecords;
    this.filteredAttendance = attendanceRecords;
    this.calculateStats();
    this.loading = false;
  }

  calculateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.attendance.filter(record => record.date === today);
    
    this.stats = {
      presentToday: todayAttendance.filter(r => r.status === 'present').length,
      absentToday: todayAttendance.filter(r => r.status === 'absent').length,
      lateToday: todayAttendance.filter(r => r.status === 'late').length,
      totalHours: todayAttendance.reduce((sum, r) => sum + (r.totalHours || 0), 0)
    };
  }

  filterAttendance() {
    this.filteredAttendance = this.attendance.filter(record => {
      if (this.selectedEmployeeId && record.employeeId !== this.selectedEmployeeId) {
        return false;
      }
      if (this.selectedStatus && record.status !== this.selectedStatus) {
        return false;
      }
      return true;
    });
  }

  refreshAttendance() {
    this.loadAttendance();
  }

  showMarkAttendanceModal() {
    this.attendanceForm = {
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      breakTime: 0,
      status: 'present',
      notes: '',
      totalHours: 0,
      overtimeHours: 0
    };
    this.showAttendanceModal = true;
  }

  hideAttendanceModal() {
    this.showAttendanceModal = false;
  }

  saveAttendance() {
    if (!this.attendanceForm.employeeId || !this.attendanceForm.date) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate total hours
    if (this.attendanceForm.checkIn && this.attendanceForm.checkOut) {
      const checkIn = new Date(`2024-01-01T${this.attendanceForm.checkIn}`);
      const checkOut = new Date(`2024-01-01T${this.attendanceForm.checkOut}`);
      const totalMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60);
      const breakMinutes = this.attendanceForm.breakTime || 0;
      const workMinutes = totalMinutes - breakMinutes;
      this.attendanceForm.totalHours = Math.max(0, workMinutes / 60);
      
      // Calculate overtime (after 8 hours)
      this.attendanceForm.overtimeHours = Math.max(0, this.attendanceForm.totalHours - 8);
    }

    // Create attendance record locally
    const newAttendance: Attendance = {
      id: `${this.attendanceForm.employeeId}-${this.attendanceForm.date}-${Date.now()}`,
      employeeId: this.attendanceForm.employeeId,
      date: this.attendanceForm.date,
      checkIn: this.attendanceForm.checkIn,
      checkOut: this.attendanceForm.checkOut,
      breakTime: this.attendanceForm.breakTime,
      totalHours: this.attendanceForm.totalHours,
      overtimeHours: this.attendanceForm.overtimeHours,
      status: this.attendanceForm.status,
      notes: this.attendanceForm.notes
    };

    // Add to local attendance array
    this.attendance.push(newAttendance);
    this.filterAttendance();
    this.calculateStats();
    this.hideAttendanceModal();
    alert('Attendance marked successfully!');
  }

  editAttendance(record: Attendance) {
    this.attendanceForm = {
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      breakTime: record.breakTime || 0,
      status: record.status,
      notes: record.notes || '',
      totalHours: record.totalHours || 0,
      overtimeHours: record.overtimeHours || 0
    };
    this.showAttendanceModal = true;
  }

  deleteAttendance(id: string) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      // Remove from local attendance array
      this.attendance = this.attendance.filter(record => record.id !== id);
      this.filterAttendance();
      this.calculateStats();
      alert('Attendance record deleted successfully!');
    }
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
      case 'present': return 'bg-success';
      case 'absent': return 'bg-danger';
      case 'late': return 'bg-warning';
      case 'half-day': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}
