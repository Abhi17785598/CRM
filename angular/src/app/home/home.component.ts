import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../services/order.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Dashboard metrics
  totalRevenue = 2847500;
  totalOrders = 0;
  totalEmployees = 156;
  totalCustomers = 89;
  productionEfficiency = 92;
  inventoryTurnover = 4.2;
  qualityRate = 98.5;
  onTimeDelivery = 94.2;

  // Recent activities
  recentOrders: Order[] = [];
  isLoadingOrders = false;

  recentProduction = [
    { line: 'Line 1', product: 'Steel Beams', efficiency: 95, status: 'Running', output: '1,247 units' },
    { line: 'Line 2', product: 'Aluminum Sheets', efficiency: 88, status: 'Setup', output: '0 units' },
    { line: 'Line 3', product: 'Copper Pipes', efficiency: 97, status: 'Running', output: '856 units' },
    { line: 'Line 4', product: 'Stainless Steel Tanks', efficiency: 0, status: 'Down', output: '0 units' }
  ];

  recentAlerts = [
    { type: 'Critical', message: 'Line 4 is down - Production halted', time: '30 minutes ago', icon: 'exclamation-triangle' },
    { type: 'Warning', message: 'Quality check failed for Batch #1234', time: '2 hours ago', icon: 'exclamation-circle' },
    { type: 'Info', message: 'Monthly maintenance scheduled for Line 2', time: '1 day ago', icon: 'info-circle' }
  ];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // Initialize dashboard data
    this.loadRecentOrders();
  }

  loadRecentOrders(): void {
    this.isLoadingOrders = true;
    this.orderService.getOrders(0, 5).subscribe({
      next: (response) => {
        if (response && response.items) {
          this.recentOrders = response.items.map(order => ({
            id: order.orderId,
            customer: order.customerName,
            amount: order.amount,
            status: order.status,
            time: this.formatTime(order.creationTime)
          }));
          // Update total orders count
          this.totalOrders = response.totalCount;
        } else if (response && Array.isArray(response)) {
          this.recentOrders = response.map(order => ({
            id: order.orderId,
            customer: order.customerName,
            amount: order.amount,
            status: order.status,
            time: this.formatTime(order.creationTime)
          }));
          // Update total orders count
          this.totalOrders = response.length;
        } else {
          // Fallback to static data
          this.recentOrders = [
            { id: 'PO-001', customer: 'Tech Solutions Inc.', amount: 45000, status: 'Completed', time: '2 hours ago' },
            { id: 'PO-002', customer: 'Manufacturing Co.', amount: 28000, status: 'In Progress', time: '1 day ago' },
            { id: 'PO-003', customer: 'Retail Store LLC', amount: 15000, status: 'Pending', time: '3 days ago' }
          ];
          this.totalOrders = this.recentOrders.length;
        }
        this.isLoadingOrders = false;
        console.log('✅ Recent orders loaded:', this.recentOrders.length);
        console.log('📊 Total orders count updated:', this.totalOrders);
      },
      error: (error) => {
        console.error('❌ Error loading recent orders:', error);
        this.isLoadingOrders = false;
        // Fallback to static data
        this.recentOrders = [
          { id: 'PO-001', customer: 'Tech Solutions Inc.', amount: 45000, status: 'Completed', time: '2 hours ago' },
          { id: 'PO-002', customer: 'Manufacturing Co.', amount: 28000, status: 'In Progress', time: '1 day ago' },
          { id: 'PO-003', customer: 'Retail Store LLC', amount: 15000, status: 'Pending', time: '3 days ago' }
        ];
        this.totalOrders = this.recentOrders.length;
      }
    });
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 95) return 'text-success fw-bold';
    if (efficiency >= 85) return 'text-info fw-bold';
    if (efficiency >= 70) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  getLineStatusClass(status: string): string {
    switch (status) {
      case 'Running': return 'text-success';
      case 'Setup': return 'text-warning';
      case 'Down': return 'text-danger';
      default: return 'text-secondary';
    }
  }

  getRevenueClass(): string {
    return 'text-primary fw-bold';
  }

  getOrdersClass(): string {
    return 'text-info fw-bold';
  }

  getCustomersClass(): string {
    return 'text-success fw-bold';
  }

  getEmployeesClass(): string {
    return 'text-warning fw-bold';
  }

  getAlertClass(type: string): string {
    switch (type) {
      case 'Critical': return 'text-danger';
      case 'Warning': return 'text-warning';
      case 'Info': return 'text-info';
      default: return 'text-secondary';
    }
  }
}
