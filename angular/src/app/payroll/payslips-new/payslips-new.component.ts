import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HrmsService } from '../../services/hrms.service';

@Component({
  selector: 'app-payslips-new',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payslips-new.component.html',
  styleUrls: ['./payslips-new.component.scss']
})
export class PayslipsNewComponent implements OnInit {
  payslips: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;
  searchTerm: string = '';
  filteredPayslips: any[] = [];
  showAddPayslipModal: boolean = false;
  editingPayslip: any = null;
  payslipForm: any = {
    employeeCode: '',
    employeeName: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: 0,
    hra: 0,
    conveyance: 0,
    medicalAllowance: 0,
    specialAllowance: 0,
    professionalTax: 0,
    tds: 0,
    netSalary: 0,
    payDate: new Date(),
    paymentMethod: 'Bank Transfer'
  };

  constructor(private hrmsService: HrmsService) { }

  ngOnInit(): void {
    this.loadPayslips();
  }

  loadPayslips(): void {
    this.loading = true;
    console.log('🔄 Loading payslips from database...');
    
    // Load payslips from AppPayslips table
    this.hrmsService.getPayslips().subscribe({
      next: (response: any) => {
        console.log('📥 Raw API response:', response);
        
        let payslipData = [];
        
        if (Array.isArray(response)) {
          payslipData = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          payslipData = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          payslipData = response.data;
        } else if (response && typeof response === 'object') {
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              payslipData = response[key];
              break;
            }
          }
        }
        
        console.log('📥 Total payslips loaded:', payslipData.length);
        
        // Map payslips
        this.payslips = payslipData.map((payslip: any) => ({
          id: payslip.id,
          employeeCode: payslip.employeeCode || '',
          employeeName: payslip.employeeName || '',
          month: payslip.month || '',
          year: payslip.year || new Date().getFullYear(),
          basicSalary: payslip.basicSalary || 0,
          hra: payslip.hra || 0,
          conveyance: payslip.conveyance || 0,
          medicalAllowance: payslip.medicalAllowance || 0,
          specialAllowance: payslip.specialAllowance || 0,
          professionalTax: payslip.professionalTax || 0,
          tds: payslip.tds || 0,
          netSalary: payslip.netSalary || 0,
          payDate: payslip.payDate ? new Date(payslip.payDate) : new Date(),
          paymentMethod: payslip.paymentMethod || 'Bank Transfer',
          status: payslip.status || 'Pending',
          createdAt: payslip.createdAt ? new Date(payslip.createdAt) : new Date()
        }));
        
        this.filteredPayslips = [...this.payslips];
        this.totalPages = Math.ceil(this.filteredPayslips.length / this.pageSize);
        this.loading = false;
        console.log('✅ Payslips loaded successfully:', this.payslips.length);
      },
      error: (error) => {
        console.error('❌ Error loading payslips:', error);
        this.loading = false;
        console.log('🔄 API failed - keeping current payslips');
      }
    });
  }

  searchPayslips(): void {
    if (!this.searchTerm) {
      this.filteredPayslips = [...this.payslips];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPayslips = this.payslips.filter(payslip => 
        payslip.employeeCode.toLowerCase().includes(term) ||
        payslip.employeeName.toLowerCase().includes(term) ||
        payslip.month.toLowerCase().includes(term) ||
        payslip.paymentMethod.toLowerCase().includes(term)
      );
    }
    
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPayslips.length / this.pageSize);
  }

  getStatusText(status: string): string {
    return status || 'Unknown';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getPaymentMethodClass(method: string): string {
    switch (method?.toLowerCase()) {
      case 'bank transfer':
        return 'badge-info';
      case 'cash':
        return 'badge-warning';
      case 'cheque':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  }

  get paginatedPayslips(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredPayslips.slice(startIndex, endIndex);
  }

  getPaginatedEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredPayslips.length);
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

  addPayslip(): void {
    this.editingPayslip = null;
    this.payslipForm = {
      employeeCode: '',
      employeeName: '',
      month: '',
      year: new Date().getFullYear(),
      basicSalary: 0,
      hra: 0,
      conveyance: 0,
      medicalAllowance: 0,
      specialAllowance: 0,
      professionalTax: 0,
      tds: 0,
      netSalary: 0,
      payDate: new Date(),
      paymentMethod: 'Bank Transfer'
    };
    this.showAddPayslipModal = true;
  }

  editPayslip(payslip: any): void {
    this.editingPayslip = { ...payslip };
    this.payslipForm = { ...payslip };
    this.showAddPayslipModal = true;
  }

  deletePayslip(payslip: any): void {
    if (confirm(`Are you sure you want to delete payslip for ${payslip.employeeName}?`)) {
      // Implement delete logic
      console.log('Deleting payslip:', payslip.employeeName);
    }
  }

  savePayslip(): void {
    if (this.editingPayslip) {
      // Update existing payslip
      const index = this.payslips.findIndex(p => p.id === this.editingPayslip.id);
      if (index !== -1) {
        this.payslips[index] = { ...this.editingPayslip, ...this.payslipForm };
      }
    } else {
      // Add new payslip
      const newPayslip = {
        id: Math.max(...this.payslips.map(p => p.id)) + 1,
        ...this.payslipForm,
        status: 'Pending',
        createdAt: new Date()
      };
      this.payslips.push(newPayslip);
    }
    
    this.filteredPayslips = [...this.payslips];
    this.showAddPayslipModal = false;
    this.editingPayslip = null;
  }

  closeModal(): void {
    this.showAddPayslipModal = false;
    this.editingPayslip = null;
    this.payslipForm = {
      employeeCode: '',
      employeeName: '',
      month: '',
      year: new Date().getFullYear(),
      basicSalary: 0,
      hra: 0,
      conveyance: 0,
      medicalAllowance: 0,
      specialAllowance: 0,
      professionalTax: 0,
      tds: 0,
      netSalary: 0,
      payDate: new Date(),
      paymentMethod: 'Bank Transfer'
    };
  }

  exportToCSV(): void {
    const csvData = this.filteredPayslips.map(payslip => ({
      'Employee Code': payslip.employeeCode,
      'Employee Name': payslip.employeeName,
      'Month': payslip.month,
      'Year': payslip.year,
      'Basic Salary (₹)': payslip.basicSalary,
      'HRA (₹)': payslip.hra,
      'Conveyance (₹)': payslip.conveyance,
      'Medical Allowance (₹)': payslip.medicalAllowance,
      'Special Allowance (₹)': payslip.specialAllowance,
      'Professional Tax (₹)': payslip.professionalTax,
      'TDS (₹)': payslip.tds,
      'Net Salary (₹)': payslip.netSalary,
      'Pay Date': payslip.payDate.toLocaleDateString(),
      'Payment Method': payslip.paymentMethod,
      'Status': payslip.status
    }));

    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `payslips_${new Date().toISOString().split('T')[0]}.csv`);
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
