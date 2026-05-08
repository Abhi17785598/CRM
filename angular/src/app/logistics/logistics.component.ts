import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrmService, Customer, Lead, SalesOpportunity } from '../services/crm.service';
import { CustomerDto } from '../models/crm.models';
import { ProductService, Product } from '../services/product.service';

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
  }>;
  quantity: number;
  transporterName: string;
  vehicleNumber: string;
  dispatchDate: string;
  status: 'planned' | 'dispatched' | 'in-transit' | 'delivered';
  createdAt: string;
}

export interface CreateDeliveryModal {
  isVisible: boolean;
  selectedOrder: Customer | Lead | SalesOpportunity | any;
  transporterName: string;
  vehicleNumber: string;
  dispatchDate: string;
}

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.scss']
})
export class LogisticsComponent implements OnInit {
  customers: Customer[] = [];
  leads: Lead[] = [];
  opportunities: SalesOpportunity[] = [];
  products: Product[] = [];
  deliveries: Delivery[] = [];
  loading = false;
  error = '';

  // Modal state
  createDeliveryModal: CreateDeliveryModal = {
    isVisible: false,
    selectedOrder: null,
    transporterName: '',
    vehicleNumber: '',
    dispatchDate: ''
  };

  constructor(
    private crmService: CrmService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadDeliveriesFromStorage();
    this.loadDeliveryCustomersFromStorage();
  }

  loadData() {
    this.loading = true;
    
    // Use mock data instead of API calls for demo purposes
    setTimeout(() => {
      // Mock CRM data
      this.customers = [
        {
          id: '1',
          name: 'Tech Solutions Inc.',
          email: 'contact@techsolutions.com',
          phone: '+1-555-0101',
          company: 'Tech Solutions Inc.',
          address: '123 Tech Street',
          city: 'San Francisco',
          country: 'USA',
          status: 'active',
          totalOrders: 15,
          totalRevenue: 150000,
          lastOrderDate: new Date().toISOString(),
          createdDate: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Manufacturing Co.',
          email: 'info@manufacturing.com',
          phone: '+1-555-0102',
          company: 'Manufacturing Co.',
          address: '456 Industry Ave',
          city: 'Chicago',
          country: 'USA',
          status: 'active',
          totalOrders: 8,
          totalRevenue: 80000,
          lastOrderDate: new Date().toISOString(),
          createdDate: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Retail Store LLC',
          email: 'hello@retailstore.com',
          phone: '+1-555-0103',
          company: 'Retail Store LLC',
          address: '789 Commerce Blvd',
          city: 'New York',
          country: 'USA',
          status: 'prospect',
          totalOrders: 0,
          totalRevenue: 0,
          lastOrderDate: new Date().toISOString(),
          createdDate: new Date().toISOString()
        }
      ];

      this.leads = [
        {
          id: '4',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0104',
          company: 'Smith Enterprises',
          status: 'new',
          source: 'Website',
          estimatedValue: 25000,
          probability: 60,
          expectedCloseDate: new Date().toISOString(),
          assignedTo: 'Sales Team',
          notes: 'Interested in enterprise solution',
          createdDate: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Sarah Johnson',
          email: 'sarah.j@business.com',
          phone: '+1-555-0105',
          company: 'Johnson Corp',
          status: 'qualified',
          source: 'Referral',
          estimatedValue: 35000,
          probability: 80,
          expectedCloseDate: new Date().toISOString(),
          assignedTo: 'Sales Team',
          notes: 'Ready for proposal',
          createdDate: new Date().toISOString()
        }
      ];

      this.opportunities = [
        {
          id: '6',
          customerId: '1',
          customerName: 'Tech Solutions Inc.',
          title: 'Enterprise Software Package',
          description: 'Complete ERP solution for large enterprise',
          stage: 'proposal',
          value: 100000,
          probability: 75,
          expectedCloseDate: new Date().toISOString(),
          assignedTo: 'Sales Team',
          products: ['ERP Software', 'Training', 'Support'],
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        }
      ];

      this.products = [
        {
          id: '1',
          sku: 'ERP-001',
          name: 'ERP Software Package',
          description: 'Complete enterprise resource planning solution',
          category: 'Software',
          subcategory: 'Enterprise Software',
          brand: 'TechCorp',
          unit: 'license',
          price: 50000,
          cost: 20000,
          weight: 0,
          dimensions: {
            length: 0,
            width: 0,
            height: 0
          },
          barcode: '1234567890123',
          qrCode: 'QR-ERP-001',
          images: [],
          specifications: [],
          status: 'active',
          minStockLevel: 1,
          maxStockLevel: 100,
          reorderPoint: 10,
          leadTime: 7,
          supplier: 'TechCorp Software',
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        },
        {
          id: '2',
          sku: 'SRV-001',
          name: 'Training Services',
          description: 'On-site training and implementation',
          category: 'Services',
          subcategory: 'Training',
          brand: 'TechCorp',
          unit: 'session',
          price: 15000,
          cost: 5000,
          weight: 0,
          dimensions: {
            length: 0,
            width: 0,
            height: 0
          },
          barcode: '1234567890124',
          qrCode: 'QR-SRV-001',
          images: [],
          specifications: [],
          status: 'active',
          minStockLevel: 1,
          maxStockLevel: 50,
          reorderPoint: 5,
          leadTime: 3,
          supplier: 'TechCorp Services',
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        }
      ];

      this.loading = false;
      console.log('✅ Mock data loaded successfully');
    }, 1000);
  }

