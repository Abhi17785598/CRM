import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  standalone: false,
  styles: [`
    .container-fluid {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
      margin: 0;
    }

    .card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: none;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      position: relative;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s;
    }

    .card:hover::before {
      left: 100%;
    }

    .card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    }

    .card-body {
      padding: 2.5rem;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .card h2 {
      color: #2d3748;
      font-weight: 700;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .card p {
      color: #4a5568;
      font-weight: 500;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .btn {
      border-radius: 12px;
      font-weight: 600;
      padding: 0.875rem 2rem;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      border: none;
      position: relative;
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:hover::after {
      width: 300px;
      height: 300px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .btn-success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
    }

    .btn-success:hover {
      background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.6);
    }

    .btn-warning {
      background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
    }

    .btn-warning:hover {
      background: linear-gradient(135deg, #e0a800 0%, #e8690b 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 193, 7, 0.6);
    }

    .fa-shopping-cart {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .fa-truck {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .fa-file-invoice {
      background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h2 {
      color: #ffffff !important;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      font-weight: 800;
      margin-bottom: 1rem;
    }

    p {
      color: rgba(255, 255, 255, 0.9) !important;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .container-fluid {
        padding: 1rem;
      }
      
      .card-body {
        padding: 1.5rem;
      }
      
      .card h2 {
        font-size: 1.25rem;
      }
      
      .btn {
        padding: 0.75rem 1.5rem;
        font-size: 0.875rem;
      }
    }
  `],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-3">Purchase Management</h2>
          <p class="text-muted">Manage purchase orders and vendor relationships</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="fas fa-shopping-cart fa-4x mb-4"></i>
              <h2>Purchase Orders</h2>
              <p>Manage purchase orders</p>
              <button class="btn btn-primary btn-lg" (click)="navigateToOrders()">View Orders</button>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="fas fa-truck fa-4x mb-4"></i>
              <h2>Vendors</h2>
              <p>Manage vendors</p>
              <button class="btn btn-success btn-lg" (click)="navigateToVendors()">View Vendors</button>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="fas fa-file-invoice fa-4x mb-4"></i>
              <h2>Quotations</h2>
              <p>Manage quotations</p>
              <button class="btn btn-warning btn-lg" (click)="navigateToQuotations()">View Quotes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PurchaseComponent {
  constructor(private router: Router) {}

  navigateToOrders() {
    this.router.navigate(['/purchase/orders']);
  }

  navigateToVendors() {
    this.router.navigate(['/purchase/vendors']);
  }

  navigateToQuotations() {
    this.router.navigate(['/purchase/quotations']);
  }
}
