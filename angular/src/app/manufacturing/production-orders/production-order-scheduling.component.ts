import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-order-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-order-scheduling.component.html',
  styleUrls: ['./production-order-scheduling.component.css']
})
export class ProductionOrderSchedulingComponent implements OnInit {

  formData = {
    startDate: '',
    expectedEndDate: '',
    estimatedHours: 0
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadFormData();
    this.setDefaultDates();
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

  setDefaultDates(): void {
    if (!this.formData.startDate) {
      const today = new Date();
      this.formData.startDate = today.toISOString().split('T')[0];
    }
    
    if (!this.formData.expectedEndDate) {
      const startDate = new Date(this.formData.startDate);
      startDate.setDate(startDate.getDate() + 7); // Default 7 days later
      this.formData.expectedEndDate = startDate.toISOString().split('T')[0];
    }
  }

  onStartDateChange(): void {
    if (this.formData.startDate) {
      const startDate = new Date(this.formData.startDate);
      const currentEndDate = new Date(this.formData.expectedEndDate);
      
      // If end date is before start date, update it
      if (currentEndDate < startDate) {
        startDate.setDate(startDate.getDate() + 7);
        this.formData.expectedEndDate = startDate.toISOString().split('T')[0];
      }
    }
    this.saveFormData();
  }

  calculateEstimatedDays(): number {
    if (this.formData.startDate && this.formData.expectedEndDate) {
      const start = new Date(this.formData.startDate);
      const end = new Date(this.formData.expectedEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  goBack(): void {
    this.saveFormData();
    this.router.navigate(['/manufacturing/production-orders/create/materials']);
  }

  goToNext(): void {
    this.saveFormData();
    this.router.navigate(['/manufacturing/production-orders/create/review']);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      sessionStorage.removeItem('productionOrderData');
      this.router.navigate(['/manufacturing/production-orders']);
    }
  }

  isFormValid(): boolean {
    return this.formData.startDate && this.formData.expectedEndDate && this.formData.estimatedHours > 0;
  }
}
