import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
  id: string | number;
  customer: string;
  amount: number;
  status: string;
  time: string;
  // Optional full order properties for API responses
  orderId?: string;
  customerName?: string;
  productDescription?: string;
  orderDate?: Date;
  deliveryDate?: Date;
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
  assignedTo?: string;
  creationTime?: Date;
  lastModificationTime?: Date;
}

export interface CreateOrderRequest {
  customerName: string;
  amount: number;
  productDescription: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string;
  assignedTo: string;
}

export interface UpdateOrderRequest {
  customerName: string;
  amount: number;
  status: string;
  productDescription: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string;
  assignedTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apis.default.url + '/api/orders';

  constructor(private http: HttpClient) {}

  // Get all orders with pagination
  getOrders(skipCount: number = 0, maxResultCount: number = 10): Observable<{items: Order[], totalCount: number}> {
    return this.http.get<{items: Order[], totalCount: number}>(
      `${this.baseUrl}?skipCount=${skipCount}&maxResultCount=${maxResultCount}`
    );
  }

  // Get single order by ID
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  // Create new order
  createOrder(order: CreateOrderRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl, order);
  }

  // Update existing order
  updateOrder(id: number, order: UpdateOrderRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, order);
  }

  // Delete order
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Test connection
  testOrders(): Observable<{items: Order[], totalCount: number}> {
    return this.http.get<{items: Order[], totalCount: number}>(`${this.baseUrl}/test`);
  }
}
