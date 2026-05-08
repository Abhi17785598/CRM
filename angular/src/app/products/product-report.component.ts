import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-report',
  standalone: false,
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit {
  product: any = null;
  loading = false;
  error = '';
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loading = true;
      this.error = '';
      
      this.productService.getProduct(productId).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.error = error.message || 'Failed to load product details';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Product ID not found';
    }
  }

  get stockStatus(): string {
    if (!this.product) return '';
    return this.product.currentStock <= this.product.minimumStock ? 'Low Stock' : 'In Stock';
  }

  get stockStatusClass(): string {
    if (!this.product) return '';
    if (this.product.currentStock <= this.product.minimumStock) return 'text-danger';
    if (this.product.currentStock <= this.product.minimumStock * 1.5) return 'text-warning';
    return 'text-success';
  }

  get stockPercentage(): number {
    if (!this.product) return 0;
    const maxStock = this.product.maximumStock || this.product.minimumStock * 2;
    return Math.round((this.product.currentStock / maxStock) * 100);
  }

  get totalValue(): number {
    if (!this.product) return 0;
    return this.product.currentStock * this.product.sellingPrice;
  }

  get profitMargin(): number {
    if (!this.product) return 0;
    return Math.round(((this.product.sellingPrice - this.product.costPrice) / this.product.sellingPrice) * 100);
  }

  get recommendations(): any[] {
    if (!this.product) return [];
    
    const recs = [];
    
    if (this.product.currentStock <= this.product.minimumStock) {
      recs.push({
        type: 'alert-warning',
        icon: 'fa-exclamation-triangle',
        title: 'Low Stock Alert',
        message: `Current stock (${this.product.currentStock}) is at or below minimum level. Consider reordering soon.`
      });
    }
    
    if (this.product.currentStock > this.product.maximumStock * 0.9) {
      recs.push({
        type: 'alert-info',
        icon: 'fa-info-circle',
        title: 'High Stock Level',
        message: `Stock is approaching maximum capacity. Monitor to avoid overstocking.`
      });
    }
    
    if (this.profitMargin < 20) {
      recs.push({
        type: 'alert-danger',
        icon: 'fa-chart-line',
        title: 'Low Profit Margin',
        message: `Current profit margin is ${this.profitMargin}%. Consider reviewing pricing strategy.`
      });
    }
    
    return recs;
  }

  calculateTurnover(): number {
    // Simple estimation - in real implementation, this would use historical data
    if (!this.product) return 0;
    return Math.round(365 / (this.product.currentStock / 10)); // Assuming 10 units sold per month
  }

  generateReportId(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  getProductStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      case 'discontinued': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getProductImage(productName: string): string {
    if (!productName) return 'https://via.placeholder.com/400x300?text=No+Image';
    
    const name = productName.toLowerCase();
    
    if (name.includes('tv') || name.includes('television')) {
      return 'https://images.unsplash.com/photo-1598424180693-2fd444e4481f?w=400&h=300&fit=crop';
    } else if (name.includes('laptop') || name.includes('computer')) {
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';
    } else if (name.includes('phone') || name.includes('mobile')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop';
    } else if (name.includes('washing') || name.includes('laundry')) {
      return 'https://images.unsplash.com/photo-1584464491033-06638f0b03ea?w=400&h=300&fit=crop';
    } else if (name.includes('refrigerator') || name.includes('fridge')) {
      return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop';
    }
    
    return 'https://images.unsplash.com/photo-1515378791036-0648a814c448?w=400&h=300&fit=crop';
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  downloadReport(): void {
    // In a real implementation, this would generate and download a PDF
    alert('PDF download functionality would be implemented here using libraries like jsPDF or PDFKit');
  }

  printReport(): void {
    window.print();
  }
}
