import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentAccountId?: string;
  parentAccountName?: string;
  description: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  date: string;
  description: string;
  reference?: string;
  journalEntries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  createdBy: string;
  approvedBy?: string;
  createdDate: string;
  postedDate?: string;
}

export interface JournalEntry {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentTerms: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalAmount: number;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'bank-transfer' | 'credit-card' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference?: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  vendorId: string;
  vendorName: string;
  expenseDate: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  receipt?: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface FinancialReport {
  id: string;
  reportType: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'trial-balance';
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  data: any;
  generatedDate: string;
  generatedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private baseUrl = 'api/accounting';

  constructor(private http: HttpClient) {}

  // Chart of Accounts
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${id}`);
  }

  createAccount(account: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/accounts`, account);
  }

  updateAccount(id: string, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/accounts/${id}`, account);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/accounts/${id}`);
  }

  getAccountsByType(type: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts/type/${type}`);
  }

  // Journal Entries
  getTransactions(startDate?: string, endDate?: string): Observable<Transaction[]> {
    let params = '';
    if (startDate) params += `?startDate=${startDate}`;
    if (endDate) params += `${params ? '&' : '?'}endDate=${endDate}`;
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions${params}`);
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/transactions/${id}`);
  }

  createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction);
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}`, transaction);
  }

  postTransaction(id: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions/${id}/post`, {});
  }

  reverseTransaction(id: string, reason: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions/${id}/reverse`, { reason });
  }

  // Invoicing
  getInvoices(customerId?: string, status?: string): Observable<Invoice[]> {
    let params = '';
    if (customerId) params += `?customerId=${customerId}`;
    if (status) params += `${params ? '&' : '?'}status=${status}`;
    return this.http.get<Invoice[]>(`${this.baseUrl}/invoices${params}`);
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/invoices/${id}`);
  }

  createInvoice(invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/invoices`, invoice);
  }

  updateInvoice(id: string, invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/invoices/${id}`, invoice);
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/invoices/${id}`);
  }

  sendInvoice(id: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/invoices/${id}/send`, {});
  }

  // Payments
  getPayments(customerId?: string, status?: string): Observable<Payment[]> {
    let params = '';
    if (customerId) params += `?customerId=${customerId}`;
    if (status) params += `${params ? '&' : '?'}status=${status}`;
    return this.http.get<Payment[]>(`${this.baseUrl}/payments${params}`);
  }

  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/${id}`);
  }

  createPayment(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/payments`, payment);
  }

  updatePayment(id: string, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.baseUrl}/payments/${id}`, payment);
  }

  // Expenses
  getExpenses(category?: string, status?: string): Observable<Expense[]> {
    let params = '';
    if (category) params += `?category=${category}`;
    if (status) params += `${params ? '&' : '?'}status=${status}`;
    return this.http.get<Expense[]>(`${this.baseUrl}/expenses${params}`);
  }

  getExpense(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/expenses/${id}`);
  }

  createExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/expenses`, expense);
  }

  updateExpense(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/expenses/${id}`, expense);
  }

  approveExpense(id: string): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/expenses/${id}/approve`, {});
  }

  // Financial Reports
  generateBalanceSheet(startDate: string, endDate: string): Observable<FinancialReport> {
    return this.http.post<FinancialReport>(`${this.baseUrl}/reports/balance-sheet`, { startDate, endDate });
  }

  generateIncomeStatement(startDate: string, endDate: string): Observable<FinancialReport> {
    return this.http.post<FinancialReport>(`${this.baseUrl}/reports/income-statement`, { startDate, endDate });
  }

  generateCashFlow(startDate: string, endDate: string): Observable<FinancialReport> {
    return this.http.post<FinancialReport>(`${this.baseUrl}/reports/cash-flow`, { startDate, endDate });
  }

  generateTrialBalance(startDate: string, endDate: string): Observable<FinancialReport> {
    return this.http.post<FinancialReport>(`${this.baseUrl}/reports/trial-balance`, { startDate, endDate });
  }

  getReports(reportType?: string): Observable<FinancialReport[]> {
    const url = reportType ? `${this.baseUrl}/reports?type=${reportType}` : `${this.baseUrl}/reports`;
    return this.http.get<FinancialReport[]>(url);
  }

  // Analytics
  getFinancialOverview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/overview`);
  }

  getRevenueAnalysis(startDate?: string, endDate?: string): Observable<any> {
    let params = '';
    if (startDate) params += `?startDate=${startDate}`;
    if (endDate) params += `${params ? '&' : '?'}endDate=${endDate}`;
    return this.http.get<any>(`${this.baseUrl}/analytics/revenue${params}`);
  }

  getExpenseAnalysis(startDate?: string, endDate?: string): Observable<any> {
    let params = '';
    if (startDate) params += `?startDate=${startDate}`;
    if (endDate) params += `${params ? '&' : '?'}endDate=${endDate}`;
    return this.http.get<any>(`${this.baseUrl}/analytics/expenses${params}`);
  }
}
