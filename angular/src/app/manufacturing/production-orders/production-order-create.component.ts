import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ManufacturingService, ProductionOrder } from '../../services/manufacturing.service';

@Component({
  selector: 'app-production-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-order-create.component.html',
  styleUrls: ['./production-order-create.component.css']
})
export class ProductionOrderCreateComponent implements OnInit {

  currentStep = 1;
  totalSteps = 4;
  isSubmitting = false;

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
    specialInstructions: ''
  };

  // Available options
  productCategories = [
    'LED TVs',
    'OLED TVs', 
    'Washing Machines',
    'Refrigerators',
    'Air Conditioners',
    'Microwave Ovens',
    'Dishwashers',
    'Sound Systems'
  ];

  units = ['units', 'pieces', 'sets', 'kits'];

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  availableMaterials = [
    { id: 'MAT001', name: 'OLED Display Panel', unit: 'pieces', cost: 800.00 },
    { id: 'MAT002', name: 'Power Supply Unit', unit: 'pieces', cost: 120.00 },
    { id: 'MAT003', name: 'Housing Frame', unit: 'pieces', cost: 65.00 },
    { id: 'MAT004', name: 'Motherboard', unit: 'pieces', cost: 250.00 },
    { id: 'MAT005', name: 'Remote Control', unit: 'pieces', cost: 15.00 },
    { id: 'MAT006', name: 'Compressor Unit', unit: 'pieces', cost: 180.00 },
    { id: 'MAT007', name: 'Motor Assembly', unit: 'pieces', cost: 95.00 },
    { id: 'MAT008', name: 'Control Panel', unit: 'pieces', cost: 75.00 }
  ];

  constructor(
    private router: Router,
    private manufacturingService: ManufacturingService
  ) {}

  ngOnInit(): void {
    this.generateOrderNumber();
    this.setDefaultDates();
    this.loadFormData();
  }

  generateOrderNumber(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.formData.orderNumber = `PO-${year}${month}-${random}`;
  }

  setDefaultDates(): void {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    this.formData.startDate = today.toISOString().split('T')[0];
    this.formData.expectedEndDate = nextWeek.toISOString().split('T')[0];
  }

  // Step navigation
  nextStep(): void {
    console.log('Next button clicked');
    console.log('Current form data:', this.formData);
    console.log('Validation result:', this.validateCurrentStep());
    
    if (this.validateCurrentStep()) {
      console.log('Validation passed, moving to next step');
      // Save current data to session storage
      this.saveFormData();
      
      // Increment current step
      this.currentStep++;
    } else {
      console.log('Validation failed');
      alert('Please fill in all required fields: Order Number, Product Name, and Quantity');
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  saveFormData(): void {
    sessionStorage.setItem('productionOrderData', JSON.stringify(this.formData));
  }

  loadFormData(): void {
    const savedData = sessionStorage.getItem('productionOrderData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.formData = { ...this.formData, ...data };
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
  submitOrder(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    this.isSubmitting = true;

    // Create production order object
    const productionOrder: Partial<ProductionOrder> = {
      orderNumber: this.formData.orderNumber,
      productName: this.formData.productName,
      quantity: this.formData.quantity,
      unit: this.formData.unit,
      priority: this.formData.priority,
      assignedTo: this.formData.assignedTo || 'Unassigned',
      startDate: this.formData.startDate,
      expectedEndDate: this.formData.expectedEndDate,
      materials: this.formData.materials.map(m => ({
        id: Date.now().toString() + Math.random(),
        materialId: m.materialId,
        materialName: m.materialName,
        requiredQuantity: m.requiredQuantity,
        allocatedQuantity: 0,
        unit: m.unit,
        cost: m.cost
      })),
      qualityChecks: [],
      progress: 0,
      notes: this.formData.notes,
      status: 'pending',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/manufacturing/production-orders']);
    }, 1500);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      this.router.navigate(['/manufacturing/production-orders']);
    }
  }

  // Helper methods
  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Materials & BOM';
      case 3: return 'Scheduling';
      case 4: return 'Review & Confirm';
      default: return '';
    }
  }

  getStepIcon(step: number): string {
    switch (step) {
      case 1: return 'fas fa-info-circle';
      case 2: return 'fas fa-boxes';
      case 3: return 'fas fa-calendar-alt';
      case 4: return 'fas fa-check-circle';
      default: return '';
    }
  }

  isStepCompleted(step: number): boolean {
    // A step is completed only if it's BEFORE the current step
    return step < this.currentStep;
  }
}
