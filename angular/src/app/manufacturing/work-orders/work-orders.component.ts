import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticWorkOrders: any[] = [
  {
    id: '1',
    workOrderNumber: 'WO-2024-001',
    title: 'TV Assembly Line Maintenance',
    description: 'Monthly scheduled maintenance for LED TV assembly line',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'John Smith',
    estimatedHours: 4,
    actualHours: 0,
    scheduledDate: new Date('2024-01-15'),
    completionDate: null,
    materials: 'Display Panel Connectors, Power Supply Modules',
    tools: 'Assembly Tools, Testing Equipment',
    notes: 'Critical for TV production line uptime'
  },
  {
    id: '2',
    workOrderNumber: 'WO-2024-002',
    title: 'Washing Machine Calibration',
    description: 'Weekly quality inspection and calibration of washing machine assembly equipment',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Sarah Johnson',
    estimatedHours: 2,
    actualHours: 1.5,
    scheduledDate: new Date('2024-01-10'),
    completionDate: null,
    materials: 'Calibration Weights, Test Load Samples',
    tools: 'Torque Wrenches, Balance Testers',
    notes: 'Quality assurance for drum balance and motor calibration'
  },
  {
    id: '3',
    workOrderNumber: 'WO-2024-003',
    title: 'Refrigerator Compressor Replacement',
    description: 'Urgent repair of refrigerator compressor assembly station',
    priority: 'Critical',
    status: 'Completed',
    assignedTo: 'Mike Brown',
    estimatedHours: 3,
    actualHours: 2.5,
    scheduledDate: new Date('2024-01-08'),
    completionDate: new Date('2024-01-09'),
    materials: 'Compressor Units, Refrigerant Gas, Seals',
    tools: 'Recovery Equipment, Vacuum Pumps',
    notes: 'Assembly station back online, refrigerator production resumed'
  },
  {
    id: '4',
    workOrderNumber: 'WO-2024-004',
    title: 'AC Production Line Setup',
    description: 'Installation and setup of air conditioner assembly line',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'Emily Davis',
    estimatedHours: 2,
    actualHours: 0,
    scheduledDate: new Date('2024-01-20'),
    completionDate: null,
    materials: 'Assembly Line Components, Wiring Harnesses',
    tools: 'Power Tools, Testing Equipment',
    notes: 'New production line for summer season demand'
  }
];

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.css']
})
export class WorkOrdersComponent implements OnInit {
  workOrders: any[] = [];
  selectedWorkOrder: any | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newWorkOrder: Partial<any> = {
    workOrderNumber: '',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: '',
    estimatedHours: 0,
    actualHours: 0,
    scheduledDate: new Date(),
    completionDate: null,
    materials: '',
    tools: '',
    notes: ''
  };

  constructor(private csvExportService: CsvExportService, private router: Router) { }

  ngOnInit(): void {
    // Load static data
    this.workOrders = [...staticWorkOrders];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-planned';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  selectWorkOrder(workOrder: any): void {
    console.log('Selecting work order:', workOrder);
    this.selectedWorkOrder = workOrder;
  }

  createWorkOrder(): void {
    console.log('Creating work order:', this.newWorkOrder);
    if (this.newWorkOrder.workOrderNumber && this.newWorkOrder.title && this.newWorkOrder.assignedTo) {
      const workOrder = {
        id: Date.now().toString(),
        workOrderNumber: this.newWorkOrder.workOrderNumber || '',
        title: this.newWorkOrder.title || '',
        description: this.newWorkOrder.description || '',
        priority: this.newWorkOrder.priority || 'Medium',
        status: this.newWorkOrder.status || 'Pending',
        assignedTo: this.newWorkOrder.assignedTo || '',
        estimatedHours: this.newWorkOrder.estimatedHours || 0,
        actualHours: 0,
        scheduledDate: this.newWorkOrder.scheduledDate || new Date(),
        completionDate: null,
        materials: this.newWorkOrder.materials || '',
        tools: this.newWorkOrder.tools || '',
        notes: this.newWorkOrder.notes || ''
      };
      
      this.workOrders.push(workOrder);
      staticWorkOrders.push(workOrder);
      this.showCreateForm = false;
      this.resetForm();
      console.log('Work order created successfully:', workOrder);
    }
  }

