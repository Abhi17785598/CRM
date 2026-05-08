import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryItemDto } from '../../models/manufacturing.models';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticInventoryItems: InventoryItemDto[] = [
  {
    id: '1',
    itemCode: 'STL-001',
    itemName: 'Steel Rod 10mm',
    description: 'High quality steel rod for construction',
    category: 'Raw Materials',
    unitPrice: 45.50,
    currentStock: 2500,
    minimumStock: 500,
    maximumStock: 5000,
    unitOfMeasure: 'pieces',
    location: 'Warehouse A',
    isLowStock: false,
    isOverStock: false
  },
  {
    id: '2',
    itemCode: 'ALM-002',
    itemName: 'Aluminum Sheet 2mm',
    description: 'Lightweight aluminum sheets',
    category: 'Raw Materials',
    unitPrice: 28.75,
    currentStock: 150,
    minimumStock: 200,
    maximumStock: 1000,
    unitOfMeasure: 'sheets',
    location: 'Warehouse B',
    isLowStock: true,
    isOverStock: false
  },
  {
    id: '3',
    itemCode: 'CPR-003',
    itemName: 'Copper Pipe 15mm',
    description: 'Copper pipes for plumbing',
    category: 'Finished Goods',
    unitPrice: 12.30,
    currentStock: 800,
    minimumStock: 100,
    maximumStock: 1500,
    unitOfMeasure: 'meters',
    location: 'Warehouse C',
    isLowStock: false,
    isOverStock: false
  },
  {
    id: '4',
    itemCode: 'BLT-004',
    itemName: 'Bolts M10x50',
    description: 'Steel bolts for assembly',
    category: 'Fasteners',
    unitPrice: 0.85,
    currentStock: 12000,
    minimumStock: 2000,
    maximumStock: 8000,
    unitOfMeasure: 'pieces',
    location: 'Warehouse D',
    isLowStock: false,
    isOverStock: true
  }
];

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  inventoryItems: InventoryItemDto[] = [];
  selectedItem: InventoryItemDto | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newItem: Partial<InventoryItemDto> = {
    itemCode: '',
    itemName: '',
    description: '',
    category: '',
    unitPrice: 0,
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    unitOfMeasure: '',
    location: ''
  };

  constructor(private csvExportService: CsvExportService) { }

  ngOnInit(): void {
    // Load static data
    this.inventoryItems = [...staticInventoryItems];
    this.updateStockStatus();
  }

  updateStockStatus(): void {
    this.inventoryItems.forEach(item => {
      item.isLowStock = item.currentStock <= item.minimumStock;
      item.isOverStock = item.currentStock >= item.maximumStock;
    });
  }

  getStockStatusClass(item: InventoryItemDto): string {
    if (item.isLowStock) return 'badge-danger';
    if (item.isOverStock) return 'badge-warning';
    return 'badge-success';
  }

  getStockStatusText(item: InventoryItemDto): string {
    if (item.isLowStock) return 'Low Stock';
    if (item.isOverStock) return 'Over Stock';
    return 'Normal';
  }

  selectItem(item: InventoryItemDto): void {
    console.log('Selecting item:', item);
    this.selectedItem = item;
  }

  createItem(): void {
    console.log('Creating item:', this.newItem);
    if (this.newItem.itemCode && this.newItem.itemName) {
      const item: InventoryItemDto = {
        id: Date.now().toString(),
        itemCode: this.newItem.itemCode || '',
        itemName: this.newItem.itemName || '',
        description: this.newItem.description || '',
        category: this.newItem.category || '',
        unitPrice: this.newItem.unitPrice || 0,
        currentStock: this.newItem.currentStock || 0,
        minimumStock: this.newItem.minimumStock || 0,
        maximumStock: this.newItem.maximumStock || 0,
        unitOfMeasure: this.newItem.unitOfMeasure || '',
        location: this.newItem.location || '',
        isLowStock: false,
        isOverStock: false
      };
      
      this.inventoryItems.push(item);
      staticInventoryItems.push(item);
      this.updateStockStatus();
      this.showCreateForm = false;
      this.resetForm();
      console.log('Item created successfully:', item);
    }
  }

  updateItem(): void {
    console.log('Updating item:', this.newItem);
    if (this.selectedItem && this.newItem.itemName) {
      Object.assign(this.selectedItem, this.newItem);
      
      // Update static data
      const staticItem = staticInventoryItems.find(i => i.id === this.selectedItem!.id);
      if (staticItem) {
        Object.assign(staticItem, this.newItem);
      }
      
      this.updateStockStatus();
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Item updated successfully:', this.selectedItem);
    }
  }

  updateStock(itemId: string, quantity: number): void {
    console.log('Updating stock:', itemId, quantity);
    const item = this.inventoryItems.find(i => i.id === itemId);
    const staticItem = staticInventoryItems.find(i => i.id === itemId);
    
    if (item && staticItem) {
      item.currentStock = Math.max(0, item.currentStock + quantity);
      staticItem.currentStock = item.currentStock;
      this.updateStockStatus();
      console.log('Stock updated successfully:', item);
    }
  }

  deleteItem(itemId: string): void {
    console.log('Deleting item:', itemId);
    this.inventoryItems = this.inventoryItems.filter(i => i.id !== itemId);
    staticInventoryItems = staticInventoryItems.filter(i => i.id !== itemId);
    if (this.selectedItem?.id === itemId) {
      this.selectedItem = null;
    }
    console.log('Item deleted successfully');
  }

  editItem(item: InventoryItemDto): void {
    console.log('Editing item:', item);
    this.selectedItem = item;
    this.newItem = { ...item };
    this.showUpdateForm = true;
  }

  exportInventory(): void {
    const headers = [
      'Item Code',
      'Item Name',
      'Description',
      'Category',
      'Unit Price',
      'Current Stock',
      'Minimum Stock',
      'Maximum Stock',
      'Unit of Measure',
      'Location',
      'Stock Status'
    ];

    const dataWithStatus = this.inventoryItems.map(item => ({
      ...item,
      stockStatus: this.getStockStatusText(item)
    }));

    const columnMapping = {
      itemCode: 'Item Code',
      itemName: 'Item Name',
      description: 'Description',
      category: 'Category',
      unitPrice: 'Unit Price',
      currentStock: 'Current Stock',
      minimumStock: 'Minimum Stock',
      maximumStock: 'Maximum Stock',
      unitOfMeasure: 'Unit of Measure',
      location: 'Location',
      stockStatus: 'Stock Status'
    };

    const formattedData = this.csvExportService.formatDataForExport(dataWithStatus, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('inventory');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newItem = {
      itemCode: '',
      itemName: '',
      description: '',
      category: '',
      unitPrice: 0,
      currentStock: 0,
      minimumStock: 0,
      maximumStock: 0,
      unitOfMeasure: '',
      location: ''
    };
  }
}