  loadDeliveryCustomersFromStorage() {
    const stored = localStorage.getItem('erp_delivery_customers');
    if (stored) {
      try {
        const deliveryCustomers = JSON.parse(stored);
        // Add the stored customers to available orders
        deliveryCustomers.forEach((dc: any) => {
          if (dc.customer && !this.customers.find((c: Customer) => c.id === dc.customer.id)) {
            this.customers.push(dc.customer as Customer);
          }
        });
      } catch (error) {
        console.error('Error loading delivery customers from storage:', error);
      }
    }
  }

  loadDeliveriesFromStorage() {
    const stored = localStorage.getItem('erp_deliveries');
    if (stored) {
      try {
        this.deliveries = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading deliveries from storage:', error);
      }
    }
  }

  saveDeliveriesToStorage() {
    localStorage.setItem('erp_deliveries', JSON.stringify(this.deliveries));
  }

  openCreateDeliveryModal(order: Customer | Lead | SalesOpportunity) {
    this.createDeliveryModal.selectedOrder = order;
    this.createDeliveryModal.isVisible = true;
  }

  closeCreateDeliveryModal() {
    this.createDeliveryModal.isVisible = false;
    this.createDeliveryModal.selectedOrder = null;
    this.createDeliveryModal.transporterName = '';
    this.createDeliveryModal.vehicleNumber = '';
    this.createDeliveryModal.dispatchDate = '';
  }

  createDelivery() {
    if (!this.createDeliveryModal.selectedOrder || !this.createDeliveryModal.transporterName || !this.createDeliveryModal.vehicleNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const delivery: Delivery = {
      id: Date.now().toString(),
      orderId: this.createDeliveryModal.selectedOrder.id,
      orderNumber: this.getOrderNumber(this.createDeliveryModal.selectedOrder),
      customerName: this.getCustomerName(this.createDeliveryModal.selectedOrder),
      products: this.getOrderProducts(this.createDeliveryModal.selectedOrder),
      quantity: 1,
      transporterName: this.createDeliveryModal.transporterName,
      vehicleNumber: this.createDeliveryModal.vehicleNumber,
      dispatchDate: this.createDeliveryModal.dispatchDate,
      status: 'planned',
      createdAt: new Date().toISOString()
    };

    this.deliveries.push(delivery);
    this.saveDeliveriesToStorage();
    this.closeCreateDeliveryModal();
  }

  updateDeliveryStatus(deliveryId: string, newStatus: Delivery['status']) {
    const delivery = this.deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      delivery.status = newStatus;
      this.saveDeliveriesToStorage();
    }
  }

  deleteDelivery(deliveryId: string) {
    this.deliveries = this.deliveries.filter(d => d.id !== deliveryId);
    this.saveDeliveriesToStorage();
  }

  getStatusBadgeClass(status: Delivery['status']): string {
    switch (status) {
      case 'planned': return 'badge-secondary';
      case 'dispatched': return 'badge-primary';
      case 'in-transit': return 'badge-warning';
      case 'delivered': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: Delivery['status']): string {
    switch (status) {
      case 'planned': return 'Planned';
      case 'dispatched': return 'Dispatched';
      case 'in-transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  }

  canUpdateStatus(currentStatus: Delivery['status'], targetStatus: Delivery['status']): boolean {
    // Define status flow: planned -> dispatched -> in-transit -> delivered
    const statusFlow = ['planned', 'dispatched', 'in-transit', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const targetIndex = statusFlow.indexOf(targetStatus);
    return targetIndex === currentIndex + 1;
  }

  getAvailableOrders(): (Customer | Lead | SalesOpportunity)[] {
    // Combine all available orders that don't have existing deliveries
    const allOrders = [...this.customers, ...this.leads, ...this.opportunities];
    const deliveredOrderIds = this.deliveries.map(d => d.orderId);
    return allOrders.filter(order => !deliveredOrderIds.includes(order.id));
  }

  getOrderNumber(order: Customer | Lead | SalesOpportunity | any): string {
    if ('name' in order) {
      return 'CUST-' + order.id;
    } else if ('leadNumber' in order) {
      return 'LEAD-' + order.id;
    } else {
      return 'OPP-' + order.id;
    }
  }

  getCustomerName(order: Customer | Lead | SalesOpportunity | any): string {
    if ('name' in order) {
      return (order as any).name;
    } else if ('contactPerson' in order) {
      return (order as any).contactPerson || (order as any).companyName || 'Unknown Customer';
    } else {
      return (order as any).customerName || 'Unknown Customer';
    }
  }

  getOrderProducts(order: Customer | Lead | SalesOpportunity | any): Array<{ name: string; quantity: number }> {
    // For demo purposes, create mock product data based on order type
    if ('totalOrders' in order) {
      return [
        { name: 'Product Package A', quantity: Math.floor(Math.random() * 10) + 1 },
        { name: 'Service Package B', quantity: Math.floor(Math.random() * 5) + 1 }
      ];
    } else if ('estimatedValue' in order) {
      return [
        { name: 'Consulting Service', quantity: 1 }
      ];
    } else {
      return [
        { name: 'Product Package C', quantity: Math.floor(Math.random() * 8) + 1 }
      ];
    }
  }

  getOrderQuantity(order: Customer | Lead | SalesOpportunity | any): number {
    const products = this.getOrderProducts(order);
    return products.reduce((total, product) => total + product.quantity, 0);
  }

  navigateToOrders() {
    this.router.navigate(['/crm']);
  }

  navigateToCustomer(customerId: string) {
    this.router.navigate(['/crm/customers'], { fragment: customerId });
  }
}