  updateWorkOrder(): void {
    console.log('Updating work order:', this.newWorkOrder);
    if (this.selectedWorkOrder && this.newWorkOrder.title && this.newWorkOrder.assignedTo) {
      Object.assign(this.selectedWorkOrder, this.newWorkOrder);
      
      // Update static data
      const staticWorkOrder = staticWorkOrders.find(wo => wo.id === this.selectedWorkOrder!.id);
      if (staticWorkOrder) {
        Object.assign(staticWorkOrder, this.newWorkOrder);
      }
      
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Work order updated successfully:', this.selectedWorkOrder);
    }
  }

  deleteWorkOrder(workOrderId: string): void {
    console.log('Deleting work order:', workOrderId);
    this.workOrders = this.workOrders.filter(wo => wo.id !== workOrderId);
    staticWorkOrders = staticWorkOrders.filter(wo => wo.id !== workOrderId);
    if (this.selectedWorkOrder?.id === workOrderId) {
      this.selectedWorkOrder = null;
    }
    console.log('Work order deleted successfully');
  }

  editWorkOrder(workOrder: any): void {
    console.log('Editing work order:', workOrder);
    this.selectedWorkOrder = workOrder;
    this.newWorkOrder = { ...workOrder };
    this.showUpdateForm = true;
  }

  startWorkOrder(workOrderId: string): void {
    console.log('Starting work order:', workOrderId);
    const workOrder = this.workOrders.find(wo => wo.id === workOrderId);
    const staticWorkOrder = staticWorkOrders.find(wo => wo.id === workOrderId);
    
    if (workOrder && staticWorkOrder) {
      workOrder.status = 'In Progress';
      staticWorkOrder.status = 'In Progress';
      console.log('Work order started:', workOrder);
    }
  }

  completeWorkOrder(workOrderId: string): void {
    console.log('Completing work order:', workOrderId);
    const workOrder = this.workOrders.find(wo => wo.id === workOrderId);
    const staticWorkOrder = staticWorkOrders.find(wo => wo.id === workOrderId);
    
    if (workOrder && staticWorkOrder) {
      workOrder.status = 'Completed';
      workOrder.completionDate = new Date();
      staticWorkOrder.status = 'Completed';
      staticWorkOrder.completionDate = new Date();
      console.log('Work order completed:', workOrder);
    }
  }

  exportWorkOrders(): void {
    const headers = [
      'Work Order Number',
      'Title',
      'Description',
      'Priority',
      'Status',
      'Assigned To',
      'Estimated Hours',
      'Actual Hours',
      'Scheduled Date',
      'Completion Date',
      'Materials',
      'Tools',
      'Notes'
    ];

    const columnMapping = {
      workOrderNumber: 'Work Order Number',
      title: 'Title',
      description: 'Description',
      priority: 'Priority',
      status: 'Status',
      assignedTo: 'Assigned To',
      estimatedHours: 'Estimated Hours',
      actualHours: 'Actual Hours',
      scheduledDate: 'Scheduled Date',
      completionDate: 'Completion Date',
      materials: 'Materials',
      tools: 'Tools',
      notes: 'Notes'
    };

    const formattedData = this.csvExportService.formatDataForExport(this.workOrders, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('work_orders');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newWorkOrder = {
      workOrderNumber: '',
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Pending',
      assignedTo: '',
      estimatedHours: 0,
      actualHours: 0,
      scheduledDate: new Date(),
      completionDate: null,
      materials: '',
      tools: '',
      notes: ''
    };
  }

  clearFilters(): void {
    // Clear filter logic - for now just reload data
    this.workOrders = [...staticWorkOrders];
  }

  createWorkOrderNavigation(): void {
    console.log('Create Work Order button clicked');
    console.log('Navigating to:', '/manufacturing/production-orders/create');
    this.router.navigate(['/manufacturing/production-orders/create']);
  }
}
