import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ManufacturingService, ProductionOrder } from '../../services/manufacturing.service';

@Component({
  selector: 'app-production-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './production-order-details.component.html',
  styleUrls: ['./production-order-details.component.css']
})
export class ProductionOrderDetailsComponent implements OnInit {

  productionOrder: ProductionOrder | null = null;
  activeTab = 'overview';
  isLoading = true;
  circumference = 2 * Math.PI * 50; // For progress circle SVG

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadProductionOrder(orderId);
    } else {
      this.router.navigate(['/manufacturing/production-orders']);
    }
  }

  loadProductionOrder(orderId: string): void {
    // Simulate loading - in real app, this would be an API call
    setTimeout(() => {
      // Static data for demo
      const staticOrders: ProductionOrder[] = [
        {
          id: '1',
          orderNumber: 'PO-001',
          productId: '1',
          productName: 'LG LED TV 55" OLED',
          quantity: 150,
          unit: 'units',
          status: 'in-progress',
          priority: 'high',
          startDate: '2024-01-15',
          expectedEndDate: '2024-01-20',
          actualEndDate: null,
          assignedTo: 'John Smith',
          materials: [
            { id: '1', materialId: 'MAT001', materialName: 'OLED Display Panel', requiredQuantity: 150, allocatedQuantity: 150, unit: 'pieces', cost: 800 },
            { id: '2', materialId: 'MAT002', materialName: 'Power Supply Unit', requiredQuantity: 150, allocatedQuantity: 150, unit: 'pieces', cost: 120 },
            { id: '3', materialId: 'MAT003', materialName: 'Housing Frame', requiredQuantity: 150, allocatedQuantity: 150, unit: 'pieces', cost: 65 }
          ],
          qualityChecks: [
            { id: '1', checkType: 'Display Quality Test', result: 'pass', checkedBy: 'QC Team', checkedDate: '2024-01-16', notes: 'All pixels functioning correctly' },
            { id: '2', checkType: 'Connectivity Test', result: 'pending', checkedBy: '', checkedDate: '', notes: 'WiFi and Bluetooth testing pending' }
          ],
          progress: 65,
          notes: 'Priority order for flagship OLED model',
          createdDate: '2024-01-15',
          updatedDate: '2024-01-16'
        },
        {
          id: '2',
          orderNumber: 'PO-002',
          productId: '2',
          productName: 'LG Washing Machine 12kg',
          quantity: 75,
          unit: 'units',
          status: 'pending',
          priority: 'medium',
          startDate: '2024-01-18',
          expectedEndDate: '2024-01-25',
          actualEndDate: null,
          assignedTo: 'Jane Doe',
          materials: [],
          qualityChecks: [],
          progress: 0,
          notes: 'Standard production run for front-load washer',
          createdDate: '2024-01-18',
          updatedDate: '2024-01-18'
        }
      ];

      this.productionOrder = staticOrders.find(order => order.id === orderId) || null;
      this.isLoading = false;

      if (!this.productionOrder) {
        this.router.navigate(['/manufacturing/production-orders']);
      }
    }, 500);
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Planned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-planned';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  editOrder(): void {
    if (this.productionOrder) {
      this.router.navigate(['/manufacturing/production-orders', this.productionOrder.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/manufacturing/production-orders']);
  }

  updateOrderStatus(newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled'): void {
    if (this.productionOrder) {
      this.productionOrder.status = newStatus;
      // In real app, this would be an API call
    }
  }
}
