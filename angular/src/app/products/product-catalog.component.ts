import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-catalog',
  standalone: false,
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Electronics', 'Furniture', 'Raw Materials', 'Tools', 'Office Supplies'];
  loading = false;
  error = '';
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';
  
  stats = {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalValue: 0
  };

  newProduct = {
    productCode: '',
    productName: '',
    description: '',
    category: '',
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    status: 'active'
  };

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadStats();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getProducts().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        // Map backend data to frontend format
        this.products = (response.items || []).map(item => ({
          id: item.id,
          productCode: item.ItemCode,
          productName: item.ItemName,
          description: item.Description,
          category: item.Category,
          costPrice: item.UnitPrice,
          sellingPrice: item.UnitPrice * 1.2, // 20% markup
          currentStock: item.CurrentStock,
          minimumStock: item.MinimumStock,
          maximumStock: item.MaximumStock,
          status: 'active', // Default status since it's not mapped
          UnitPrice: item.UnitPrice,
          Quantity: item.CurrentStock,
          ItemCode: item.ItemCode,
          ItemName: item.ItemName,
          TotalValue: item.UnitPrice * item.CurrentStock
        }));
        console.log('Mapped products:', this.products);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = error.message || 'Failed to load products';
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.productService.getProductStats().subscribe({
      next: (stats) => {
        this.stats = {
          totalProducts: stats.totalProducts || 0,
          activeProducts: stats.activeProducts || 0,
          lowStockProducts: stats.lowStockProducts || 0,
          totalValue: stats.totalValue || 0
        };
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // Use default stats if API fails
        this.stats = {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          totalValue: 0
        };
      }
    });
  }

  loadCategories() {
    this.productService.getProductCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Use default categories if API fails
        this.categories = ['Electronics', 'Furniture', 'Raw Materials', 'Tools', 'Office Supplies'];
      }
    });
  }

  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (response) => {
          // Map backend data to frontend format
          this.products = (response.items || []).map(item => ({
            id: item.id,
            productCode: item.ItemCode,
            productName: item.ItemName,
            description: item.Description,
            category: item.Category,
            costPrice: item.UnitPrice,
            sellingPrice: item.UnitPrice * 1.2, // 20% markup
            currentStock: item.CurrentStock,
            minimumStock: item.MinimumStock,
            maximumStock: item.MaximumStock,
            status: 'active', // Default status since it's not mapped
            UnitPrice: item.UnitPrice,
            Quantity: item.CurrentStock,
            ItemCode: item.ItemCode,
            ItemName: item.ItemName,
            TotalValue: item.UnitPrice * item.CurrentStock
          }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching products:', error);
          this.error = error.message || 'Failed to search products';
          this.loading = false;
        }
      });
    } else {
      this.loadProducts();
    }
  }

  onFilterChange() {
    // Apply filters logic here
    console.log('Filters changed:', this.selectedCategory, this.selectedStatus);
    // For now, just reload products
    this.loadProducts();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.loadProducts();
  }

  getProductStatusClass(status: string) {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      case 'discontinued': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  showAddProductModal() {
    // Removed - no longer needed for ERP system
    console.log('Add Product modal removed - use ERP workflows instead');
  }

  hideAddForm() {
    // Removed - no longer needed for ERP system
    console.log('Add form functionality removed');
  }

  // Add Product method removed - ERP system doesn't use shopping cart functionality

  editProduct(product: any) {
    console.log('Editing product:', product);
    // Implement edit logic
  }

  viewProductDetails(product: any) {
    console.log('View Product Details clicked for:', product);
    console.log('Product ID:', product.id);
    console.log('Navigation to:', ['/products/catalog', product.id]);
    // Navigate to product details page using the correct route
    this.router.navigate(['/products/catalog', product.id]);
  }

  generateReport(product: any) {
    console.log('Generate Report clicked for product:', product);
    console.log('Product ID:', product.id);
    console.log('Navigation to:', ['/products/catalog', product.id, 'report']);
    // Navigate to product report page
    this.router.navigate(['/products/catalog', product.id, 'report']);
  }

  checkInventory(product: any) {
    console.log('Check Inventory clicked for product:', product);
    alert(`Checking inventory status for: ${product.productName || product.ItemName}`);
    // TODO: Implement inventory status check
  }

  deleteProduct(product: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.loadProducts(); // Reload products
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product: ' + error.message);
        }
      });
    }
  }

  getProductImage(productName: string): string {
    if (!productName) return 'https://via.placeholder.com/300x200?text=No+Image';
    
    // Map product names to LG product images
    const name = productName.toLowerCase();
    
    // LG TV Products
    if (name.includes('tv') || name.includes('television') || name.includes('oled') || name.includes('led')) {
      if (name.includes('oled')) {
        return 'https://images.unsplash.com/photo-1598422267219-81848e4f9d50?w=400&h=300&fit=crop';
      } else if (name.includes('55') || name.includes('65')) {
        return 'https://images.unsplash.com/photo-1618424180693-2fd444e4481f?w=400&h=300&fit=crop';
      } else {
        return 'https://images.unsplash.com/photo-1593784997273-9c3e6b7e5a5c?w=400&h=300&fit=crop';
      }
    }
    
    // LG Washing Machines
    if (name.includes('washing') || name.includes('washer') || name.includes('laundry')) {
      return 'https://images.unsplash.com/photo-1584464491033-06638f0b03ea?w=400&h=300&fit=crop';
    }
    
    // LG Refrigerators
    if (name.includes('refrigerator') || name.includes('fridge') || name.includes('freezer')) {
      return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop';
    }
    
    // LG Air Conditioners
    if (name.includes('air conditioner') || name.includes('ac') || name.includes('cooling')) {
      return 'https://images.unsplash.com/photo-1588828938186-35e71e7c60a7?w=400&h=300&fit=crop';
    }
    
    // LG Microwave Ovens
    if (name.includes('microwave') || name.includes('oven')) {
      return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
    }
    
    // LG Dishwashers
    if (name.includes('dishwasher') || name.includes('dish')) {
      return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop';
    }
    
    // LG Sound Systems
    if (name.includes('sound') || name.includes('audio') || name.includes('speaker') || name.includes('music')) {
      return 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop';
    }
    
    // Default LG product image
    if (name.includes('lg')) {
      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
    }
    
    // Generic electronics placeholder
    return 'https://images.unsplash.com/photo-1515378791036-0648a814c448?w=400&h=300&fit=crop';
  }

  onImageError(event: any) {
    // Fallback to placeholder if image fails to load
    event.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
  }
}
