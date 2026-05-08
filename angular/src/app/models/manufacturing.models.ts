export interface ProductionOrderDto {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: number;
  notes?: string;
}

export interface InventoryItemDto {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitOfMeasure: string;
  location?: string;
  isLowStock: boolean;
  isOverStock: boolean;
}

export enum ProductionOrderStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface CreateProductionOrderDto {
  orderNumber: string;
  productName: string;
  quantity: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
}

export interface UpdateProductionOrderDto {
  productName: string;
  quantity: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  notes?: string;
}

export interface CreateInventoryItemDto {
  itemCode: string;
  itemName: string;
  description: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitOfMeasure: string;
  location?: string;
}

export interface UpdateInventoryItemDto {
  itemName: string;
  description: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitOfMeasure: string;
  location?: string;
}
