import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManufacturingService, ProductionOrder } from '../../services/manufacturing.service';

@Component({
  selector: 'app-production-order-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-order-edit.component.html',
  styleUrls: ['./production-order-edit.component.css']
})
export class ProductionOrderEditComponent implements OnInit {

  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;
  orderId: string | null = null;
  originalOrder: ProductionOrder | null = null;

  // Form data
  formData = {
    // Step 1: Basic Info
    orderNumber: '',
    productName: '',
    productCategory: '',
    quantity: 0,
    unit: 'units',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    assignedTo: '',
    
    // Step 2: Materials & BOM
    materials: [] as Array<{
      id: string;
      materialId: string;
      materialName: string;
      requiredQuantity: number;
      unit: string;
      cost: number;
    }>,
    bomId: '',
    
    // Step 3: Scheduling
    startDate: '',
    expectedEndDate: '',
    estimatedHours: 0,
    
    // Step 4: Review
    notes: '',
    specialInstructions: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'cancelled'
  };

  // Available options
  productCategories = [
    'Steel Beams',
    'Aluminum Sheets', 
    'Copper Pipes',
    'Stainless Steel Tanks',
    'Custom Fabrication'
  ];

  units = ['units', 'kg', 'meters', 'liters', 'sheets', 'tanks'];

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  statuses = [
    { value: 'pending', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  availableMaterials = [
    { id: 'MAT001', name: 'Steel Rods', unit: 'kg', cost: 0.50 },
    { id: 'MAT002', name: 'Aluminum Sheets', unit: 'sheets', cost: 25.00 },
    { id: 'MAT003', name: 'Copper Pipes', unit: 'meters', cost: 5.00 },
    { id: 'MAT004', name: 'Cutting Fluid', unit: 'liters', cost: 2.50 },
    { id: 'MAT005', name: 'Welding Rods', unit: 'kg', cost: 8.00 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manufacturingService: ManufacturingService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadProductionOrder(this.orderId);
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
          productName: 'Steel Beams',
          quantity: 500,
          unit: 'units',
          status: 'in-progress',
          priority: 'high',
          startDate: '2024-01-15',
          expectedEndDate: '2024-01-20',
          actualEndDate: null,
          assignedTo: 'John Smith',
          materials: [
            { id: '1', materialId: 'MAT001', materialName: 'Steel Rods', requiredQuantity: 1000, allocatedQuantity: 800, unit: 'kg', cost: 500 },
            { id: '2', materialId: 'MAT002', materialName: 'Cutting Fluid', requiredQuantity: 50, allocatedQuantity: 30, unit: 'liters', cost: 25 }
          ],
          qualityChecks: [
            { id: '1', checkType: 'Dimension Check', result: 'pass', checkedBy: 'QC Team', checkedDate: '2024-01-16', notes: 'All dimensions within tolerance' },
            { id: '2', checkType: 'Surface Finish', result: 'pending', checkedBy: '', checkedDate: '', notes: 'Pending inspection' }
          ],
          progress: 65,
          notes: 'Priority order for client A',
          createdDate: '2024-01-15',
          updatedDate: '2024-01-16'
        }
      ];

      this.originalOrder = staticOrders.find(order => order.id === orderId) || null;
      if (this.originalOrder) {
        this.populateFormData();
      } else {
        this.router.navigate(['/manufacturing/production-orders']);
      }
    }, 500);
  }

  populateFormData(): void {
    if (!this.originalOrder) return;

    this.formData.orderNumber = this.originalOrder.orderNumber;
    this.formData.productName = this.originalOrder.productName;
    this.formData.productCategory = 'Steel Beams'; // Default category
    this.formData.quantity = this.originalOrder.quantity;
    this.formData.unit = this.originalOrder.unit;
    this.formData.priority = this.originalOrder.priority;
    this.formData.assignedTo = this.originalOrder.assignedTo;
    this.formData.startDate = this.originalOrder.startDate;
    this.formData.expectedEndDate = this.originalOrder.expectedEndDate;
    this.formData.notes = this.originalOrder.notes;
    this.formData.status = this.originalOrder.status;
    this.formData.estimatedHours = 40; // Default estimate

    // Convert materials to edit format
    this.formData.materials = this.originalOrder.materials.map(mat => ({
      id: mat.id,
      materialId: mat.materialId,
      materialName: mat.materialName,
      requiredQuantity: mat.requiredQuantity,
      unit: mat.unit,
      cost: mat.cost
    }));
  }

  // Step navigation
  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  // Validation
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateBasicInfo();
      case 2:
        return this.validateMaterials();
      case 3:
        return this.validateScheduling();
      case 4:
        return true; // Review step doesn't need validation
      default:
        return false;
    }
  }

  validateBasicInfo(): boolean {
    return !!(this.formData.orderNumber && 
               this.formData.productName && 
               this.formData.productCategory &&
               this.formData.quantity > 0);
  }

  validateMaterials(): boolean {
    return this.formData.materials.length > 0;
  }

  validateScheduling(): boolean {
    return !!(this.formData.startDate && this.formData.expectedEndDate);
  }

  // Materials management
  addMaterial(): void {
    this.formData.materials.push({
      id: Date.now().toString(),
      materialId: '',
      materialName: '',
      requiredQuantity: 0,
      unit: 'units',
      cost: 0
    });
  }

  removeMaterial(index: number): void {
    this.formData.materials.splice(index, 1);
  }

  onMaterialChange(index: number, materialId: string): void {
    const material = this.availableMaterials.find(m => m.id === materialId);
    if (material) {
      this.formData.materials[index].materialName = material.name;
      this.formData.materials[index].unit = material.unit;
      this.formData.materials[index].cost = material.cost;
    }
  }

  // Form submission
  updateOrder(): void {
    if (!this.validateCurrentStep() || !this.originalOrder) {
      return;
    }

    this.isSubmitting = true;

    // Update production order object
    const updatedOrder: Partial<ProductionOrder> = {
      orderNumber: this.formData.orderNumber,
      productName: this.formData.productName,
      quantity: this.formData.quantity,
      unit: this.formData.unit,
      priority: this.formData.priority,
      assignedTo: this.formData.assignedTo || 'Unassigned',
      startDate: this.formData.startDate,
      expectedEndDate: this.formData.expectedEndDate,
      materials: this.formData.materials.map(m => ({
        id: m.id,
        materialId: m.materialId,
        materialName: m.materialName,
        requiredQuantity: m.requiredQuantity,
        allocatedQuantity: this.originalOrder?.materials.find(orig => orig.id === m.id)?.allocatedQuantity || 0,
        unit: m.unit,
        cost: m.cost
      })),
      qualityChecks: this.originalOrder.qualityChecks,
      progress: this.originalOrder.progress,
      notes: this.formData.notes,
      status: this.formData.status,
      createdDate: this.originalOrder.createdDate,
      updatedDate: new Date().toISOString()
    };

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/manufacturing/production-orders', this.orderId]);
    }, 1500);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.router.navigate(['/manufacturing/production-orders', this.orderId]);
    }
  }

  // Helper methods
  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Materials & BOM';
      case 3: return 'Scheduling';
      case 4: return 'Review & Update';
      default: return '';
    }
  }

  getStepIcon(step: number): string {
    switch (step) {
      case 1: return 'fas fa-info-circle';
      case 2: return 'fas fa-boxes';
      case 3: return 'fas fa-calendar-alt';
      case 4: return 'fas fa-edit';
      default: return '';
    }
  }

  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1: return this.validateBasicInfo();
      case 2: return this.validateMaterials();
      case 3: return this.validateScheduling();
      case 4: return false; // Review step is never "completed" until submission
      default: return false;
    }
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
}
