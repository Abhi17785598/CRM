import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  managerId?: string;
  managerName?: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  address: string;
  city: string;
  country: string;
  emergencyContact: EmergencyContact;
  skills: string[];
  certifications: Certification[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  basicSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  allowances: Allowance[];
  deductions: Deduction[];
  grossPay: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
  createdDate: string;
  updatedDate: string;
}

export interface Allowance {
  id: string;
  type: string;
  amount: number;
  description: string;
}

export interface Deduction {
  id: string;
  type: string;
  amount: number;
  description: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  breakTime?: number;
  totalHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  createdDate: string;
  updatedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class HrmsService {
  private baseUrl = 'http://localhost:44379/api/hrms';

  constructor(private http: HttpClient) {}

  // Test connection
  testConnection(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test`);
  }

  // Employee Management
  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/employees`);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, employee);
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/employees/${id}`);
  }

  getEmployeesByDepartment(department: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees/department/${department}`);
  }

  // Inventory Management
  getInventoryItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/inventory-items`);
  }

  getInventoryItem(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/inventory-items/${id}`);
  }

  createInventoryItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inventory-items`, item);
  }

  updateInventoryItem(id: string, item: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/inventory-items/${id}`, item);
  }

  deleteInventoryItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/inventory-items/${id}`);
  }

  // Payslip Management
  getPayslips(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/payslips`);
  }

  getPayslip(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/payslips/${id}`);
  }

  createPayslip(payslip: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payslips`, payslip);
  }

  updatePayslip(id: string, payslip: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/payslips/${id}`, payslip);
  }

  deletePayslip(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/payslips/${id}`);
  }

  // Test Methods
  testAppEmployees(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test-appemployees`);
  }

  testInventoryItems(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test-inventory-items`);
  }

  testPayslips(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test-payslips`);
  }

  // Attendance Management
  getAttendance(employeeId?: string, startDate?: string, endDate?: string): Observable<Attendance[]> {
    let params = '';
    if (employeeId) params += `?employeeId=${employeeId}`;
    if (startDate) params += `${params ? '&' : '?'}startDate=${startDate}`;
    if (endDate) params += `${params ? '&' : '?'}endDate=${endDate}`;
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance${params}`);
  }

  markAttendance(attendance: Partial<Attendance>): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.baseUrl}/attendance`, attendance);
  }

  updateAttendance(id: string, attendance: Partial<Attendance>): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.baseUrl}/attendance/${id}`, attendance);
  }

  deleteAttendance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/attendance/${id}`);
  }

  // Leave Management
  getLeaveRequests(employeeId?: string): Observable<LeaveRequest[]> {
    const url = employeeId ? `${this.baseUrl}/leaves?employeeId=${employeeId}` : `${this.baseUrl}/leaves`;
    return this.http.get<LeaveRequest[]>(url);
  }

  getLeaveRequest(id: string): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.baseUrl}/leaves/${id}`);
  }

  createLeaveRequest(leave: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/leaves`, leave);
  }

  updateLeaveRequest(id: string, leave: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.baseUrl}/leaves/${id}`, leave);
  }

  approveLeaveRequest(id: string): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/leaves/${id}/approve`, {});
  }

  rejectLeaveRequest(id: string, reason: string): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/leaves/${id}/reject`, { reason });
  }

  // Analytics
  getEmployeeStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/employees`);
  }

  getPayrollStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/payroll`);
  }

  getAttendanceStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/attendance`);
  }

  getLeaveStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/leaves`);
  }
}
