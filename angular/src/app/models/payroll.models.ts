export interface EmployeeDto {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  hireDate: Date;
  department: string;
  position: string;
  baseSalary: number;
  bankAccountNumber: string;
  bankName: string;
  panNumber: string;
  isActive: boolean;
  terminationDate?: Date;
  terminationReason?: string;
  fullName: string;
  yearsOfService: number;
}

export interface PayslipDto {
  id: string;
  payslipNumber: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  paymentDate: Date;
  baseSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  allowances: number;
  grossSalary: number;
  pfContribution: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: string;
  notes?: string;
}

export interface CreateEmployeeDto {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  hireDate: Date;
  department: string;
  position: string;
  baseSalary: number;
  bankAccountNumber: string;
  bankName: string;
  panNumber: string;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  baseSalary: number;
  bankAccountNumber: string;
  bankName: string;
  panNumber: string;
}

export interface CreatePayslipDto {
  payslipNumber: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  paymentDate: Date;
  baseSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  allowances: number;
}

export interface UpdatePayslipDto {
  payPeriodStart: Date;
  payPeriodEnd: Date;
  paymentDate: Date;
  baseSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  allowances: number;
  notes?: string;
}

export interface ProcessPayslipDto {
  pfRate: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
}

export interface GenerateMonthlyPayslipsDto {
  year: number;
  month: number;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  paymentDate: Date;
}
