import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-order-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-order-materials.component.html',
  styleUrls: ['./production-order-materials.component.css']
})
export class ProductionOrderMaterialsComponent implements OnInit {

  formData = {
    materials: [] as Array<{
      materialId: string;
      materialName: string;
      requiredQuantity: number;
      unit: string;
      cost: number;
    }>,
    bomId: ''
  };

  availableMaterials = [
    { id: 'MAT001', name: 'OLED Display Panel', unit: 'pieces', cost: 800 },
    { id: 'MAT002', name: 'Power Supply Unit', unit: 'pieces', cost: 120 },
    { id: 'MAT003', name: 'Housing Frame', unit: 'pieces', cost: 65 },
    { id: 'MAT004', name: 'Motherboard', unit: 'pieces', cost: 250 },
    { id: 'MAT005', name: 'Remote Control', unit: 'pieces', cost: 15 },
    { id: 'MAT006', name: 'Compressor Unit', unit: 'pieces', cost: 180 },
    { id: 'MAT007', name: 'Motor Assembly', unit: 'pieces', cost: 95 },
    { id: 'MAT008', name: 'Control Panel', unit: 'pieces', cost: 75 },
    { id: 'MAT009', name: 'Door Seal', unit: 'pieces', cost: 25 },
    { id: 'MAT010', name: 'Condenser Coil', unit: 'pieces', cost: 110 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load any existing data from session storage or service
    this.loadFormData();
  }

  loadFormData(): void {
    const savedData = sessionStorage.getItem('productionOrderData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.formData = { ...this.formData, ...data };
    }
  }

  saveFormData(): void {
    sessionStorage.setItem('productionOrderData', JSON.stringify(this.formData));
  }

  addMaterial(): void {
    this.formData.materials.push({
      materialId: '',
      materialName: '',
      requiredQuantity: 0,
      unit: '',
      cost: 0
    });
    this.saveFormData();
  }

  removeMaterial(index: number): void {
    this.formData.materials.splice(index, 1);
    this.saveFormData();
  }

  onMaterialChange(index: number, materialId: string): void {
    const material = this.availableMaterials.find(m => m.id === materialId);
    if (material) {
      this.formData.materials[index].materialName = material.name;
      this.formData.materials[index].unit = material.unit;
      this.formData.materials[index].cost = material.cost;
    }
    this.saveFormData();
  }

  goBack(): void {
    this.saveFormData();
    this.router.navigate(['/manufacturing/production-orders/create']);
  }

  goToNext(): void {
    this.saveFormData();
    this.router.navigate(['/manufacturing/production-orders/create/scheduling']);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      sessionStorage.removeItem('productionOrderData');
      this.router.navigate(['/manufacturing/production-orders']);
    }
  }

  getTotalCost(): number {
    return this.formData.materials.reduce((total, material) => {
      return total + (material.requiredQuantity * material.cost);
    }, 0);
  }
}
