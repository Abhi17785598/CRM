import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HrmsService } from '../../services/hrms.service';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss']
})
export class AllEmployeesComponent implements OnInit {
  employees: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 100;
  totalPages: number = 1;
  searchTerm: string = '';
  filteredEmployees: any[] = [];

  constructor(private hrmsService: HrmsService) { }

  ngOnInit(): void {
    this.loadAllEmployees();
  }

  loadAllEmployees(): void {
    this.loading = true;
    console.log('🔄 Loading ALL employees from database...');
    
    // Load all employees with larger page size
    this.hrmsService.getEmployees().subscribe({
      next: (response: any) => {
        console.log('📥 Raw API response:', response);
        
        let employeeData = [];
        
        if (Array.isArray(response)) {
          employeeData = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          employeeData = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          employeeData = response.data;
        } else if (response && typeof response === 'object') {
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              employeeData = response[key];
              break;
            }
          }
        }
        
        console.log('📥 Total employees loaded:', employeeData.length);
        
        // Map all employees
        this.employees = employeeData.map((emp: any) => ({
          id: emp.id,
          employeeCode: emp.employeeCode || '',
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          phone: emp.phone || '',
          address: emp.address || '',
          dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : new Date(),
          hireDate: emp.hireDate ? new Date(emp.hireDate) : new Date(),
          department: emp.department || '',
          position: emp.position || '',
          baseSalary: emp.baseSalary || 0,
          bankAccountNumber: emp.bankAccountNumber || '',
          bankName: emp.bankName || '',
          panNumber: emp.panNumber || '',
          isActive: emp.isActive ?? false,
          fullName: `${(emp.firstName || '')} ${(emp.lastName || '')}`,
          yearsOfService: emp.hireDate ? this.calculateYearsOfService(new Date(emp.hireDate)) : 0
        }));
        
        this.filteredEmployees = [...this.employees];
        this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
        this.loading = false;
        
        console.log('✅ All employees loaded successfully:', this.employees.length);
      },
      error: (error) => {
        console.error('❌ Error loading employees:', error);
        this.loading = false;
      }
    });
  }

  searchEmployees(): void {
    if (!this.searchTerm) {
      this.filteredEmployees = [...this.employees];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(emp => 
        emp.employeeCode.toLowerCase().includes(term) ||
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term)
      );
    }
    
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  calculateYearsOfService(hireDate: Date): number {
    const now = new Date();
    const yearsDiff = now.getTime() - hireDate.getTime();
    return Math.floor(yearsDiff / (1000 * 60 * 60 * 24 * 365.25));
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-danger';
  }

  get paginatedEmployees(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginatedEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  getPaginatedStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  exportToCSV(): void {
    const csvData = this.filteredEmployees.map(emp => ({
      'Employee Code': emp.employeeCode,
      'First Name': emp.firstName,
      'Last Name': emp.lastName,
      'Email': emp.email,
      'Phone': emp.phone,
      'Department': emp.department,
      'Position': emp.position,
      'Base Salary (₹)': emp.baseSalary,
      'Status': this.getStatusText(emp.isActive),
      'Years of Service': emp.yearsOfService
    }));

    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }
}
