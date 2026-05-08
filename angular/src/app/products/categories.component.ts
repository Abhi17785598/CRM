import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Product Categories</h2>
              <p class="text-muted">Manage your product categories</p>
            </div>
            <button class="btn btn-primary" (click)="showAddCategoryModal()">
              <i class="fas fa-plus"></i> Add Category
            </button>
          </div>
          
          <div class="row">
            <div class="col-md-4" *ngFor="let category of categories">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title mb-1">{{ category.name }}</h5>
                      <p class="card-text text-muted small">{{ category.description }}</p>
                      <span class="badge bg-primary">{{ category.productCount }} products</span>
                    </div>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" (click)="editCategory(category)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-danger" (click)="deleteCategory(category)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories = [
    { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', productCount: 45 },
    { id: 2, name: 'Furniture', description: 'Office and home furniture', productCount: 23 },
    { id: 3, name: 'Raw Materials', description: 'Raw materials for production', productCount: 67 },
    { id: 4, name: 'Tools', description: 'Tools and equipment', productCount: 34 },
    { id: 5, name: 'Office Supplies', description: 'Office stationery and supplies', productCount: 89 }
  ];

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('Categories Component loaded');
  }

  showAddCategoryModal() {
    console.log('Show add category modal');
  }

  editCategory(category: any) {
    console.log('Editing category:', category);
  }

  deleteCategory(category: any) {
    console.log('Deleting category:', category);
  }
}
