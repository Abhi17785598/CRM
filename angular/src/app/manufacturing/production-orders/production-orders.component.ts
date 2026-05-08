import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ManufacturingService, ProductionOrder } from '../../services/manufacturing.service';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticProductionOrders: ProductionOrder[] = [
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
    materials: [],
    qualityChecks: [],
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
  },
  {
    id: '3',
    orderNumber: 'PO-003',
    productId: '3',
    productName: 'LG Refrigerator 700L',
    quantity: 200,
    unit: 'units',
    status: 'completed',
    priority: 'low',
    startDate: '2024-01-10',
    expectedEndDate: '2024-01-16',
    actualEndDate: '2024-01-15',
    assignedTo: 'Bob Johnson',
    materials: [],
    qualityChecks: [],
    progress: 100,
    notes: 'Completed ahead of schedule - large capacity model',
    createdDate: '2024-01-10',
    updatedDate: '2024-01-15'
  },
  {
    id: '4',
    orderNumber: 'PO-004',
    productId: '4',
    productName: 'LG Air Conditioner 2 Ton',
    quantity: 120,
    unit: 'units',
    status: 'pending',
    priority: 'urgent',
    startDate: '2024-01-22',
    expectedEndDate: '2024-01-28',
    actualEndDate: null,
    assignedTo: 'Alice Brown',
    materials: [],
    qualityChecks: [],
    progress: 0,
    notes: 'Urgent order for summer season',
    createdDate: '2024-01-22',
    updatedDate: '2024-01-22'
  }
];

@Component({
  selector: 'app-production-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './production-orders.component.html',
  styleUrls: ['./production-orders.component.css']
})
export class ProductionOrdersComponent implements OnInit {

  productionOrders: ProductionOrder[] = [];
  filteredOrders: ProductionOrder[] = [];
  selectedOrders: string[] = [];

  // Filter properties
  filterOrderNumber = '';
  filterProduct = '';
  filterStatus = '';
  filterDateFrom = '';
  filterDateTo = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private router: Router,
    private csvExportService: CsvExportService
  ) {}

  ngOnInit(): void {
    this.productionOrders = [...staticProductionOrders];
    this.applyFilters();
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

  applyFilters(): void {
    this.filteredOrders = this.productionOrders.filter(order => {
      const matchesOrderNumber = !this.filterOrderNumber || 
        order.orderNumber.toLowerCase().includes(this.filterOrderNumber.toLowerCase());
      const matchesProduct = !this.filterProduct || 
        order.productName.toLowerCase().includes(this.filterProduct.toLowerCase());
      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;
      const matchesDateFrom = !this.filterDateFrom || 
        new Date(order.startDate) >= new Date(this.filterDateFrom);
      const matchesDateTo = !this.filterDateTo || 
        new Date(order.expectedEndDate) <= new Date(this.filterDateTo);

      return matchesOrderNumber && matchesProduct && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }

  clearFilters(): void {
    this.filterOrderNumber = '';
    this.filterProduct = '';
    this.filterStatus = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.applyFilters();
  }

  viewOrder(orderId: string): void {
    console.log('View Order button clicked for ID:', orderId);
    console.log('Navigating to:', `/manufacturing/production-orders/${orderId}`);
    this.router.navigate(['/manufacturing/production-orders', orderId]);
  }

  editOrder(orderId: string): void {
    console.log('Edit Order button clicked for ID:', orderId);
    console.log('Navigating to:', `/manufacturing/production-orders/${orderId}/edit`);
    this.router.navigate(['/manufacturing/production-orders', orderId, 'edit']);
  }

  createOrder(): void {
    console.log('Create Production Order button clicked');
    console.log('Navigating to:', '/manufacturing/production-orders/create');
    this.router.navigate(['/manufacturing/production-orders/create']);
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this production order?')) {
      this.productionOrders = this.productionOrders.filter(o => o.id !== orderId);
      staticProductionOrders = staticProductionOrders.filter(o => o.id !== orderId);
      this.applyFilters();
    }
  }

  toggleOrderSelection(orderId: string): void {
    const index = this.selectedOrders.indexOf(orderId);
    if (index > -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(orderId);
    }
  }

  selectAllOrders(event: any): void {
    if (event.target.checked) {
      this.selectedOrders = this.filteredOrders.map(order => order.id);
    } else {
      this.selectedOrders = [];
    }
  }

  exportProductionOrders(): void {
    const headers = [
      'Order Number',
      'Product Name',
      'Quantity',
      'Start Date',
      'Expected End Date',
      'Actual End Date',
      'Status',
      'Progress',
      'Assigned To',
      'Notes'
    ];

    const dataWithStatus = this.filteredOrders.map(order => ({
      ...order,
      statusText: this.getStatusText(order.status)
    }));

    const columnMapping = {
      orderNumber: 'Order Number',
      productName: 'Product Name',
      quantity: 'Quantity',
      startDate: 'Start Date',
      expectedEndDate: 'Expected End Date',
      actualEndDate: 'Actual End Date',
      statusText: 'Status',
      progress: 'Progress',
      assignedTo: 'Assigned To',
      notes: 'Notes'
    };

    const formattedData = this.csvExportService.formatDataForExport(dataWithStatus, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('production_orders');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  get paginatedOrders(): ProductionOrder[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  updateOrderStatus(orderId: string, newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled'): void {
    const order = this.productionOrders.find(o => o.id === orderId);
    const staticOrder = staticProductionOrders.find(o => o.id === orderId);

    if (!order || !staticOrder) return;

    order.status = newStatus;
    staticOrder.status = newStatus;

    if (newStatus === 'in-progress' && !order.actualEndDate) {
      order.progress = 25;
      staticOrder.progress = 25;
    }

    if (newStatus === 'completed') {
      order.actualEndDate = new Date().toISOString();
      staticOrder.actualEndDate = new Date().toISOString();
      order.progress = 100;
      staticOrder.progress = 100;
    }

    this.applyFilters();
  }
}
