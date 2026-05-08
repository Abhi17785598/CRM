import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  loading = false;
  error = '';

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
    console.log('Loading product with ID:', productId);
    console.log('Full URL being called:', `http://localhost:44379/api/products/${productId}`);
    
    if (productId) {
      this.loading = true;
      this.error = '';
      
      this.productService.getProduct(productId).subscribe({
        next: (product) => {
          console.log('Product loaded:', product);
          this.product = product;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Full error object:', error);
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
    return this.product.currentStock <= this.product.minimumStock ? 'text-danger' : 'text-success';
  }

  get totalValue(): number {
    if (!this.product) return 0;
    return this.product.currentStock * this.product.sellingPrice;
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

  editProduct(): void {
    alert('Edit product functionality would open edit modal');
  }

  viewStockLedger(): void {
    alert('Opening stock ledger for this product');
  }

  viewMovements(): void {
    alert('Opening stock movements for this product');
  }

  generateReport(): void {
    if (this.product) {
      this.router.navigate(['/products/catalog', this.product.id, 'report']);
    }
  }

  addToProcurement(): void {
    alert('Adding product to procurement list');
  }
}
