import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayslipDto } from '../../models/payroll.models';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticPayslips: PayslipDto[] = [
  {
    id: '1',
    payslipNumber: 'PSL-2024-001',
    employeeId: '1',
    employeeName: 'John Smith',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-01-31'),
    baseSalary: 75000,
    overtimeHours: 8,
    overtimeRate: 45,
    overtimePay: 360,
    allowances: 500,
    grossSalary: 75860,
    pfContribution: 7500,
    professionalTax: 200,
    incomeTax: 12000,
    otherDeductions: 100,
    totalDeductions: 19800,
    netSalary: 56060,
    paymentStatus: 'Paid',
    notes: 'Monthly salary with overtime'
  },
  {
    id: '2',
    payslipNumber: 'PSL-2024-002',
    employeeId: '2',
    employeeName: 'Sarah Johnson',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-01-31'),
    baseSalary: 55000,
    overtimeHours: 0,
    overtimeRate: 32,
    overtimePay: 0,
    allowances: 300,
    grossSalary: 55300,
    pfContribution: 5500,
    professionalTax: 200,
    incomeTax: 8000,
    otherDeductions: 0,
    totalDeductions: 13700,
    netSalary: 41600,
    paymentStatus: 'Paid',
    notes: 'Regular monthly salary'
  },
  {
    id: '3',
    payslipNumber: 'PSL-2024-003',
    employeeId: '3',
    employeeName: 'Michael Brown',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-02-05'),
    baseSalary: 65000,
    overtimeHours: 12,
    overtimeRate: 38,
    overtimePay: 456,
    allowances: 400,
    grossSalary: 65856,
    pfContribution: 6500,
    professionalTax: 200,
    incomeTax: 10000,
    otherDeductions: 150,
    totalDeductions: 16850,
    netSalary: 49006,
    paymentStatus: 'Pending',
    notes: 'Monthly salary with overtime and performance bonus'
  },
  {
    id: '4',
    payslipNumber: 'PSL-2024-004',
    employeeId: '4',
    employeeName: 'Emily Davis',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-02-05'),
    baseSalary: 95000,
    overtimeHours: 5,
    overtimeRate: 55,
    overtimePay: 275,
    allowances: 1000,
    grossSalary: 96275,
    pfContribution: 9500,
    professionalTax: 200,
    incomeTax: 15000,
    otherDeductions: 200,
    totalDeductions: 24900,
    netSalary: 71375,
    paymentStatus: 'Pending',
    notes: 'Executive salary with management allowance'
  },
  {
    id: '5',
    payslipNumber: 'PSL-2024-005',
    employeeId: '5',
    employeeName: 'Robert Wilson',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-02-05'),
    baseSalary: 45000,
    overtimeHours: 15,
    overtimeRate: 28,
    overtimePay: 420,
    allowances: 200,
    grossSalary: 45620,
    pfContribution: 4500,
    professionalTax: 200,
    incomeTax: 6000,
    otherDeductions: 50,
    totalDeductions: 10750,
    netSalary: 34870,
    paymentStatus: 'Paid',
    notes: 'Junior position with overtime'
  },
  {
    id: '6',
    payslipNumber: 'PSL-2024-006',
    employeeId: '6',
    employeeName: 'Lisa Anderson',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-02-05'),
    baseSalary: 85000,
    overtimeHours: 6,
    overtimeRate: 50,
    overtimePay: 300,
    allowances: 800,
    grossSalary: 86100,
    pfContribution: 8500,
    professionalTax: 200,
    incomeTax: 13000,
    otherDeductions: 100,
    totalDeductions: 21800,
    netSalary: 64300,
    paymentStatus: 'Pending',
    notes: 'Senior developer position'
  },
  {
    id: '7',
    payslipNumber: 'PSL-2024-007',
    employeeId: '7',
    employeeName: 'James Martinez',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-02-05'),
    baseSalary: 72000,
    overtimeHours: 10,
    overtimeRate: 42,
    overtimePay: 420,
    allowances: 600,
    grossSalary: 73020,
    pfContribution: 7200,
    professionalTax: 200,
    incomeTax: 11000,
    otherDeductions: 80,
    totalDeductions: 18480,
    netSalary: 54540,
    paymentStatus: 'Paid',
    notes: 'Team lead with project bonus'
  },
  {
    id: '8',
    payslipNumber: 'PSL-2024-008',
    employeeId: '8',
    employeeName: 'Jennifer Taylor',
    payPeriodStart: new Date('2024-01-01'),
    payPeriodEnd: new Date('2024-01-31'),
    paymentDate: new Date('2024-02-05'),
    baseSalary: 68000,
    overtimeHours: 8,
    overtimeRate: 40,
    overtimePay: 320,
    allowances: 450,
    grossSalary: 68770,
    pfContribution: 6800,
    professionalTax: 200,
    incomeTax: 10000,
    otherDeductions: 120,
    totalDeductions: 17120,
    netSalary: 51650,
    paymentStatus: 'Pending',
    notes: 'Marketing specialist'
  }
];

