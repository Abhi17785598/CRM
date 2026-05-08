import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerDto, CustomerType, CustomerStatus } from '../../models/crm.models';
import { CsvExportService } from '../../services/csv-export.service';
import { CrmService } from '../../services/crm.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Static data that persists across component instances
let staticCustomers: CustomerDto[] = [
  {
    id: '1',
    customerCode: 'CUST-001',
    companyName: 'Tech Solutions Inc.',
    industry: 'Technology',
    contactPerson: 'John Smith',
    email: 'john.smith@techsolutions.com',
    phone: '+1-555-0101',
    mobile: '+1-555-0102',
    address: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    postalCode: '94105',
    website: 'www.techsolutions.com',
    gstNumber: 'GST123456789',
    panNumber: 'ABCDE1234F',
    customerType: CustomerType.Business,
    status: CustomerStatus.Active,
    creditLimit: 50000,
    currentBalance: 15000,
    paymentTerms: 'Net 30',
    notes: 'Premium customer with regular orders',
    assignedTo: 'Sales Team A',
    isOverdue: false,
    needsFollowUp: false
  },
  {
    id: '2',
    customerCode: 'CUST-002',
    companyName: 'Manufacturing Co.',
    industry: 'Manufacturing',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.j@manufacturingco.com',
    phone: '+1-555-0201',
    mobile: '+1-555-0202',
    address: '456 Industrial Ave',
    city: 'Detroit',
    state: 'MI',
    country: 'USA',
    postalCode: '48201',
    website: 'www.manufacturingco.com',
    gstNumber: 'GST987654321',
    panNumber: 'FGHIJ5678K',
    customerType: CustomerType.Business,
    status: CustomerStatus.Active,
    creditLimit: 75000,
    currentBalance: 62000,
    paymentTerms: 'Net 45',
    notes: 'Large volume customer, priority support',
    assignedTo: 'Sales Team B',
    isOverdue: true,
    needsFollowUp: true
  },
  {
    id: '3',
    customerCode: 'CUST-003',
    companyName: 'Retail Store LLC',
    industry: 'Retail',
    contactPerson: 'Michael Brown',
    email: 'michael.brown@retailstore.com',
    phone: '+1-555-0301',
    mobile: '+1-555-0302',
    address: '789 Market Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postalCode: '10001',
    website: 'www.retailstore.com',
    gstNumber: 'GST456789123',
    panNumber: 'KLMNO9012P',
    customerType: CustomerType.Business,
    status: CustomerStatus.Inactive,
    creditLimit: 25000,
    currentBalance: 0,
    paymentTerms: 'Net 15',
    notes: 'Seasonal customer, inactive during winter',
    assignedTo: 'Sales Team C',
    isOverdue: false,
    needsFollowUp: false
  },
  {
    id: '4',
    customerCode: 'CUST-004',
    companyName: 'Consulting Group',
    industry: 'Consulting',
    contactPerson: 'Emily Davis',
    email: 'emily.davis@consultinggroup.com',
    phone: '+1-555-0401',
    mobile: '+1-555-0402',
    address: '321 Business Park',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    postalCode: '60601',
    website: 'www.consultinggroup.com',
    gstNumber: 'GST789123456',
    panNumber: 'PQRST3456Q',
    customerType: CustomerType.Business,
    status: CustomerStatus.Active,
    creditLimit: 100000,
    currentBalance: 35000,
    paymentTerms: 'Net 60',
    notes: 'High-value consulting services client',
    assignedTo: 'Sales Team A',
    isOverdue: false,
    needsFollowUp: false
  }
];

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: CustomerDto[] = [];
  selectedCustomer: CustomerDto | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newCustomer: Partial<CustomerDto> = {
    customerCode: '',
    companyName: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    gstNumber: '',
    panNumber: '',
    customerType: CustomerType.Business,
    status: CustomerStatus.Active,
    creditLimit: 0,
    currentBalance: 0,
    paymentTerms: '',
    notes: '',
    assignedTo: '',
    isOverdue: false,
    needsFollowUp: false
  };

  // Expose enums to template
  public CustomerType = CustomerType;
  public CustomerStatus = CustomerStatus;

  constructor(private csvExportService: CsvExportService, private crmService: CrmService, private router: Router) { }

  ngOnInit(): void {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Also scroll to top on navigation events
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
    
    this.loadCustomersFromDatabase();
  }

  loadCustomersFromDatabase(): void {
    console.log('🔄 Loading customers from AppCustomers table...');
    console.log('🔗 API URL:', this.crmService['baseUrl']);
    
    // First test connection
    this.crmService.testConnection().subscribe({
      next: (testResult) => {
        console.log('✅ CRM API connection test successful:', testResult);
        this.fetchCustomers();
      },
      error: (testError) => {
        console.error('❌ CRM API connection test failed:', testError);
        console.log('🔄 Trying to fetch customers directly...');
        this.fetchCustomers();
      }
    });
  }

  fetchCustomers(): void {
    this.crmService.getAppCustomers().subscribe({
      next: (response) => {
        console.log('📥 Raw API response:', response);
        
        let customerData = [];
        
        // Handle new response format with data property
        if (response && response.data && Array.isArray(response.data)) {
          customerData = response.data;
        } else if (Array.isArray(response)) {
          customerData = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          customerData = response.items;
        } else if (response && typeof response === 'object') {
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              customerData = response[key];
              break;
            }
          }
        }
        
        console.log('📥 Total customers loaded:', customerData.length);
        
        if (customerData.length === 0) {
          console.log('⚠️ No customer data found, using static data');
          this.customers = [...staticCustomers];
          this.updateCustomerStatus();
          return;
        }
        
        // Map database data to CustomerDto format
        this.customers = customerData.map((item: any) => ({
          id: item.id,
          customerCode: item.customerCode || '',
          companyName: item.companyName || '',
          industry: item.industry || '',
          contactPerson: item.contactPerson || '',
          email: item.email || '',
          phone: item.phone || '',
          mobile: item.mobile || '',
          address: item.address || '',
          city: item.city || '',
          state: item.state || '',
          country: item.country || '',
          postalCode: item.postalCode || '',
          website: item.website || '',
          gstNumber: item.gstNumber || '',
          panNumber: item.panNumber || '',
          customerType: item.customerType === 1 ? CustomerType.Business : 
                       item.customerType === 0 ? CustomerType.Individual : 
                       item.customerType === 2 ? CustomerType.Government : CustomerType.Business,
          status: item.status === 0 ? CustomerStatus.Active : 
                  item.status === 1 ? CustomerStatus.Inactive : 
                  item.status === 2 ? CustomerStatus.Prospect : CustomerStatus.Active,
          creditLimit: item.creditLimit || 0,
          currentBalance: item.currentBalance || 0,
          paymentTerms: item.paymentTerms || '',
          notes: item.notes || '',
          lastContactDate: item.lastContactDate ? new Date(item.lastContactDate) : undefined,
          nextFollowUpDate: item.nextFollowUpDate ? new Date(item.nextFollowUpDate) : undefined,
          assignedTo: item.assignedTo || '',
          isOverdue: false,
          needsFollowUp: false
        }));
        
        this.updateCustomerStatus();
        console.log('✅ Customers loaded successfully:', this.customers.length);
      },
      error: (error) => {
        console.error('❌ Error loading customers:', error);
        console.log('🔄 API failed - using static data');
        // Fallback to static data if API fails
        this.customers = [...staticCustomers];
        this.updateCustomerStatus();
      }
    });
  }

  updateCustomerStatus(): void {
    this.customers.forEach(customer => {
      customer.isOverdue = customer.currentBalance > (customer.creditLimit * 0.8);
      customer.needsFollowUp = customer.status === CustomerStatus.Active && customer.isOverdue;
    });
  }

  getStatusText(status: CustomerStatus): string {
    switch (status) {
      case CustomerStatus.Active: return 'Active';
      case CustomerStatus.Inactive: return 'Inactive';
      case CustomerStatus.Prospect: return 'Prospect';
      case CustomerStatus.Lost: return 'Lost';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: CustomerStatus): string {
    switch (status) {
      case CustomerStatus.Active: return 'badge-success';
      case CustomerStatus.Inactive: return 'badge-secondary';
      case CustomerStatus.Prospect: return 'badge-primary';
      case CustomerStatus.Lost: return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getTypeText(type: CustomerType): string {
    switch (type) {
      case CustomerType.Business: return 'Business';
      case CustomerType.Individual: return 'Individual';
      case CustomerType.Government: return 'Government';
      default: return 'Unknown';
    }
  }

  getBalanceStatusClass(customer: CustomerDto): string {
    if (customer.isOverdue) return 'text-danger fw-bold';
    if (customer.currentBalance > (customer.creditLimit * 0.7)) return 'text-warning fw-bold';
    return 'text-success';
  }

  selectCustomer(customer: CustomerDto): void {
    console.log('Selecting customer:', customer);
    this.selectedCustomer = customer;
  }

  createCustomer(): void {
    console.log('Creating customer:', this.newCustomer);
    if (this.newCustomer.customerCode && this.newCustomer.companyName && this.newCustomer.contactPerson) {
      const customer: CustomerDto = {
        id: Date.now().toString(),
        customerCode: this.newCustomer.customerCode || '',
        companyName: this.newCustomer.companyName || '',
        industry: this.newCustomer.industry || '',
        contactPerson: this.newCustomer.contactPerson || '',
        email: this.newCustomer.email || '',
        phone: this.newCustomer.phone || '',
        mobile: this.newCustomer.mobile || '',
        address: this.newCustomer.address || '',
        city: this.newCustomer.city || '',
        state: this.newCustomer.state || '',
        country: this.newCustomer.country || '',
        postalCode: this.newCustomer.postalCode || '',
        website: this.newCustomer.website || '',
        gstNumber: this.newCustomer.gstNumber || '',
        panNumber: this.newCustomer.panNumber || '',
        customerType: this.newCustomer.customerType || CustomerType.Business,
        status: this.newCustomer.status || CustomerStatus.Active,
        creditLimit: this.newCustomer.creditLimit || 0,
        currentBalance: this.newCustomer.currentBalance || 0,
        paymentTerms: this.newCustomer.paymentTerms || '',
        notes: this.newCustomer.notes || '',
        assignedTo: this.newCustomer.assignedTo || '',
        isOverdue: false,
        needsFollowUp: false
      };
      
      this.customers.push(customer);
      staticCustomers.push(customer);
      this.updateCustomerStatus();
      this.showCreateForm = false;
      this.resetForm();
      console.log('Customer created successfully:', customer);
    }
  }

  updateCustomer(): void {
    console.log('Updating customer:', this.newCustomer);
    if (this.selectedCustomer && this.newCustomer.companyName && this.newCustomer.contactPerson) {
      Object.assign(this.selectedCustomer, this.newCustomer);
      
      // Update static data
      const staticCustomer = staticCustomers.find(c => c.id === this.selectedCustomer!.id);
      if (staticCustomer) {
        Object.assign(staticCustomer, this.newCustomer);
      }
      
      this.updateCustomerStatus();
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Customer updated successfully:', this.selectedCustomer);
    }
  }

  deleteCustomer(customerId: string): void {
    console.log('Deleting customer:', customerId);
    this.customers = this.customers.filter(c => c.id !== customerId);
    staticCustomers = staticCustomers.filter(c => c.id !== customerId);
    if (this.selectedCustomer?.id === customerId) {
      this.selectedCustomer = null;
    }
    console.log('Customer deleted successfully');
  }

  editCustomer(customer: CustomerDto): void {
    console.log('Editing customer:', customer);
    this.selectedCustomer = customer;
    this.newCustomer = { ...customer };
    this.showUpdateForm = true;
  }

  exportCustomers(): void {
    const headers = [
      'Customer Code',
      'Company Name',
      'Industry',
      'Contact Person',
      'Email',
      'Phone',
      'Mobile',
      'Address',
      'City',
      'State',
      'Country',
      'Postal Code',
      'Website',
      'GST Number',
      'PAN Number',
      'Customer Type',
      'Status',
      'Credit Limit',
      'Current Balance',
      'Payment Terms',
      'Assigned To',
      'Notes'
    ];
    
    const data = this.customers.map(customer => ({
      customerCode: customer.customerCode,
      companyName: customer.companyName,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      industry: customer.industry,
      status: this.getStatusText(customer.status),
      creditLimit: customer.creditLimit,
      currentBalance: customer.currentBalance,
      paymentTerms: customer.paymentTerms,
      assignedTo: customer.assignedTo,
      notes: customer.notes
    }));
    
    const filename = this.csvExportService.getTimestampedFilename('customers');
    this.csvExportService.exportToCsv(data, filename, headers);
  }

  resetForm(): void {
    this.newCustomer = {
      customerCode: '',
      companyName: '',
      industry: '',
      contactPerson: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      website: '',
      gstNumber: '',
      panNumber: '',
      customerType: CustomerType.Business,
      status: CustomerStatus.Active,
      creditLimit: 0,
      currentBalance: 0,
      paymentTerms: '',
      notes: '',
      assignedTo: '',
      isOverdue: false,
      needsFollowUp: false
    };
  }

  createDeliveryForCustomer(customer: any) {
    // Store customer data in localStorage for logistics component to pick up
    const deliveryData = {
      customer: customer,
      timestamp: new Date().toISOString()
    };
    
    // Get existing delivery data or create new array
    const existingData = localStorage.getItem('erp_delivery_customers');
    const deliveryCustomers = existingData ? JSON.parse(existingData) : [];
    deliveryCustomers.push(deliveryData);
    
    // Save to localStorage
    localStorage.setItem('erp_delivery_customers', JSON.stringify(deliveryCustomers));
    
    // Navigate to logistics page
    this.router.navigate(['/logistics']);
  }
}