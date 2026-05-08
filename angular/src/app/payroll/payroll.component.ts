import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payroll',
  standalone: false,
  template: `
    <div class="payroll-module">
      <!-- Module Header -->
      <div class="payroll-header">
        <div class="header-content">
          <h1 class="module-title">
            <i class="fas fa-users-cog me-3"></i>
            Personnel Affairs & HR Functions
          </h1>
          <p class="module-subtitle">Comprehensive employee and payroll management system</p>
        </div>
      </div>

      <!-- Navigation Strip -->
      <div class="nav-strip">
        <div class="nav-container">
          <a routerLink="employees" routerLinkActive="active" class="nav-item">
            <i class="fas fa-users me-2"></i>
            <span>Employees</span>
          </a>
          <a routerLink="all-employees" routerLinkActive="active" class="nav-item">
            <i class="fas fa-users-cog me-2"></i>
            <span>All Employees</span>
          </a>
          <a routerLink="inventory" routerLinkActive="active" class="nav-item">
            <i class="fas fa-boxes me-2"></i>
            <span>Inventory</span>
          </a>
          <a routerLink="payslips-new" routerLinkActive="active" class="nav-item">
            <i class="fas fa-file-invoice-dollar me-2"></i>
            <span>Payslips</span>
          </a>
          <a routerLink="attendance" routerLinkActive="active" class="nav-item">
            <i class="fas fa-clock me-2"></i>
            <span>Attendance</span>
          </a>
          <a routerLink="leave" routerLinkActive="active" class="nav-item">
            <i class="fas fa-calendar-alt me-2"></i>
            <span>Leave Management</span>
          </a>
          <a routerLink="payroll-management" routerLinkActive="active" class="nav-item">
            <i class="fas fa-money-check-alt me-2"></i>
            <span>Payroll Management</span>
          </a>
        </div>
      </div>

      <!-- Router Outlet -->
      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .payroll-module {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 0;
      transition: all 0.3s ease;
    }

    .payroll-header {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 2rem 0;
      margin-bottom: 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      text-align: center;
    }

    .module-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #ffffff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .module-subtitle {
      font-size: 1.1rem;
      color: #b8c6d9;
      margin: 0;
      font-weight: 400;
    }

    .nav-strip {
      background: #ffffff;
      padding: 1.5rem 0;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem 1rem;
      white-space: nowrap;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #495057;
      position: relative;
      overflow: hidden;
    }

    .nav-item:hover {
      color: #3498db;
      background: rgba(52, 152, 219, 0.1);
    }

    .nav-item.active {
      color: #3498db;
      background: rgba(52, 152, 219, 0.15);
      border-radius: 4px;
    }

    .content-area {
      padding: 2rem;
      background: #ffffff;
      min-height: calc(100vh - 200px);
    }
  `]
})
export class PayrollComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private resizeSubscription: Subscription | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkSidebarState();
    this.setupResizeListener();
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private checkSidebarState() {
    const sidebar = document.querySelector('.sidebar') || 
                  document.querySelector('[class*="sidebar"]') ||
                  document.querySelector('.navbar-toggler');
    
    if (sidebar) {
      const sidebarWidth = sidebar.getBoundingClientRect().width;
      this.isSidebarOpen = sidebarWidth > 100;
    }

    this.isSidebarOpen = document.body.classList.contains('sidebar-open');
  }

  private setupResizeListener() {
    this.resizeSubscription = new Subscription(() => {
      this.checkSidebarState();
    });

    window.addEventListener('resize', () => {
      this.checkSidebarState();
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.sidebar-toggler') || 
          target.closest('.navbar-toggler') ||
          target.closest('[class*="sidebar"]')) {
        setTimeout(() => this.checkSidebarState(), 100);
      }
    });
  }
}
