import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  description: string;
  specifications: string;
  brand: string;
  model: string;
  category: string;
  subCategory: string;
  tags: string;
  productType: number;
  status: string;
  weight: number;
  volume: number;
  dimensions: string;
  unitOfMeasure: string;
  color: string;
  material: string;
  size: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  currency: string;
  taxRate: number;
  discountPercentage: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  stockLocation: string;
  barcode: string;
  qrCode: string;
  sku: string;
  primarySupplierName: string;
  supplierSku: string;
  supplierPrice: number;
  leadTimeDays: number;
  isTaxable: boolean;
  isDiscountable: boolean;
  isReturnable: boolean;
  returnPeriodDays: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  imageUrls: string;
  documentUrls: string;
  videoUrl: string;
  notes: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  lastSoldDate?: string;
  lastPurchaseDate?: string;
  totalSold: number;
  totalPurchased: number;
  timesSold: number;
  timesPurchased: number;
  averageRating: number;
  reviewCount: number;
  creationTime: string;
  lastModificationTime: string;
}

export interface ProductCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  level: number;
  path: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  attributes?: string;
  defaultUnitOfMeasure: string;
  defaultTaxRate: number;
  defaultMargin: number;
  creationTime: string;
  lastModificationTime: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  movementType: number;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  unitCost: number;
  totalValue: number;
  referenceNumber?: string;
  referenceType?: string;
  reason?: string;
  notes?: string;
  location?: string;
  batchNumber?: string;
  expiryDate?: string;
  supplierName?: string;
  customerName?: string;
  userId?: string;
  userName?: string;
  movementDate: string;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  companyName: string;
  legalName?: string;
  tradeName?: string;
  description?: string;
  website?: string;
  contactPerson: string;
  contactTitle?: string;
  email: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  billingAddress?: string;
  shippingAddress?: string;
  taxNumber?: string;
  registrationNumber?: string;
  supplierType: number;
  status: string;
  industry?: string;
  businessType?: string;
  currency: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  swiftCode?: string;
  rating: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  qualityRating: number;
  totalOrders: number;
  totalPurchaseValue: number;
  lastOrderDate?: string;
  lastPaymentDate?: string;
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  contractTerms?: string;
  isPreferredSupplier: boolean;
  isApproved: boolean;
  notes?: string;
  tags?: string;
  logoUrl?: string;
  certifications?: string;
  complianceDocuments?: string;
  isCompliant: boolean;
  lastAuditDate?: string;
  nextAuditDate?: string;
  creationTime: string;
  lastModificationTime: string;
}

export interface CreateProductRequest {
  productCode: string;
  productName: string;
  description?: string;
  specifications?: string;
  brand?: string;
  model?: string;
  category: string;
  subCategory?: string;
  tags?: string;
  productType?: number;
  weight?: number;
  volume?: number;
  dimensions?: string;
  unitOfMeasure?: string;
  color?: string;
  material?: string;
  size?: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  retailPrice?: number;
  currency?: string;
  taxRate?: number;
  discountPercentage?: number;
  currentStock: number;
  minimumStock?: number;
  maximumStock?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  stockLocation?: string;
  barcode?: string;
  qrCode?: string;
  sku?: string;
  primarySupplierId?: string;
  primarySupplierName?: string;
  supplierSku?: string;
  supplierPrice?: number;
  leadTimeDays?: number;
  isTaxable?: boolean;
  isDiscountable?: boolean;
  isReturnable?: boolean;
  returnPeriodDays?: number;
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;
  imageUrls?: string;
  documentUrls?: string;
  videoUrl?: string;
  notes?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:44379'; // Update this to match your API host
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // Get LG Products specifically
  getLGProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/products/lg`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Product CRUD operations - matching existing API
  getProducts(skipCount: number = 0, maxResultCount: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/products?skipCount=${skipCount}&maxResultCount=${maxResultCount}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/products/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(product: any): Observable<any> {
    // Map to match existing API structure
    const createRequest = {
      ItemCode: product.productCode,
      ProductName: product.productName,
      Description: product.description,
      Category: product.category,
      Unit: product.unitOfMeasure || 'pcs',
      Quantity: product.currentStock,
      UnitCost: product.costPrice,
      Location: product.stockLocation || 'Warehouse',
      Supplier: product.primarySupplierName || 'Default Supplier',
      MinStockLevel: product.minimumStock,
      MaxStockLevel: product.maximumStock
    };
    
    return this.http.post<any>(`${this.baseUrl}/api/products`, createRequest, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: any): Observable<any> {
    const updateRequest = {
      ProductName: product.productName,
      Description: product.description,
      Category: product.category,
      Unit: product.unitOfMeasure || 'pcs',
      Quantity: product.currentStock,
      UnitCost: product.costPrice,
      Location: product.stockLocation || 'Warehouse',
      Supplier: product.primarySupplierName || 'Default Supplier',
      MinStockLevel: product.minimumStock,
      MaxStockLevel: product.maximumStock
    };
    
    return this.http.put<any>(`${this.baseUrl}/api/products/${id}`, updateRequest, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/products/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  searchProducts(query: string, skipCount: number = 0, maxResultCount: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/products/search?query=${encodeURIComponent(query)}&skipCount=${skipCount}&maxResultCount=${maxResultCount}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Product Categories - using existing inventory categories
  getProductCategories(): Observable<any[]> {
    // Extract unique categories from inventory items
    return this.http.get<any>(`${this.baseUrl}/api/products/categories`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Suppliers - using existing API
  getSuppliers(skipCount: number = 0, maxResultCount: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/products/suppliers?skipCount=${skipCount}&maxResultCount=${maxResultCount}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getSupplier(id: string): Observable<any> {
    // This would need a separate endpoint
    return of(null);
  }

  createSupplier(supplier: any): Observable<any> {
    // This would need a separate endpoint
    return of(null);
  }

  updateSupplier(id: string, supplier: any): Observable<any> {
    // This would need a separate endpoint
    return of(null);
  }

  deleteSupplier(id: string): Observable<void> {
    // This would need a separate endpoint
    return of(void 0);
  }

  searchSuppliers(query: string, skipCount: number = 0, maxResultCount: number = 10): Observable<any> {
    // This would need a separate endpoint
    return of({ items: [], totalCount: 0 });
  }

  // Analytics - using existing API
  getProductStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/products/analytics/products`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getStockStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/products/analytics/purchases`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getSupplierStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/products/analytics/suppliers`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Barcode generation - using existing API
  generateBarcode(productId: string, type: string = 'CODE-128'): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/products/${productId}/barcode`, { type }, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getBarcodes(productId?: string): Observable<any[]> {
    const url = productId ? `${this.baseUrl}/api/products/barcodes?productId=${productId}` : `${this.baseUrl}/api/products/barcodes`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Purchase Orders - using existing API
  getPurchaseOrders(skipCount: number = 0, maxResultCount: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/products/purchase-orders?skipCount=${skipCount}&maxResultCount=${maxResultCount}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    if (error.status === 0) {
      // Network or CORS error
      console.error('Network/CORS error - make sure backend is running and accessible');
      return throwError(() => new Error('Unable to connect to server. Please check if the backend is running.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Resource not found.'));
    } else if (error.status >= 500) {
      return throwError(() => new Error('Server error. Please try again later.'));
    } else {
      return throwError(() => new Error(error.message || 'An error occurred.'));
    }
  }

  // Utility method to check if backend is available
  checkBackendConnection(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/api/products/analytics/products`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