@Component({
  selector: 'app-payslips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payslips.component.html',
  styleUrls: ['./payslips.component.css']
})
export class PayslipsComponent implements OnInit {
  payslips: PayslipDto[] = [];
  selectedPayslip: PayslipDto | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newPayslip: Partial<PayslipDto> = {
    payslipNumber: '',
    employeeId: '',
    employeeName: '',
    payPeriodStart: new Date(),
    payPeriodEnd: new Date(),
    paymentDate: new Date(),
    baseSalary: 0,
    overtimeHours: 0,
    overtimeRate: 0,
    overtimePay: 0,
    allowances: 0,
    grossSalary: 0,
    pfContribution: 0,
    professionalTax: 0,
    incomeTax: 0,
    otherDeductions: 0,
    totalDeductions: 0,
    netSalary: 0,
    paymentStatus: 'Pending',
    notes: ''
  };

  constructor(private csvExportService: CsvExportService) { }

  ngOnInit(): void {
    // Load static data
    this.payslips = [...staticPayslips];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  selectPayslip(payslip: PayslipDto): void {
    console.log('Selecting payslip:', payslip);
    this.selectedPayslip = payslip;
  }

  createPayslip(): void {
    console.log('Creating payslip:', this.newPayslip);
    if (this.newPayslip.payslipNumber && this.newPayslip.employeeId && this.newPayslip.employeeName) {
      // Calculate totals
      const overtimePay = (this.newPayslip.overtimeHours || 0) * (this.newPayslip.overtimeRate || 0);
      const grossSalary = (this.newPayslip.baseSalary || 0) + overtimePay + (this.newPayslip.allowances || 0);
      const totalDeductions = (this.newPayslip.pfContribution || 0) + (this.newPayslip.professionalTax || 0) + 
                            (this.newPayslip.incomeTax || 0) + (this.newPayslip.otherDeductions || 0);
      const netSalary = grossSalary - totalDeductions;

      const payslip: PayslipDto = {
        id: Date.now().toString(),
        payslipNumber: this.newPayslip.payslipNumber || '',
        employeeId: this.newPayslip.employeeId || '',
        employeeName: this.newPayslip.employeeName || '',
        payPeriodStart: this.newPayslip.payPeriodStart || new Date(),
        payPeriodEnd: this.newPayslip.payPeriodEnd || new Date(),
        paymentDate: this.newPayslip.paymentDate || new Date(),
        baseSalary: this.newPayslip.baseSalary || 0,
        overtimeHours: this.newPayslip.overtimeHours || 0,
        overtimeRate: this.newPayslip.overtimeRate || 0,
        overtimePay: overtimePay,
        allowances: this.newPayslip.allowances || 0,
        grossSalary: grossSalary,
        pfContribution: this.newPayslip.pfContribution || 0,
        professionalTax: this.newPayslip.professionalTax || 0,
        incomeTax: this.newPayslip.incomeTax || 0,
        otherDeductions: this.newPayslip.otherDeductions || 0,
        totalDeductions: totalDeductions,
        netSalary: netSalary,
        paymentStatus: this.newPayslip.paymentStatus || 'Pending',
        notes: this.newPayslip.notes || ''
      };
      
      this.payslips.push(payslip);
      staticPayslips.push(payslip);
      this.showCreateForm = false;
      this.resetForm();
      console.log('Payslip created successfully:', payslip);
    }
  }

  updatePayslip(): void {
    console.log('Updating payslip:', this.newPayslip);
    if (this.selectedPayslip && this.newPayslip.employeeName) {
      // Recalculate totals
      const overtimePay = (this.newPayslip.overtimeHours || 0) * (this.newPayslip.overtimeRate || 0);
      const grossSalary = (this.newPayslip.baseSalary || 0) + overtimePay + (this.newPayslip.allowances || 0);
      const totalDeductions = (this.newPayslip.pfContribution || 0) + (this.newPayslip.professionalTax || 0) + 
                            (this.newPayslip.incomeTax || 0) + (this.newPayslip.otherDeductions || 0);
      const netSalary = grossSalary - totalDeductions;

      Object.assign(this.selectedPayslip, {
        ...this.newPayslip,
        overtimePay: overtimePay,
        grossSalary: grossSalary,
        totalDeductions: totalDeductions,
        netSalary: netSalary
      });
      
      // Update static data
      const staticPayslip = staticPayslips.find(p => p.id === this.selectedPayslip!.id);
      if (staticPayslip) {
        Object.assign(staticPayslip, {
          ...this.newPayslip,
          overtimePay: overtimePay,
          grossSalary: grossSalary,
          totalDeductions: totalDeductions,
          netSalary: netSalary
        });
      }
      
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Payslip updated successfully:', this.selectedPayslip);
    }
  }

  deletePayslip(payslipId: string): void {
    console.log('Deleting payslip:', payslipId);
    this.payslips = this.payslips.filter(p => p.id !== payslipId);
    staticPayslips = staticPayslips.filter(p => p.id !== payslipId);
    if (this.selectedPayslip?.id === payslipId) {
      this.selectedPayslip = null;
    }
    console.log('Payslip deleted successfully');
  }

  editPayslip(payslip: PayslipDto): void {
    console.log('Editing payslip:', payslip);
    this.selectedPayslip = payslip;
    this.newPayslip = { ...payslip };
    this.showUpdateForm = true;
  }

  generateMonthlyPayslips(): void {
    console.log('Generating monthly payslips...');
    // This would typically generate payslips for all active employees
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    const paymentDate = new Date(currentYear, currentMonth, 31);
    
    console.log(`Generating payslips for ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    // Implementation would loop through employees and create payslips
  }

  exportPayslips(): void {
    const headers = [
      'Payslip Number',
      'Employee Name',
      'Pay Period Start',
      'Pay Period End',
      'Payment Date',
      'Base Salary',
      'Overtime Hours',
      'Overtime Rate',
      'Overtime Pay',
      'Allowances',
      'Gross Salary',
      'PF Contribution',
      'Professional Tax',
      'Income Tax',
      'Other Deductions',
      'Total Deductions',
      'Net Salary',
      'Payment Status',
      'Notes'
    ];

    const columnMapping = {
      payslipNumber: 'Payslip Number',
      employeeName: 'Employee Name',
      payPeriodStart: 'Pay Period Start',
      payPeriodEnd: 'Pay Period End',
      paymentDate: 'Payment Date',
      baseSalary: 'Base Salary',
      overtimeHours: 'Overtime Hours',
      overtimeRate: 'Overtime Rate',
      overtimePay: 'Overtime Pay',
      allowances: 'Allowances',
      grossSalary: 'Gross Salary',
      pfContribution: 'PF Contribution',
      professionalTax: 'Professional Tax',
      incomeTax: 'Income Tax',
      otherDeductions: 'Other Deductions',
      totalDeductions: 'Total Deductions',
      netSalary: 'Net Salary',
      paymentStatus: 'Payment Status',
      notes: 'Notes'
    };

    const formattedData = this.csvExportService.formatDataForExport(this.payslips, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('payslips');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newPayslip = {
      payslipNumber: '',
      employeeId: '',
      employeeName: '',
      payPeriodStart: new Date(),
      payPeriodEnd: new Date(),
      paymentDate: new Date(),
      baseSalary: 0,
      overtimeHours: 0,
      overtimeRate: 0,
      overtimePay: 0,
      allowances: 0,
      grossSalary: 0,
      pfContribution: 0,
      professionalTax: 0,
      incomeTax: 0,
      otherDeductions: 0,
      totalDeductions: 0,
      netSalary: 0,
      paymentStatus: 'Pending',
      notes: ''
    };
  }
}
