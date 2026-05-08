import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeDto } from '../../models/payroll.models';
import { CsvExportService } from '../../services/csv-export.service';
import { HrmsService, Employee } from '../../services/hrms.service';

// Static data that persists across component instances
let staticEmployees: EmployeeDto[] = [
  {
    id: '1',
    employeeCode: 'EMP-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0101',
    address: '123 Main Street',
    dateOfBirth: new Date('1985-05-15'),
    hireDate: new Date('2022-01-15'),
    department: 'Production',
    position: 'Production Manager',
    baseSalary: 75000,
    bankAccountNumber: '123456789',
    bankName: 'First National Bank',
    panNumber: 'TX123456789',
    isActive: true,
    fullName: 'John Smith',
    yearsOfService: 2
  },
  {
    id: '2',
    employeeCode: 'EMP-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0201',
    address: '456 Oak Avenue',
    dateOfBirth: new Date('1990-08-22'),
    hireDate: new Date('2021-06-10'),
    department: 'HR',
    position: 'HR Specialist',
    baseSalary: 55000,
    bankAccountNumber: '987654321',
    bankName: 'City Bank',
    panNumber: 'TX987654321',
    isActive: true,
    fullName: 'Sarah Johnson',
    yearsOfService: 2.5
  },
  {
    id: '3',
    employeeCode: 'EMP-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '+1-555-0301',
    address: '789 Pine Street',
    dateOfBirth: new Date('1988-03-10'),
    hireDate: new Date('2020-03-20'),
    department: 'Finance',
    position: 'Financial Analyst',
    baseSalary: 65000,
    bankAccountNumber: '456789123',
    bankName: 'Trust Bank',
    panNumber: 'TX456789123',
    isActive: true,
    fullName: 'Michael Brown',
    yearsOfService: 3.8
  },
  {
    id: '4',
    employeeCode: 'EMP-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1-555-0401',
    address: '321 Elm Street',
    dateOfBirth: new Date('1982-11-30'),
    hireDate: new Date('2019-09-01'),
    department: 'Management',
    position: 'Operations Director',
    baseSalary: 95000,
    bankAccountNumber: '789123456',
    bankName: 'Commerce Bank',
    panNumber: 'TX789123456',
    isActive: true,
    fullName: 'Emily Davis',
    yearsOfService: 4.3
  }
];

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeDto[] = [];
  selectedEmployee: EmployeeDto | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  loading = false;
  newEmployee: Partial<EmployeeDto> = {
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

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;

  constructor(private csvExportService: CsvExportService, private hrmsService: HrmsService) { }

  ngOnInit(): void {
    console.log('🔄 Component initializing...');
    // Force clear any static data first
    this.employees = [];
    this.loadEmployees();
  }

  forceLoadStatic(): void {
    console.log('🔧 Forcing static data load...');
    this.employees = [...staticEmployees];
    console.log('📋 Static data loaded:', this.employees);
  }

  loadEmployees(): void {
    this.loading = true;
    console.log('🔄 Starting to load employees from API...');
    
    // Force bypass of complex logic - directly call API and handle response
    this.hrmsService.getEmployees().subscribe({
      next: (response: any) => {
        console.log('📥 Raw API response:', response);
        console.log('📥 Response type:', typeof response);
        console.log('📥 Response structure:', JSON.stringify(response, null, 2));
        
        // Try multiple ways to extract employee data
        let employeeData = [];
        
        if (Array.isArray(response)) {
          employeeData = response;
          console.log('📥 Response is direct array');
        } else if (response && response.items && Array.isArray(response.items)) {
          employeeData = response.items;
          console.log('📥 Response has items array, length:', response.items.length);
        } else if (response && response.data && Array.isArray(response.data)) {
          employeeData = response.data;
          console.log('📥 Response has data array, length:', response.data.length);
        } else if (response && typeof response === 'object') {
          // Try to find any array property
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              employeeData = response[key];
              console.log(`📥 Found array in property '${key}':`, response[key].length);
              break;
            }
          }
        }
        
        console.log('📥 Final employee data extracted:', employeeData);
        console.log('📥 Number of employees:', employeeData.length);
        
        if (employeeData.length === 0) {
          console.warn('⚠️ No employees received! Response structure:', response);
          console.warn('⚠️ Available properties:', Object.keys(response));
          console.warn('⚠️ Response as JSON:', JSON.stringify(response, null, 2));
          console.warn('⚠️ Falling back to static data...');
          this.employees = [...staticEmployees];
        } else {
          // Map API response to EmployeeDto format
          this.employees = employeeData.map((emp: any) => {
            const mappedEmp = {
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
            };
            return mappedEmp;
          });
          
          // Calculate pagination
          this.totalPages = Math.ceil(employeeData.length / this.pageSize);
        }
        
        this.loading = false;
        console.log('✅ Final mapped employees:', this.employees);
      },
      error: (error) => {
        console.error('❌ Error loading employees:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        this.loading = false;
        console.log('🔄 API failed - keeping current employees');
      }
    });
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadEmployees();
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
    return isActive ? 'badge-success' : 'badge-secondary';
  }

  selectEmployee(employee: EmployeeDto): void {
    console.log('Selecting employee:', employee);
    this.selectedEmployee = employee;
  }

  createEmployee(): void {
    console.log('Creating employee:', this.newEmployee);
    if (this.newEmployee.employeeCode && this.newEmployee.firstName && this.newEmployee.lastName && this.newEmployee.email) {
      const employeeData = {
        employeeCode: this.newEmployee.employeeCode,
        firstName: this.newEmployee.firstName,
        lastName: this.newEmployee.lastName,
        email: this.newEmployee.email,
        phone: this.newEmployee.phone,
        address: this.newEmployee.address,
        dateOfBirth: this.newEmployee.dateOfBirth?.toISOString(),
        hireDate: this.newEmployee.hireDate?.toISOString(),
        department: this.newEmployee.department,
        position: this.newEmployee.position,
        baseSalary: this.newEmployee.baseSalary,
        bankAccountNumber: this.newEmployee.bankAccountNumber,
        bankName: this.newEmployee.bankName,
        panNumber: this.newEmployee.panNumber
      };

      this.hrmsService.createEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee created successfully:', response);
          this.showCreateForm = false;
          this.resetForm();
          this.loadEmployees(); // Reload the list
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          // Fallback to static creation if API fails
          this.createEmployeeStatic();
        }
      });
    }
  }

  createEmployeeStatic(): void {
    const employee: EmployeeDto = {
      id: Date.now().toString(),
      employeeCode: this.newEmployee.employeeCode || '',
      firstName: this.newEmployee.firstName || '',
      lastName: this.newEmployee.lastName || '',
      email: this.newEmployee.email || '',
      phone: this.newEmployee.phone || '',
      address: this.newEmployee.address || '',
      dateOfBirth: this.newEmployee.dateOfBirth || new Date(),
      hireDate: this.newEmployee.hireDate || new Date(),
      department: this.newEmployee.department || '',
      position: this.newEmployee.position || '',
      baseSalary: this.newEmployee.baseSalary || 0,
      bankAccountNumber: this.newEmployee.bankAccountNumber || '',
      bankName: this.newEmployee.bankName || '',
      panNumber: this.newEmployee.panNumber || '',
      isActive: true,
      fullName: `${this.newEmployee.firstName} ${this.newEmployee.lastName}`,
      yearsOfService: 0
    };
    
    this.employees.push(employee);
    staticEmployees.push(employee);
    this.showCreateForm = false;
    this.resetForm();
    console.log('Employee created successfully (static):', employee);
  }

  updateEmployee(): void {
    console.log('Updating employee:', this.newEmployee);
    if (this.selectedEmployee && this.newEmployee.firstName && this.newEmployee.lastName && this.newEmployee.email) {
      const employeeData = {
        firstName: this.newEmployee.firstName,
        lastName: this.newEmployee.lastName,
        email: this.newEmployee.email,
        phone: this.newEmployee.phone,
        address: this.newEmployee.address,
        department: this.newEmployee.department,
        position: this.newEmployee.position,
        baseSalary: this.newEmployee.baseSalary
      };

      this.hrmsService.updateEmployee(this.selectedEmployee.id, employeeData).subscribe({
        next: (response) => {
          console.log('Employee updated successfully:', response);
          this.showUpdateForm = false;
          this.resetForm();
          this.loadEmployees(); // Reload the list
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          // Fallback to static update if API fails
          this.updateEmployeeStatic();
        }
      });
    }
  }

  updateEmployeeStatic(): void {
    Object.assign(this.selectedEmployee, this.newEmployee);
    
    // Update static data
    const staticEmployee = staticEmployees.find(e => e.id === this.selectedEmployee!.id);
    if (staticEmployee) {
      Object.assign(staticEmployee, this.newEmployee);
    }
    
    // Update calculated fields
    this.selectedEmployee!.fullName = `${this.selectedEmployee!.firstName} ${this.selectedEmployee!.lastName}`;
    const hireDate = this.selectedEmployee!.hireDate;
    if (hireDate) {
      const now = new Date();
      const yearsDiff = now.getTime() - hireDate.getTime();
      this.selectedEmployee!.yearsOfService = Math.floor(yearsDiff / (1000 * 60 * 60 * 24 * 365.25));
    }
    
    this.showUpdateForm = false;
    this.resetForm();
    console.log('Employee updated successfully (static):', this.selectedEmployee);
  }

  deleteEmployee(employeeId: string): void {
    console.log('Deleting employee:', employeeId);
    this.hrmsService.deleteEmployee(employeeId).subscribe({
      next: (response) => {
        console.log('Employee deleted successfully:', response);
        this.loadEmployees(); // Reload the list
        if (this.selectedEmployee?.id === employeeId) {
          this.selectedEmployee = null;
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        // Fallback to static deletion if API fails
        this.deleteEmployeeStatic(employeeId);
      }
    });
  }

  deleteEmployeeStatic(employeeId: string): void {
    this.employees = this.employees.filter(e => e.id !== employeeId);
    staticEmployees = staticEmployees.filter(e => e.id !== employeeId);
    if (this.selectedEmployee?.id === employeeId) {
      this.selectedEmployee = null;
    }
    console.log('Employee deleted successfully (static)');
  }

  editEmployee(employee: EmployeeDto): void {
    console.log('Editing employee:', employee);
    this.selectedEmployee = employee;
    this.newEmployee = { ...employee };
    this.showUpdateForm = true;
  }

  exportEmployees(): void {
    const headers = [
      'Employee Code',
      'First Name',
      'Last Name',
      'Full Name',
      'Email',
      'Phone',
      'Address',
      'Date of Birth',
      'Hire Date',
      'Department',
      'Position',
      'Base Salary',
      'Bank Account Number',
      'Bank Name',
      'PAN Number',
      'Status',
      'Years of Service'
    ];

    const dataWithStatus = this.employees.map(employee => ({
      ...employee,
      statusText: this.getStatusText(employee.isActive)
    }));

    const columnMapping = {
      employeeCode: 'Employee Code',
      firstName: 'First Name',
      lastName: 'Last Name',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      dateOfBirth: 'Date of Birth',
      hireDate: 'Hire Date',
      department: 'Department',
      position: 'Position',
      baseSalary: 'Base Salary',
      bankAccountNumber: 'Bank Account Number',
      bankName: 'Bank Name',
      panNumber: 'PAN Number',
      statusText: 'Status',
      yearsOfService: 'Years of Service'
    };

    const formattedData = this.csvExportService.formatDataForExport(dataWithStatus, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('employees');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newEmployee = {
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
  }
}
