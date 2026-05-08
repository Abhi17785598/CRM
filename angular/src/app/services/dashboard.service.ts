import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalCustomers: number;
  activeOrders: number;
  totalEmployees: number;
  openLeads: number;
  totalRevenue: number;
  monthlyGrowth: number;
  productionEfficiency: number;
  inventoryValue: number;
  qualityScore: number;
  pendingApprovals: number;
  overdueTasks: number;
  newMessages: number;
}

export interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}

export interface ProductionData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface PerformanceData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
  }[];
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'customer' | 'employee' | 'payment' | 'production' | 'inventory';
  description: string;
  user: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  module: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'api/dashboard';

  constructor(private http: HttpClient) {}

  // Dashboard Statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  // Chart Data
  getSalesData(period: string = '6m'): Observable<SalesData> {
    return this.http.get<SalesData>(`${this.baseUrl}/charts/sales?period=${period}`);
  }

  getProductionData(): Observable<ProductionData> {
    return this.http.get<ProductionData>(`${this.baseUrl}/charts/production`);
  }

  getPerformanceData(): Observable<PerformanceData> {
    return this.http.get<PerformanceData>(`${this.baseUrl}/charts/performance`);
  }

  // Activity and Notifications
  getRecentActivities(limit: number = 10): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.baseUrl}/activities?limit=${limit}`);
  }

  getNotifications(unreadOnly: boolean = false): Observable<Notification[]> {
    const url = unreadOnly ? `${this.baseUrl}/notifications?unread=true` : `${this.baseUrl}/notifications`;
    return this.http.get<Notification[]>(url);
  }

  markNotificationAsRead(notificationId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  markAllNotificationsAsRead(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/notifications/read-all`, {});
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notifications/${notificationId}`);
  }

  // Quick Actions
  getQuickActions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quick-actions`);
  }

  // System Health
  getSystemHealth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/system-health`);
  }

  // KPIs
  getKPIs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/kpis`);
  }

  // Real-time Updates (for WebSocket or Server-Sent Events)
  getRealTimeUpdates(): Observable<any> {
    return new Observable(observer => {
      // This would typically connect to a WebSocket or SSE endpoint
      // For now, we'll simulate with polling
      const interval = setInterval(() => {
        this.getDashboardStats().subscribe(stats => {
          observer.next({ type: 'stats', data: stats });
        });
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    });
  }
}
