import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-order-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-order-review.component.html',
  styleUrls: ['./production-order-review.component.css']
})
export class ProductionOrderReviewComponent implements OnInit {

  formData: any = {};
  isSubmitting = false;
  confirmationChecked = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    const savedData = sessionStorage.getItem('productionOrderData');
    if (savedData) {
      this.formData = JSON.parse(savedData);
    } else {
      // No data found, redirect to first step
      this.router.navigate(['/manufacturing/production-orders/create']);
    }
  }

  submitOrder(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, this would be an API call to create the production order
        console.log('Creating production order:', this.formData);
        
        // Clear session data
        sessionStorage.removeItem('productionOrderData');
        
        // Show success message and redirect
        alert('Production order created successfully!');
        this.router.navigate(['/manufacturing/production-orders']);
      }, 1500);
    }
  }

  goBack(): void {
    this.router.navigate(['/manufacturing/production-orders/create/scheduling']);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      sessionStorage.removeItem('productionOrderData');
      this.router.navigate(['/manufacturing/production-orders']);
    }
  }

  isFormValid(): boolean {
    return this.formData.orderNumber && 
           this.formData.productName && 
           this.formData.quantity > 0 &&
           this.formData.startDate && 
           this.formData.expectedEndDate &&
           this.formData.estimatedHours > 0;
  }

  getTotalMaterialsCost(): number {
    if (this.formData.materials && Array.isArray(this.formData.materials)) {
      return this.formData.materials.reduce((total: number, material: any) => {
        return total + (material.requiredQuantity * material.cost);
      }, 0);
    }
    return 0;
  }

  getProductionDuration(): number {
    if (this.formData.startDate && this.formData.expectedEndDate) {
      const start = new Date(this.formData.startDate);
      const end = new Date(this.formData.expectedEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Planned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Planned';
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
}
