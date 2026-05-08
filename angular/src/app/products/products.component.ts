import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';

interface Product {
  id: string;
  productCode: string;
  productName: string;
  description: string;
  brand: string;
  model: string;
  category: string;
  subCategory: string;
  specifications: string;
  dimensions: string;
  weight: number;
  color: string;
  material: string;
  costPrice: number;
  sellingPrice: number;
  retailPrice: number;
  currentStock: number;
  imageUrls: string;
  tags: string;
  status: number;
  sku: string;
  creationTime: string;
}

interface Category {
  name: string;
  value: string;
}

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = false;
  
  // Statistics properties
  stats = {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalValue: 0
  };
  
  // Filter properties
  selectedCategory: Category | null = null;
  selectedStatus: string = '';
  searchQuery: string = '';
  priceRange: number[] = [0, 5000];
  inStockOnly: boolean = false;

  private apiUrl = 'http://localhost:44379/api/products';

  constructor(private http: HttpClient, private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    console.log('ProductsComponent initialized');
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    this.loadLGProducts();
    this.loadCategories();
  }

  loadLGProducts(): void {
    this.loading = true;
    this.productService.getLGProducts().subscribe({
      next: (response) => {
        console.log('LG Products API Response:', response);
        // Map response to match Product interface
        this.products = (response || []).map((item: any) => ({
          id: item.id,
          productCode: item.productCode || item.ProductCode,
          productName: item.productName || item.ProductName,
          description: item.description || item.Description,
          brand: item.brand || item.Brand || '',
          model: item.model || item.Model || '',
          category: item.category || item.Category,
          subCategory: item.subCategory || item.SubCategory || '',
          specifications: item.specifications || item.Specifications || '',
          dimensions: item.dimensions || item.Dimensions || '',
          weight: item.weight || item.Weight || 0,
          color: item.color || item.Color || '',
          material: item.material || item.Material || '',
          costPrice: item.costPrice || item.CostPrice || 0,
          sellingPrice: item.sellingPrice || item.SellingPrice || 0,
          retailPrice: item.retailPrice || item.RetailPrice || 0,
          currentStock: item.currentStock || item.CurrentStock || 0,
          imageUrls: item.imageUrls || item.ImageUrls || '[]',
          tags: item.tags || item.Tags || '',
          status: item.status || item.Status || 1,
          sku: item.sku || item.SKU || '',
          creationTime: item.creationTime || item.CreationTime || ''
        }));
        console.log('Mapped products:', this.products);
        this.calculateStatistics();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading LG products:', error);
        this.loading = false;
        // Show error state instead of falling back to demo data
        this.products = [];
        this.filteredProducts = [];
      }
    });
  }

  loadCategories(): void {
    this.productService.getProductCategories().subscribe({
      next: (data) => {
        this.categories = data.map(cat => ({ name: cat, value: cat }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Show empty categories if API fails
        this.categories = [];
      }
    });
  }

  
  calculateStatistics(): void {
    this.stats.totalProducts = this.products.length;
    this.stats.activeProducts = this.products.filter(p => p.status === 1).length;
    this.stats.lowStockProducts = this.products.filter(p => p.currentStock <= 10).length;
    this.stats.totalValue = this.products.reduce((total, p) => total + (p.sellingPrice * p.currentStock), 0);
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.selectedStatus = '';
    this.searchQuery = '';
    this.priceRange = [0, 5000];
    this.inStockOnly = false;
    this.applyFilters();
    
    // Scroll to top when filters are reset
    window.scrollTo(0, 0);
  }

  onFilterChange(): void {
    this.applyFilters();
    
    // Scroll to top when filters change
    window.scrollTo(0, 0);
  }

  onSearch(): void {
    this.applyFilters();
    
    // Scroll to top when search is performed
    window.scrollTo(0, 0);
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Selected category:', this.selectedCategory);
    console.log('Search query:', this.searchQuery);
    console.log('Price range:', this.priceRange);
    console.log('In stock only:', this.inStockOnly);
    
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.selectedCategory && product.category !== this.selectedCategory.value) {
        return false;
      }
      
      // Status filter
      if (this.selectedStatus) {
        const statusMap: { [key: string]: number } = {
          'active': 1,
          'inactive': 0,
          'discontinued': 2
        };
        if (product.status !== statusMap[this.selectedStatus]) {
          return false;
        }
      }
      
      // Search filter
      if (this.searchQuery && !product.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (product.sellingPrice < this.priceRange[0] || product.sellingPrice > this.priceRange[1]) {
        return false;
      }
      
      // Stock filter
      if (this.inStockOnly && product.currentStock <= 0) {
        return false;
      }
      
      return true;
    });
    
    console.log('Filtered products:', this.filteredProducts);
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onStockFilterChange(): void {
    this.applyFilters();
  }

  getImageUrls(product: Product): string[] {
    try {
      const urls = JSON.parse(product.imageUrls || '[]');
      if (urls.length > 0) {
        return urls;
      }
    } catch {
      // Fallback to dynamic image based on product name
    }
    
    // Generate image based on product name
    return [this.getProductImage(product.productName)];
  }

  getProductImage(productName: string): string {
    if (!productName) return 'assets/images/products/1.jpg';
    
    const name = productName.toLowerCase();
    
    // LG TV Products
    if (name.includes('tv') || name.includes('television') || name.includes('oled') || name.includes('led')) {
      if (name.includes('oled')) {
        return 'assets/images/products/2.jpg';
      } else {
        return 'assets/images/products/4.jpg';
      }
    }
    
    // LG Laptops
    if (name.includes('laptop') || name.includes('gram') || name.includes('ultrabook')) {
      return 'assets/images/products/1.jpg';
    }
    
    // LG Washing Machines
    if (name.includes('washing') || name.includes('washer') || name.includes('laundry')) {
      return 'assets/images/products/3.jpg';
    }
    
    // LG Refrigerators
    if (name.includes('refrigerator') || name.includes('fridge') || name.includes('refrigerator')) {
      return 'assets/images/products/5.jpg';
    }
    
    // LG Air Conditioners
    if (name.includes('air conditioner') || name.includes('ac') || name.includes('conditioner')) {
      return 'assets/images/products/3.jpg';
    }
    
    // LG Microwave Ovens
    if (name.includes('microwave') || name.includes('oven')) {
      return 'assets/images/products/3.jpg';
    }
    
    // LG Dishwashers
    if (name.includes('dishwasher') || name.includes('dish')) {
      return 'assets/images/products/3.jpg';
    }
    
    // LG Sound Systems
    if (name.includes('sound') || name.includes('audio') || name.includes('speaker') || name.includes('music')) {
      return 'assets/images/products/6.jpg';
    }
    
    // Default LG product image
    if (name.includes('lg')) {
      return 'assets/images/products/3.jpg';
    }
    
    // Generic electronics placeholder
    return 'assets/images/products/3.jpg';
  }

  getTags(product: Product): string[] {
    return product.tags ? product.tags.split(',').map(tag => tag.trim()) : [];
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  onImageError(event: any) {
    // Fallback to placeholder if image fails to load
    event.target.src = 'https://via.placeholder.com/300x200?text=LG+Product';
  }

  getStockStatus(product: Product): { severity: 'success' | 'warning' | 'danger', text: string } {
    if (product.currentStock === 0) {
      return { severity: 'danger', text: 'Out of Stock' };
    } else if (product.currentStock <= 10) {
      return { severity: 'warning', text: `Only ${product.currentStock} left` };
    } else {
      return { severity: 'success', text: 'In Stock' };
    }
  }

  viewProductDetails(product: Product) {
    console.log('View Product Details clicked for:', product);
    console.log('Product ID:', product.id);
    console.log('Navigation to:', ['/products/catalog', product.id]);
    // Navigate to product details page using the correct route
    this.router.navigate(['/products/catalog', product.id]);
  }

  generateReport(product: Product) {
    console.log('Generate Report clicked for product:', product);
    console.log('Product ID:', product.id);
    console.log('Navigation to:', ['/products/catalog', product.id, 'report']);
    // Navigate to product report page
    this.router.navigate(['/products/catalog', product.id, 'report']);
  }

  checkInventory(product: Product) {
    console.log('Check Inventory clicked for product:', product);
    alert(`Checking inventory status for: ${product.productName}`);
  }

  deleteProduct(product: Product) {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product:', product);
      alert('Product deleted successfully');
    }
  }
}
