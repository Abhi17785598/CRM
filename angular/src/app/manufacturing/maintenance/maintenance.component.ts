import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticMaintenanceTasks: any[] = [
  {
    id: '1',
    taskNumber: 'MT-2024-001',
    title: 'Monthly Preventive Maintenance - Line 1',
    description: 'Complete inspection and servicing of steel fabrication line',
    priority: 'High',
    status: 'Scheduled',
    assignedTo: 'John Smith',
    scheduledDate: new Date('2024-01-15'),
    estimatedDuration: 8,
    actualDuration: 0,
    completionDate: null,
    equipment: 'Steel Fabrication Line 1',
    parts: 'Filters, Lubricants, Wear Parts, Safety Gear',
    tools: 'Diagnostic Tools, Cleaning Equipment, Welding Machine',
    cost: 2500,
    notes: 'Critical for production uptime, schedule during off-hours'
  },
  {
    id: '2',
    taskNumber: 'MT-2024-002',
    title: 'Calibration of Quality Control Equipment',
    description: 'Annual calibration and certification of all quality measurement devices',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Sarah Johnson',
    scheduledDate: new Date('2024-01-10'),
    estimatedDuration: 4,
    actualDuration: 2,
    completionDate: null,
    equipment: 'Measurement Devices, Calibration Tools',
    parts: 'Calibration Standards, Certification Labels, Documentation',
    tools: 'Precision Tools, Testing Equipment',
    cost: 800,
    notes: 'Annual compliance requirement'
  },
  {
    id: '3',
    taskNumber: 'MT-2024-003',
    title: 'Emergency Repair - Packaging Machine',
    description: 'Urgent repair of malfunctioning packaging equipment',
    priority: 'Critical',
    status: 'Completed',
    assignedTo: 'Mike Brown',
    scheduledDate: new Date('2024-01-08'),
    estimatedDuration: 6,
    actualDuration: 4,
    completionDate: new Date('2024-01-09'),
    equipment: 'Packaging Machine B-2',
    parts: 'Motor Replacement, Conveyor Belt, Control Panel',
    tools: 'Repair Tools, Diagnostic Equipment, Welding Kit',
    cost: 3200,
    notes: 'Machine back online, production resumed'
  },
  {
    id: '4',
    taskNumber: 'MT-2024-004',
    title: 'Facility Safety Inspection',
    description: 'Quarterly safety inspection and compliance audit of entire facility',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'Emily Davis',
    scheduledDate: new Date('2024-01-20'),
    estimatedDuration: 16,
    actualDuration: 0,
    completionDate: null,
    equipment: 'Safety Equipment, Inspection Forms, Documentation',
    parts: 'Safety Checklists, Compliance Forms, Inspection Tags',
    tools: 'Safety Equipment, Measurement Tools',
    cost: 1200,
    notes: 'Required for OSHA compliance and insurance'
  }
];

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  maintenanceTasks: any[] = [];
  selectedTask: any | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newTask: Partial<any> = {
    taskNumber: '',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Scheduled',
    assignedTo: '',
    scheduledDate: new Date(),
    estimatedDuration: 0,
    actualDuration: 0,
    completionDate: null,
    equipment: '',
    parts: '',
    tools: '',
    cost: 0,
    notes: ''
  };

  constructor(private csvExportService: CsvExportService) { }

  ngOnInit(): void {
    // Load static data
    this.maintenanceTasks = [...staticMaintenanceTasks];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Scheduled': return 'badge-warning';
      case 'In Progress': return 'badge-primary';
      case 'Completed': return 'badge-success';
      case 'Cancelled': return 'badge-danger';
      case 'On Hold': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'text-danger fw-bold';
      case 'High': return 'text-warning fw-bold';
      case 'Medium': return 'text-info fw-bold';
      case 'Low': return 'text-secondary';
      default: return 'text-secondary';
    }
  }

  selectTask(task: any): void {
    console.log('Selecting maintenance task:', task);
    this.selectedTask = task;
  }

  createTask(): void {
    console.log('Creating maintenance task:', this.newTask);
    if (this.newTask.taskNumber && this.newTask.title && this.newTask.assignedTo) {
      const task = {
        id: Date.now().toString(),
        taskNumber: this.newTask.taskNumber || '',
        title: this.newTask.title || '',
        description: this.newTask.description || '',
        priority: this.newTask.priority || 'Medium',
        status: this.newTask.status || 'Scheduled',
        assignedTo: this.newTask.assignedTo || '',
        scheduledDate: this.newTask.scheduledDate || new Date(),
        estimatedDuration: this.newTask.estimatedDuration || 0,
        actualDuration: 0,
        completionDate: null,
        equipment: this.newTask.equipment || '',
        parts: this.newTask.parts || '',
        tools: this.newTask.tools || '',
        cost: this.newTask.cost || 0,
        notes: this.newTask.notes || ''
      };
      
      this.maintenanceTasks.push(task);
      staticMaintenanceTasks.push(task);
      this.showCreateForm = false;
      this.resetForm();
      console.log('Maintenance task created successfully:', task);
    }
  }

  updateTask(): void {
    console.log('Updating maintenance task:', this.newTask);
    if (this.selectedTask && this.newTask.title && this.newTask.assignedTo) {
      Object.assign(this.selectedTask, this.newTask);
      
      // Update static data
      const staticTask = staticMaintenanceTasks.find(mt => mt.id === this.selectedTask!.id);
      if (staticTask) {
        Object.assign(staticTask, this.newTask);
      }
      
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Maintenance task updated successfully:', this.selectedTask);
    }
  }

  deleteTask(taskId: string): void {
    console.log('Deleting maintenance task:', taskId);
    this.maintenanceTasks = this.maintenanceTasks.filter(mt => mt.id !== taskId);
    staticMaintenanceTasks = staticMaintenanceTasks.filter(mt => mt.id !== taskId);
    if (this.selectedTask?.id === taskId) {
      this.selectedTask = null;
    }
    console.log('Maintenance task deleted successfully');
  }

  editTask(task: any): void {
    console.log('Editing maintenance task:', task);
    this.selectedTask = task;
    this.newTask = { ...task };
    this.showUpdateForm = true;
  }

  startTask(taskId: string): void {
    console.log('Starting maintenance task:', taskId);
    const task = this.maintenanceTasks.find(mt => mt.id === taskId);
    const staticTask = staticMaintenanceTasks.find(mt => mt.id === taskId);
    
    if (task && staticTask) {
      task.status = 'In Progress';
      staticTask.status = 'In Progress';
      console.log('Maintenance task started:', task);
    }
  }

  completeTask(taskId: string): void {
    console.log('Completing maintenance task:', taskId);
    const task = this.maintenanceTasks.find(mt => mt.id === taskId);
    const staticTask = staticMaintenanceTasks.find(mt => mt.id === taskId);
    
    if (task && staticTask) {
      task.status = 'Completed';
      task.completionDate = new Date();
      staticTask.status = 'Completed';
      staticTask.completionDate = new Date();
      console.log('Maintenance task completed:', task);
    }
  }

  exportMaintenanceTasks(): void {
    const headers = [
      'Task Number',
      'Title',
      'Description',
      'Priority',
      'Status',
      'Assigned To',
      'Scheduled Date',
      'Estimated Duration',
      'Actual Duration',
      'Completion Date',
      'Equipment',
      'Parts',
      'Tools',
      'Cost',
      'Notes'
    ];

    const columnMapping = {
      taskNumber: 'Task Number',
      title: 'Title',
      description: 'Description',
      priority: 'Priority',
      status: 'Status',
      assignedTo: 'Assigned To',
      scheduledDate: 'Scheduled Date',
      estimatedDuration: 'Estimated Duration',
      actualDuration: 'Actual Duration',
      completionDate: 'Completion Date',
      equipment: 'Equipment',
      parts: 'Parts',
      tools: 'Tools',
      cost: 'Cost',
      notes: 'Notes'
    };

    const formattedData = this.csvExportService.formatDataForExport(this.maintenanceTasks, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('maintenance_tasks');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newTask = {
      taskNumber: '',
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Scheduled',
      assignedTo: '',
      scheduledDate: new Date(),
      estimatedDuration: 0,
      actualDuration: 0,
      completionDate: null,
      equipment: '',
      parts: '',
      tools: '',
      cost: 0,
      notes: ''
    };
  }
}
