import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxNumber: string;
  paymentTerms: string;
  category: string;
  rating: number;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  deliveryAddress: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalAmount: number;
  receivedQuantity: number;
  pendingQuantity: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  vendorId: string;
  vendorName: string;
  quotationDate: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalAmount: number;
  leadTime: number;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  requestorId: string;
  requestorName: string;
  department: string;
  requestDate: string;
  requiredDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  items: PurchaseRequestItem[];
  totalAmount: number;
  justification: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface PurchaseRequestItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  estimatedPrice: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private baseUrl = 'api/purchase';

  constructor(private http: HttpClient) {}

  // Vendors
  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/vendors`);
  }

  getVendor(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.baseUrl}/vendors/${id}`);
  }

  createVendor(vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.baseUrl}/vendors`, vendor);
  }

  updateVendor(id: string, vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.baseUrl}/vendors/${id}`, vendor);
  }

  deleteVendor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vendors/${id}`);
  }

  getVendorsByCategory(category: string): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/vendors/category/${category}`);
  }

  // Purchase Orders
  getPurchaseOrders(status?: string, vendorId?: string): Observable<PurchaseOrder[]> {
    let params = '';
    if (status) params += `?status=${status}`;
    if (vendorId) params += `${params ? '&' : '?'}vendorId=${vendorId}`;
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/orders${params}`);
  }

  getPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/orders/${id}`);
  }

  createPurchaseOrder(order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/orders`, order);
  }

  updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.baseUrl}/orders/${id}`, order);
  }

  deletePurchaseOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`);
  }

  sendPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/orders/${id}/send`, {});
  }

  confirmPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/orders/${id}/confirm`, {});
  }

  receiveItems(id: string, items: any[]): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/orders/${id}/receive`, { items });
  }

  // Quotations
  getQuotations(status?: string, vendorId?: string): Observable<Quotation[]> {
    let params = '';
    if (status) params += `?status=${status}`;
    if (vendorId) params += `${params ? '&' : '?'}vendorId=${vendorId}`;
    return this.http.get<Quotation[]>(`${this.baseUrl}/quotations${params}`);
  }

  getQuotation(id: string): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.baseUrl}/quotations/${id}`);
  }

  createQuotation(quotation: Partial<Quotation>): Observable<Quotation> {
    return this.http.post<Quotation>(`${this.baseUrl}/quotations`, quotation);
  }

  updateQuotation(id: string, quotation: Partial<Quotation>): Observable<Quotation> {
    return this.http.put<Quotation>(`${this.baseUrl}/quotations/${id}`, quotation);
  }

  deleteQuotation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/quotations/${id}`);
  }

  acceptQuotation(id: string): Observable<Quotation> {
    return this.http.post<Quotation>(`${this.baseUrl}/quotations/${id}/accept`, {});
  }

  rejectQuotation(id: string, reason: string): Observable<Quotation> {
    return this.http.post<Quotation>(`${this.baseUrl}/quotations/${id}/reject`, { reason });
  }

  convertQuotationToOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/quotations/${id}/convert`, {});
  }

  // Purchase Requests
  getPurchaseRequests(status?: string, department?: string): Observable<PurchaseRequest[]> {
    let params = '';
    if (status) params += `?status=${status}`;
    if (department) params += `${params ? '&' : '?'}department=${department}`;
    return this.http.get<PurchaseRequest[]>(`${this.baseUrl}/requests${params}`);
  }

  getPurchaseRequest(id: string): Observable<PurchaseRequest> {
    return this.http.get<PurchaseRequest>(`${this.baseUrl}/requests/${id}`);
  }

  createPurchaseRequest(request: Partial<PurchaseRequest>): Observable<PurchaseRequest> {
    return this.http.post<PurchaseRequest>(`${this.baseUrl}/requests`, request);
  }

  updatePurchaseRequest(id: string, request: Partial<PurchaseRequest>): Observable<PurchaseRequest> {
    return this.http.put<PurchaseRequest>(`${this.baseUrl}/requests/${id}`, request);
  }

  deletePurchaseRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/requests/${id}`);
  }

  approvePurchaseRequest(id: string): Observable<PurchaseRequest> {
    return this.http.post<PurchaseRequest>(`${this.baseUrl}/requests/${id}/approve`, {});
  }

  rejectPurchaseRequest(id: string, reason: string): Observable<PurchaseRequest> {
    return this.http.post<PurchaseRequest>(`${this.baseUrl}/requests/${id}/reject`, { reason });
  }

  convertRequestToOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/requests/${id}/convert`, {});
  }

  // Analytics
  getPurchaseOverview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/overview`);
  }

  getVendorPerformance(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/vendor-performance`);
  }

  getSpendingAnalysis(startDate?: string, endDate?: string): Observable<any> {
    let params = '';
    if (startDate) params += `?startDate=${startDate}`;
    if (endDate) params += `${params ? '&' : '?'}endDate=${endDate}`;
    return this.http.get<any>(`${this.baseUrl}/analytics/spending${params}`);
  }
}
