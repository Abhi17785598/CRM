import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  assignedTo: string;
  materials: ProductionMaterial[];
  qualityChecks: QualityCheck[];
  progress: number;
  notes: string;
  createdDate: string;
  updatedDate: string;
}

export interface ProductionMaterial {
  id: string;
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  allocatedQuantity: number;
  unit: string;
  cost: number;
}

export interface QualityCheck {
  id: string;
  checkType: string;
  result: 'pass' | 'fail' | 'pending';
  checkedBy: string;
  checkedDate: string;
  notes: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  totalValue: number;
  supplier: string;
  lastRestockDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  barcode?: string;
}

export interface BillOfMaterials {
  id: string;
  productId: string;
  productName: string;
  version: string;
  components: BOMComponent[];
  createdDate: string;
  updatedDate: string;
}

export interface BOMComponent {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class ManufacturingService {
  private baseUrl = 'api/manufacturing';

  constructor(private http: HttpClient) {}

  // Production Orders
  getProductionOrders(): Observable<ProductionOrder[]> {
    return this.http.get<ProductionOrder[]>(`${this.baseUrl}/production-orders`);
  }

  getProductionOrder(id: string): Observable<ProductionOrder> {
    return this.http.get<ProductionOrder>(`${this.baseUrl}/production-orders/${id}`);
  }

  createProductionOrder(order: Partial<ProductionOrder>): Observable<ProductionOrder> {
    return this.http.post<ProductionOrder>(`${this.baseUrl}/production-orders`, order);
  }

  updateProductionOrder(id: string, order: Partial<ProductionOrder>): Observable<ProductionOrder> {
    return this.http.put<ProductionOrder>(`${this.baseUrl}/production-orders/${id}`, order);
  }

  deleteProductionOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/production-orders/${id}`);
  }

  updateProductionProgress(id: string, progress: number): Observable<ProductionOrder> {
    return this.http.patch<ProductionOrder>(`${this.baseUrl}/production-orders/${id}/progress`, { progress });
  }

  completeProductionOrder(id: string): Observable<ProductionOrder> {
    return this.http.post<ProductionOrder>(`${this.baseUrl}/production-orders/${id}/complete`, {});
  }

  // Inventory Management
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/inventory`);
  }

  getInventoryItem(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.baseUrl}/inventory/${id}`);
  }

  createInventoryItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.baseUrl}/inventory`, item);
  }

  updateInventoryItem(id: string, item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.baseUrl}/inventory/${id}`, item);
  }

  deleteInventoryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/inventory/${id}`);
  }

  adjustInventory(id: string, quantity: number, reason: string): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.baseUrl}/inventory/${id}/adjust`, { quantity, reason });
  }

  getLowStockItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/inventory/low-stock`);
  }

  // Bill of Materials
  getBillsOfMaterials(): Observable<BillOfMaterials[]> {
    return this.http.get<BillOfMaterials[]>(`${this.baseUrl}/bom`);
  }

  getBillOfMaterials(id: string): Observable<BillOfMaterials> {
    return this.http.get<BillOfMaterials>(`${this.baseUrl}/bom/${id}`);
  }

  createBillOfMaterials(bom: Partial<BillOfMaterials>): Observable<BillOfMaterials> {
    return this.http.post<BillOfMaterials>(`${this.baseUrl}/bom`, bom);
  }

  updateBillOfMaterials(id: string, bom: Partial<BillOfMaterials>): Observable<BillOfMaterials> {
    return this.http.put<BillOfMaterials>(`${this.baseUrl}/bom/${id}`, bom);
  }

  deleteBillOfMaterials(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bom/${id}`);
  }

  // Analytics
  getProductionStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/production`);
  }

  getInventoryStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/inventory`);
  }

  getEfficiencyStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/efficiency`);
  }
}
