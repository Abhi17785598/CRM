import { Component, OnInit } from '@angular/core';
import { AccountingService, FinancialReport } from '../services/accounting.service';

@Component({
  selector: 'app-reports',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Financial Reports</h2>
              <p class="text-muted">Generate and view financial reports</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshReports()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showGenerateForm = true">
                <i class="fas fa-plus me-2"></i>Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Revenue</p>
                  <h4 class="mb-0 text-success">{{ formatCurrency(quickStats.totalRevenue) }}</h4>
                </div>
                <div class="text-success">
                  <i class="fas fa-arrow-up fa-2x"></i>
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
                  <p class="text-muted small mb-1">Total Expenses</p>
                  <h4 class="mb-0 text-danger">{{ formatCurrency(quickStats.totalExpenses) }}</h4>
                </div>
                <div class="text-danger">
                  <i class="fas fa-arrow-down fa-2x"></i>
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
                  <p class="text-muted small mb-1">Net Profit</p>
                  <h4 class="mb-0 text-primary">{{ formatCurrency(quickStats.netProfit) }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-chart-line fa-2x"></i>
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
                  <p class="text-muted small mb-1">Profit Margin</p>
                  <h4 class="mb-0 text-info">{{ quickStats.profitMargin }}%</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-percentage fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Types -->
      <div class="row mb-4">
        <div class="col-12">
          <h4 class="mb-3">Quick Reports</h4>
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="fas fa-balance-scale fa-3x text-primary mb-3"></i>
                  <h5>Balance Sheet</h5>
                  <p class="text-muted small">Assets, Liabilities & Equity</p>
                  <button class="btn btn-primary btn-sm" (click)="generateBalanceSheet()">Generate</button>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="fas fa-chart-line fa-3x text-success mb-3"></i>
                  <h5>Income Statement</h5>
                  <p class="text-muted small">Revenue & Expenses</p>
                  <button class="btn btn-success btn-sm" (click)="generateIncomeStatement()">Generate</button>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="fas fa-water fa-3x text-info mb-3"></i>
                  <h5>Cash Flow</h5>
                  <p class="text-muted small">Cash Movement</p>
                  <button class="btn btn-info btn-sm" (click)="generateCashFlow()">Generate</button>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <i class="fas fa-list-alt fa-3x text-warning mb-3"></i>
                  <h5>Trial Balance</h5>
                  <p class="text-muted small">Account Balances</p>
                  <button class="btn btn-warning btn-sm" (click)="generateTrialBalance()">Generate</button>
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
                  <label class="form-label">Report Type</label>
                  <select class="form-select" [(ngModel)]="selectedType" (change)="filterReports()">
                    <option value="">All Types</option>
                    <option value="balance-sheet">Balance Sheet</option>
                    <option value="income-statement">Income Statement</option>
                    <option value="cash-flow">Cash Flow</option>
                    <option value="trial-balance">Trial Balance</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Period</label>
                  <select class="form-select" [(ngModel)]="selectedPeriod" (change)="filterReports()">
                    <option value="">All Periods</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Range</label>
                  <select class="form-select" [(ngModel)]="dateRange" (change)="filterReports()">
                    <option value="">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search reports..." 
                         [(ngModel)]="searchTerm" (input)="filterReports()">
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
        <p class="mt-2">Loading reports...</p>
      </div>

      <!-- Reports Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Period</th>
                <th>Generated Date</th>
                <th>Generated By</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let report of filteredReports">
                <td>
                  <div class="d-flex align-items-center">
                    <i class="fas fa-file-pdf text-danger me-2"></i>
                    <strong>{{ report.title }}</strong>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light text-dark">{{ getReportTypeLabel(report.reportType) }}</span>
                </td>
                <td>{{ report.period }}</td>
                <td>{{ report.generatedDate | date:'shortDate' }}</td>
                <td>{{ report.generatedBy }}</td>
                <td>{{ getFileSize() }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewReport(report)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="downloadReport(report)">
                      <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-outline-info" (click)="emailReport(report)">
                      <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn btn-outline-danger" (click)="deleteReport(report)">
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
      <div *ngIf="!loading && filteredReports.length === 0" class="text-center py-5">
        <i class="fas fa-chart-pie fa-3x text-muted mb-3"></i>
        <h4>No reports found</h4>
        <p class="text-muted">Generate your first financial report to get started.</p>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <div *ngIf="showGenerateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Generate Financial Report</h5>
            <button type="button" class="btn-close" (click)="showGenerateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Report Type</label>
                  <select class="form-select" [(ngModel)]="newReport.reportType" name="reportType">
                    <option value="">Select Report Type</option>
                    <option value="balance-sheet">Balance Sheet</option>
                    <option value="income-statement">Income Statement</option>
                    <option value="cash-flow">Cash Flow Statement</option>
                    <option value="trial-balance">Trial Balance</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Period</label>
                  <select class="form-select" [(ngModel)]="newReport.period" name="period">
                    <option value="">Select Period</option>
                    <option value="January 2024">January 2024</option>
                    <option value="February 2024">February 2024</option>
                    <option value="March 2024">March 2024</option>
                    <option value="Q1 2024">Q1 2024</option>
                    <option value="2024">Year 2024</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newReport.startDate" name="startDate">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">End Date</label>
                  <input type="date" class="form-control" [(ngModel)]="newReport.endDate" name="endDate">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Format</label>
                  <select class="form-select" [(ngModel)]="newReport.format" name="format">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Include Charts</label>
                  <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="newReport.includeCharts" name="includeCharts">
                    <label class="form-check-label">Include visual charts and graphs</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="newReport.description" name="description" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showGenerateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="generateReport()">
              <i class="fas fa-cog me-2"></i>Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      z-index: 1050;
    }
    .modal.show {
      display: block !important;
    }
  `]
})
export class ReportsComponent implements OnInit {
  reports: FinancialReport[] = [];
  filteredReports: FinancialReport[] = [];
  loading = false;
  showGenerateForm = false;

  selectedType = '';
  selectedPeriod = '';
  dateRange = '';
  searchTerm = '';

  newReport: any = {
    reportType: '',
    period: '',
    startDate: '',
    endDate: '',
    format: 'pdf',
    includeCharts: true,
    description: ''
  };

  quickStats = {
    totalRevenue: 2850000,
    totalExpenses: 1850000,
    netProfit: 1000000,
    profitMargin: 35.1
  };

  constructor(private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.reports = [
        {
          id: '1',
          reportType: 'balance-sheet',
          title: 'Balance Sheet - January 2024',
          period: 'January 2024',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          data: {},
          generatedDate: '2024-02-01',
          generatedBy: 'Admin'
        },
        {
          id: '2',
          reportType: 'income-statement',
          title: 'Income Statement - Q1 2024',
          period: 'Q1 2024',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          data: {},
          generatedDate: '2024-04-01',
          generatedBy: 'Manager'
        },
        {
          id: '3',
          reportType: 'cash-flow',
          title: 'Cash Flow Statement - January 2024',
          period: 'January 2024',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          data: {},
          generatedDate: '2024-02-01',
          generatedBy: 'Admin'
        },
        {
          id: '4',
          reportType: 'trial-balance',
          title: 'Trial Balance - January 2024',
          period: 'January 2024',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          data: {},
          generatedDate: '2024-02-01',
          generatedBy: 'Accountant'
        },
        {
          id: '5',
          reportType: 'balance-sheet',
          title: 'Balance Sheet - February 2024',
          period: 'February 2024',
          startDate: '2024-02-01',
          endDate: '2024-02-29',
          data: {},
          generatedDate: '2024-03-01',
          generatedBy: 'Admin'
        },
        {
          id: '6',
          reportType: 'income-statement',
          title: 'Income Statement - February 2024',
          period: 'February 2024',
          startDate: '2024-02-01',
          endDate: '2024-02-29',
          data: {},
          generatedDate: '2024-03-01',
          generatedBy: 'Manager'
        },
        {
          id: '7',
          reportType: 'cash-flow',
          title: 'Cash Flow Statement - February 2024',
          period: 'February 2024',
          startDate: '2024-02-01',
          endDate: '2024-02-29',
          data: {},
          generatedDate: '2024-03-01',
          generatedBy: 'Admin'
        },
        {
          id: '8',
          reportType: 'trial-balance',
          title: 'Trial Balance - February 2024',
          period: 'February 2024',
          startDate: '2024-02-01',
          endDate: '2024-02-29',
          data: {},
          generatedDate: '2024-03-01',
          generatedBy: 'Accountant'
        },
        {
          id: '9',
          reportType: 'balance-sheet',
          title: 'Balance Sheet - March 2024',
          period: 'March 2024',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          data: {},
          generatedDate: '2024-04-01',
          generatedBy: 'Admin'
        },
        {
          id: '10',
          reportType: 'income-statement',
          title: 'Income Statement - March 2024',
          period: 'March 2024',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          data: {},
          generatedDate: '2024-04-01',
          generatedBy: 'Manager'
        },
        {
          id: '11',
          reportType: 'cash-flow',
          title: 'Cash Flow Statement - March 2024',
          period: 'March 2024',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          data: {},
          generatedDate: '2024-04-01',
          generatedBy: 'Admin'
        },
        {
          id: '12',
          reportType: 'trial-balance',
          title: 'Trial Balance - March 2024',
          period: 'March 2024',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          data: {},
          generatedDate: '2024-04-01',
          generatedBy: 'Accountant'
        },
        {
          id: '13',
          reportType: 'income-statement',
          title: 'Income Statement - Annual 2023',
          period: 'Annual 2023',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          data: {},
          generatedDate: '2024-01-15',
          generatedBy: 'CFO'
        },
        {
          id: '14',
          reportType: 'balance-sheet',
          title: 'Balance Sheet - Annual 2023',
          period: 'Annual 2023',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          data: {},
          generatedDate: '2024-01-15',
          generatedBy: 'CFO'
        },
        {
          id: '15',
          reportType: 'cash-flow',
          title: 'Cash Flow Statement - Annual 2023',
          period: 'Annual 2023',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          data: {},
          generatedDate: '2024-01-15',
          generatedBy: 'CFO'
        }
      ];
      this.filteredReports = this.reports;
      this.loading = false;
    }, 1000);
  }

  filterReports() {
    this.filteredReports = this.reports.filter(report => {
      const typeMatch = !this.selectedType || report.reportType === this.selectedType;
      const periodMatch = !this.selectedPeriod || report.period.toLowerCase().includes(this.selectedPeriod.toLowerCase());
      const searchMatch = !this.searchTerm || 
        report.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let dateMatch = true;
      if (this.dateRange) {
        const days = parseInt(this.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        dateMatch = new Date(report.generatedDate) >= cutoffDate;
      }
      
      return typeMatch && periodMatch && searchMatch && dateMatch;
    });
  }

  refreshReports() {
    this.loadReports();
  }

  generateBalanceSheet() {
    this.newReport.reportType = 'balance-sheet';
    this.newReport.period = 'Current Month';
    this.showGenerateForm = true;
  }

  generateIncomeStatement() {
    this.newReport.reportType = 'income-statement';
    this.newReport.period = 'Current Month';
    this.showGenerateForm = true;
  }

  generateCashFlow() {
    this.newReport.reportType = 'cash-flow';
    this.newReport.period = 'Current Month';
    this.showGenerateForm = true;
  }

  generateTrialBalance() {
    this.newReport.reportType = 'trial-balance';
    this.newReport.period = 'Current Month';
    this.showGenerateForm = true;
  }

  generateReport() {
    const reportTypeLabels: { [key: string]: string } = {
      'balance-sheet': 'Balance Sheet',
      'income-statement': 'Income Statement',
      'cash-flow': 'Cash Flow Statement',
      'trial-balance': 'Trial Balance'
    };

    const report: FinancialReport = {
      id: Date.now().toString(),
      reportType: this.newReport.reportType,
      title: `${reportTypeLabels[this.newReport.reportType]} - ${this.newReport.period}`,
      period: this.newReport.period,
      startDate: this.newReport.startDate,
      endDate: this.newReport.endDate,
      data: {},
      generatedDate: new Date().toISOString(),
      generatedBy: 'Admin'
    };

    this.reports.unshift(report);
    this.filteredReports = this.reports;
    this.showGenerateForm = false;
    
    // Reset form
    this.newReport = {
      reportType: '',
      period: '',
      startDate: '',
      endDate: '',
      format: 'pdf',
      includeCharts: true,
      description: ''
    };

    alert(`Report "${report.title}" generated successfully!`);
  }

  viewReport(report: FinancialReport) {
    alert(`Viewing report: ${report.title}\nType: ${this.getReportTypeLabel(report.reportType)}\nPeriod: ${report.period}\nGenerated: ${new Date(report.generatedDate).toLocaleDateString()}\nGenerated By: ${report.generatedBy}`);
  }

  downloadReport(report: FinancialReport) {
    alert(`Downloading report: ${report.title} (PDF)`);
  }

  emailReport(report: FinancialReport) {
    alert(`Emailing report: ${report.title}\nReport will be sent to your registered email address.`);
  }

  deleteReport(report: FinancialReport) {
    if (confirm(`Are you sure you want to delete report "${report.title}"?`)) {
      const index = this.reports.findIndex(r => r.id === report.id);
      if (index > -1) {
        this.reports.splice(index, 1);
        this.filteredReports = this.reports;
        alert(`Report "${report.title}" deleted successfully!`);
      }
    }
  }

  getReportTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'balance-sheet': 'Balance Sheet',
      'income-statement': 'Income Statement',
      'cash-flow': 'Cash Flow',
      'trial-balance': 'Trial Balance'
    };
    return labels[type] || type;
  }

  getFileSize(): string {
    // Random file size for demo
    const sizes = ['125 KB', '245 KB', '380 KB', '520 KB', '1.2 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
