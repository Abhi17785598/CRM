import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  module?: string;
  actionUrl?: string;
}

export interface ActivityItem {
  id: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
  user?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private activities = new BehaviorSubject<ActivityItem[]>([]);
  
  notifications$ = this.notifications.asObservable();
  activities$ = this.activities.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initial notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        title: 'Low Stock Alert',
        message: 'Aluminum Sheets (ALM-002) is running low on stock',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: false,
        module: 'Manufacturing',
        actionUrl: '/manufacturing/inventory'
      },
      {
        id: '2',
        title: 'Payment Overdue',
        message: 'Manufacturing Co. has overdue payment of ₹62,000',
        type: 'error',
        timestamp: new Date(Date.now() - 120 * 60000),
        read: false,
        module: 'CRM',
        actionUrl: '/crm/customers'
      },
      {
        id: '3',
        title: 'Production Order Completed',
        message: 'PO-003 (Copper Pipes) has been completed successfully',
        type: 'success',
        timestamp: new Date(Date.now() - 240 * 60000),
        read: true,
        module: 'Manufacturing',
        actionUrl: '/manufacturing/production-orders'
      },
      {
        id: '4',
        title: 'New Lead Assigned',
        message: 'You have been assigned a new lead: Retail Store LLC',
        type: 'info',
        timestamp: new Date(Date.now() - 360 * 60000),
        read: true,
        module: 'CRM',
        actionUrl: '/crm/leads'
      }
    ];

    // Initial activities
    const initialActivities: ActivityItem[] = [
      {
        id: '1',
        description: 'New customer added: Tech Solutions Inc.',
        timestamp: new Date(Date.now() - 2 * 60000),
        icon: 'fas fa-plus-circle',
        color: 'text-success',
        user: 'John Smith'
      },
      {
        id: '2',
        description: 'Production order started: Steel Beams - ₹500 units - In Progress',
        timestamp: new Date(Date.now() - 15 * 60000),
        icon: 'fas fa-cogs',
        color: 'text-primary',
        user: 'System'
      },
      {
        id: '3',
        description: 'Employee hired: Michael Brown',
        timestamp: new Date(Date.now() - 60 * 60000),
        icon: 'fas fa-user-plus',
        color: 'text-info',
        user: 'Sarah Johnson'
      },
      {
        id: '4',
        description: 'Lead converted: Manufacturing Co.',
        timestamp: new Date(Date.now() - 120 * 60000),
        icon: 'fas fa-handshake',
        color: 'text-warning',
        user: 'John Smith'
      },
      {
        id: '5',
        description: 'Payslip generated for all employees',
        timestamp: new Date(Date.now() - 180 * 60000),
        icon: 'fas fa-file-invoice-dollar',
        color: 'text-success',
        user: 'System'
      }
    ];

    this.notifications.next(initialNotifications);
    this.activities.next(initialActivities);
  }

  // Add new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const currentNotifications = this.notifications.value;
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.next([newNotification, ...currentNotifications]);
  }

  // Add activity
  addActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>) {
    const currentActivities = this.activities.value;
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    this.activities.next([newActivity, ...currentActivities.slice(0, 9)]); // Keep only 10 recent activities
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifications.next(updatedNotifications);
  }

  // Mark all notifications as read
  markAllAsRead() {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notifications.next(updatedNotifications);
  }

  // Delete notification
  deleteNotification(notificationId: string) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
    this.notifications.next(updatedNotifications);
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  // Generate system notifications based on events
  generateSystemNotification(event: string, data: any) {
    switch (event) {
      case 'low_stock':
        this.addNotification({
          title: 'Low Stock Alert',
          message: `${data.itemName} is running low on stock (${data.currentStock} remaining)`,
          type: 'warning',
          module: 'Manufacturing',
          actionUrl: '/manufacturing/inventory'
        });
        break;
      
      case 'payment_overdue':
        this.addNotification({
          title: 'Payment Overdue',
          message: `${data.customerName} has overdue payment of ₹${data.amount.toLocaleString()}`,
          type: 'error',
          module: 'CRM',
          actionUrl: '/crm/customers'
        });
        break;
      
      case 'order_completed':
        this.addNotification({
          title: 'Production Order Completed',
          message: `${data.orderNumber} (${data.productName}) has been completed successfully`,
          type: 'success',
          module: 'Manufacturing',
          actionUrl: '/manufacturing/production-orders'
        });
        break;
      
      case 'new_lead':
        this.addNotification({
          title: 'New Lead Assigned',
          message: `You have been assigned a new lead: ${data.customerName}`,
          type: 'info',
          module: 'CRM',
          actionUrl: '/crm/leads'
        });
        break;
    }
  }

  // Generate activity based on user actions
  logActivity(description: string, icon: string = 'fas fa-circle', color: string = 'text-info', user?: string) {
    this.addActivity({
      description,
      icon,
      color,
      user
    });
  }
}
