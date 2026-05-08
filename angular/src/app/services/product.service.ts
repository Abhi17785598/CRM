import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  unit: string;
  price: number;
  cost: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  barcode?: string;
  qrCode?: string;
  images: string[];
  specifications: ProductSpecification[];
  status: 'active' | 'inactive' | 'discontinued';
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  leadTime: number;
  supplier: string;
  createdDate: string;
  updatedDate: string;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'date';
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentTerms: string;
  deliveryAddress: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdDate: string;
  updatedDate: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  remainingQuantity: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  taxId: string;
  paymentTerms: string;
  deliveryTerms: string;
  categories: string[];
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  products: string[];
  createdDate: string;
  updatedDate: string;
}

export interface Barcode {
  id: string;
  productId: string;
  barcode: string;
  type: 'EAN-13' | 'UPC-A' | 'CODE-128' | 'QR-CODE';
  generatedDate: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'api/products';

  constructor(private http: HttpClient) {}

  // Product Management
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${category}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/search?q=${query}`);
  }

  // Barcode Management
  generateBarcode(productId: string, type: string): Observable<Barcode> {
    return this.http.post<Barcode>(`${this.baseUrl}/${productId}/barcode`, { type });
  }

  getBarcodes(productId?: string): Observable<Barcode[]> {
    const url = productId ? `${this.baseUrl}/barcodes?productId=${productId}` : `${this.baseUrl}/barcodes`;
    return this.http.get<Barcode[]>(url);
  }

  printBarcode(barcodeId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/barcodes/${barcodeId}/print`, { responseType: 'blob' });
  }

  // Purchase Order Management
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/purchase-orders`);
  }

  getPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}`);
  }

  createPurchaseOrder(order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/purchase-orders`, order);
  }

  updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}`, order);
  }

  deletePurchaseOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/purchase-orders/${id}`);
  }

  sendPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}/send`, {});
  }

  approvePurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}/approve`, {});
  }

  receivePurchaseOrder(id: string, items: { itemId: string; quantity: number }[]): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}/receive`, { items });
  }

  // Supplier Management
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/suppliers`);
  }

  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/suppliers/${id}`);
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/suppliers`, supplier);
  }

  updateSupplier(id: string, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/suppliers/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/suppliers/${id}`);
  }

  getSuppliersByCategory(category: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/suppliers/category/${category}`);
  }

  // Analytics
  getProductStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/products`);
  }

  getPurchaseStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/purchases`);
  }

  getSupplierStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/suppliers`);
  }
}
