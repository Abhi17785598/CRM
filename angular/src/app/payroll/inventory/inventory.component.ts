import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HrmsService } from '../../services/hrms.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;
  searchTerm: string = '';
  filteredItems: any[] = [];
  showAddItemModal: boolean = false;
  editingItem: any = null;
  itemForm: any = {
    itemCode: '',
    itemName: '',
    description: '',
    category: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    location: '',
    supplier: '',
    status: 'Active'
  };

  constructor(private hrmsService: HrmsService) { }

  ngOnInit(): void {
    this.loadInventoryItems();
  }

  loadInventoryItems(): void {
    this.loading = true;
    console.log('🔄 Loading inventory items from database...');
    
    // Load inventory items from AppInventoryItems table
    this.hrmsService.getInventoryItems().subscribe({
      next: (response: any) => {
        console.log('📥 Raw API response:', response);
        
        let inventoryData = [];
        
        if (Array.isArray(response)) {
          inventoryData = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          inventoryData = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          inventoryData = response.data;
        } else if (response && typeof response === 'object') {
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              inventoryData = response[key];
              break;
            }
          }
        }
        
        console.log('📥 Total inventory items loaded:', inventoryData.length);
        
        // Map inventory items
        this.inventoryItems = inventoryData.map((item: any) => ({
          id: item.id,
          itemCode: item.itemCode || '',
          itemName: item.itemName || '',
          description: item.description || '',
          category: item.category || '',
          unit: item.unit || '',
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          location: item.location || '',
          supplier: item.supplier || '',
          status: item.status || 'Active',
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          lastUpdated: item.lastModifiedTime ? new Date(item.lastModifiedTime) : new Date()
        }));
        
        this.filteredItems = [...this.inventoryItems];
        this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
        this.loading = false;
        console.log('✅ Inventory items loaded successfully:', this.inventoryItems.length);
      },
      error: (error) => {
        console.error('❌ Error loading inventory items:', error);
        this.loading = false;
        console.log('🔄 API failed - keeping current items');
      }
    });
  }

  searchItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.inventoryItems];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.inventoryItems.filter(item => 
        item.itemCode.toLowerCase().includes(term) ||
        item.itemName.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.supplier.toLowerCase().includes(term)
      );
    }
    
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
  }

  getStatusText(status: string): string {
    return status || 'Unknown';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-danger';
      case 'low stock':
        return 'badge-warning';
      case 'out of stock':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getCategoryClass(category: string): string {
    switch (category?.toLowerCase()) {
      case 'electronics':
        return 'badge-info';
      case 'furniture':
        return 'badge-primary';
      case 'stationery':
        return 'badge-warning';
      case 'machinery':
        return 'badge-dark';
      default:
        return 'badge-secondary';
    }
  }

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredItems.slice(startIndex, endIndex);
  }

  getPaginatedEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredItems.length);
  }

  getPaginatedStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  addItem(): void {
    this.editingItem = null;
    this.itemForm = {
      itemCode: '',
      itemName: '',
      description: '',
      category: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      location: '',
      supplier: '',
      status: 'Active'
    };
    this.showAddItemModal = true;
  }

  editItem(item: any): void {
    this.editingItem = { ...item };
    this.itemForm = { ...item };
    this.showAddItemModal = true;
  }

  deleteItem(item: any): void {
    if (confirm(`Are you sure you want to delete ${item.itemName}?`)) {
      // Implement delete logic
      console.log('Deleting item:', item.itemName);
    }
  }

  saveItem(): void {
    if (this.editingItem) {
      // Update existing item
      const index = this.inventoryItems.findIndex(i => i.id === this.editingItem.id);
      if (index !== -1) {
        this.inventoryItems[index] = { ...this.editingItem, ...this.itemForm };
      }
    } else {
      // Add new item
      const newItem = {
        id: Math.max(...this.inventoryItems.map(i => i.id)) + 1,
        ...this.itemForm,
        createdAt: new Date(),
        lastUpdated: new Date()
      };
      this.inventoryItems.push(newItem);
    }
    
    this.filteredItems = [...this.inventoryItems];
    this.showAddItemModal = false;
    this.editingItem = null;
  }

  closeModal(): void {
    this.showAddItemModal = false;
    this.editingItem = null;
    this.itemForm = {
      itemCode: '',
      itemName: '',
      description: '',
      category: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      location: '',
      supplier: '',
      status: 'Active'
    };
  }

  exportToCSV(): void {
    const csvData = this.filteredItems.map(item => ({
      'Item Code': item.itemCode,
      'Item Name': item.itemName,
      'Description': item.description,
      'Category': item.category,
      'Unit': item.unit,
      'Quantity': item.quantity,
      'Unit Price (₹)': item.unitPrice,
      'Total Value (₹)': item.quantity * item.unitPrice,
      'Location': item.location,
      'Supplier': item.supplier,
      'Status': item.status
    }));

    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `inventory_items_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }
}
