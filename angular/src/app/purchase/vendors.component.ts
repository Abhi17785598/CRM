import { Component, OnInit } from '@angular/core';
import { PurchaseService, Vendor } from '../services/purchase.service';

@Component({
  selector: 'app-vendors',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-3">Vendors</h2>
              <p class="text-muted">Manage vendor relationships and performance</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="refreshVendors()">
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
              <button class="btn btn-success" (click)="showCreateForm = true">
                <i class="fas fa-plus me-2"></i>Add Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Vendors</p>
                  <h4 class="mb-0 text-primary">{{ stats.totalVendors }}</h4>
                </div>
                <div class="text-primary">
                  <i class="fas fa-truck fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Active Vendors</p>
                  <h4 class="mb-0 text-success">{{ stats.activeVendors }}</h4>
                </div>
                <div class="text-success">
                  <i class="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Top Rated</p>
                  <h4 class="mb-0 text-warning">{{ stats.topRatedVendors }}</h4>
                </div>
                <div class="text-warning">
                  <i class="fas fa-star fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Categories</p>
                  <h4 class="mb-0 text-info">{{ stats.categories }}</h4>
                </div>
                <div class="text-info">
                  <i class="fas fa-tags fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="selectedCategory" (change)="filterVendors()">
                    <option value="">All Categories</option>
                    <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterVendors()">
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Rating</label>
                  <select class="form-select" [(ngModel)]="selectedRating" (change)="filterVendors()">
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Search</label>
                  <input type="text" class="form-control" placeholder="Search by name or code..." 
                         [(ngModel)]="searchTerm" (input)="filterVendors()">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading vendors...</p>
      </div>

      <!-- Vendors Table -->
      <div *ngIf="!loading" class="card">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Vendor Code</th>
                <th>Vendor Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let vendor of filteredVendors">
                <td><strong>{{ vendor.vendorCode }}</strong></td>
                <td>{{ vendor.vendorName }}</td>
                <td>{{ vendor.contactPerson }}</td>
                <td>{{ vendor.email }}</td>
                <td>{{ vendor.phone }}</td>
                <td>
                  <span class="badge bg-light text-dark">{{ vendor.category }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span class="me-2">{{ getRatingStars(vendor.rating) }}</span>
                    <small class="text-muted">({{ vendor.rating }}/5)</small>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="vendor.isActive ? 'bg-success' : 'bg-danger'">
                    {{ vendor.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewVendor(vendor)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" (click)="editVendor(vendor)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-warning" (click)="toggleStatus(vendor)">
                      <i class="fas fa-toggle-on"></i>
                    </button>
                    <button class="btn btn-outline-danger" (click)="deleteVendor(vendor)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div *ngIf="!loading && filteredVendors.length === 0" class="text-center py-5">
        <i class="fas fa-truck fa-3x text-muted mb-3"></i>
        <h4>No vendors found</h4>
        <p class="text-muted">Try adjusting your filters or add a new vendor.</p>
      </div>
    </div>

    <!-- Create Vendor Modal -->
    <div *ngIf="showCreateForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Vendor</h5>
            <button type="button" class="btn-close" (click)="showCreateForm = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Vendor Code</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.vendorCode" name="vendorCode">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Vendor Name</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.vendorName" name="vendorName">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Contact Person</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.contactPerson" name="contactPerson">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="newVendor.email" name="email">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" [(ngModel)]="newVendor.phone" name="phone">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Tax Number</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.taxNumber" name="taxNumber">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="newVendor.category" name="category">
                    <option value="">Select Category</option>
                    <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Payment Terms</label>
                  <select class="form-select" [(ngModel)]="newVendor.paymentTerms" name="paymentTerms">
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Rating</label>
                  <select class="form-select" [(ngModel)]="newVendor.rating" name="rating">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">Address</label>
                  <textarea class="form-control" [(ngModel)]="newVendor.address" name="address" rows="2"></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3 mb-3">
                  <label class="form-label">City</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.city" name="city">
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">State</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.state" name="state">
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Country</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.country" name="country">
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Postal Code</label>
                  <input type="text" class="form-control" [(ngModel)]="newVendor.postalCode" name="postalCode">
                </div>
              </div>
              <div class="row">
                <div class="col-12 mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="newVendor.isActive" name="isActive">
                    <label class="form-check-label">Active Vendor</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="showCreateForm = false">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveVendor()">Save Vendor</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Professional Component Styles */
    .container-fluid {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 2rem;
      margin: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      min-height: calc(100vh - 2rem);
    }

    .card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 1px solid rgba(102, 126, 234, 0.1);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0 !important;
      border: none;
      padding: 1.25rem;
    }

    .card-body {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 0 0 12px 12px;
    }

    .table {
      background: rgba(255, 255, 255, 0.95);

.table tbody tr:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.01);
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  border: none;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}
    }

    .table tbody tr:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: scale(1.01);
    }

    .modal-content {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 15px;
      border: none;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px 15px 0 0;
      border: none;
    }

    .modal-body {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 0 0 15px 15px;
    }

    .form-control, .form-select {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
      background: rgba(255, 255, 255, 1);
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .btn {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      border: none;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
    }

    .btn-warning {
      background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
      color: white;
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
    }

    .btn-info {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      color: white;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
      color: white;
    }

    .badge {
      border-radius: 6px;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
    }

    .card.border-0 {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 1px solid rgba(102, 126, 234, 0.1) !important;
    }

    .spinner-border {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .alert {
      border-radius: 10px;
      border: none;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }

    .text-muted {
      color: #6c757d !important;
    }

    .text-primary {
      color: #667eea !important;
    }

    .text-success {
      color: #28a745 !important;
    }

    .text-warning {
      color: #ffc107 !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }

    .text-info {
      color: #17a2b8 !important;
    }

    @media (max-width: 768px) {
      .container-fluid {
        padding: 1rem;
        margin: 0.5rem;
      }
      
      .card {
        margin-bottom: 1rem;
      }
    }

    @media (prefers-color-scheme: dark) {
      .container-fluid {
        background: rgba(30, 30, 46, 0.95);
        color: #ffffff;
      }
      
      .card {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        color: #ffffff;
      }
      
      .table {
        background: rgba(45, 55, 72, 0.95);
        color: #ffffff;
      }
      
      .form-control, .form-select {
        background: rgba(45, 55, 72, 0.9);
        color: #ffffff;
        border-color: rgba(102, 126, 234, 0.3);
      }
    }

    * {
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(102, 126, 234, 0.1);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .modal {
      z-index: 1050;
    }
    .modal.show {
      display: block !important;
    }
  `]
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  loading = false;
  showCreateForm = false;

  selectedCategory = '';
  selectedStatus = '';
  selectedRating = '';
  searchTerm = '';

  newVendor: any = {
    vendorCode: '',
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    taxNumber: '',
    paymentTerms: 'Net 30',
    category: '',
    rating: 3,
    isActive: true
  };

  categories = [
    'Technology',
    'Office Supplies',
    'Equipment',
    'Raw Materials',
    'Logistics',
    'Consulting',
    'Maintenance',
    'Manufacturing',
    'Packaging',
    'Services'
  ];

  stats = {
    totalVendors: 0,
    activeVendors: 0,
    topRatedVendors: 0,
    categories: 0
  };

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors() {
    this.loading = true;
    // Extensive mock data for large enterprise client
    setTimeout(() => {
      this.vendors = [
        {
          id: '1',
          vendorCode: 'V001',
          vendorName: 'Tech Solutions Ltd.',
          contactPerson: 'Rajesh Kumar',
          email: 'rajesh@techsolutions.com',
          phone: '+91-80-23456789',
          address: '123 Tech Park, Electronic City',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560100',
          taxNumber: 'GSTN1234567890123',
          paymentTerms: 'Net 30',
          category: 'Technology',
          rating: 5,
          isActive: true,
          createdDate: '2024-01-01',
          updatedDate: '2024-01-01'
        },
        {
          id: '2',
          vendorCode: 'V002',
          vendorName: 'Office Supplies Co.',
          contactPerson: 'Priya Sharma',
          email: 'priya@officesupplies.com',
          phone: '+91-22-345678901',
          address: '456 Business Center, Andheri',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400053',
          taxNumber: 'GSTN2345678901234',
          paymentTerms: 'Net 15',
          category: 'Office Supplies',
          rating: 4,
          isActive: true,
          createdDate: '2024-01-05',
          updatedDate: '2024-01-05'
        },
        {
          id: '3',
          vendorCode: 'V003',
          vendorName: 'Equipment Rental Co.',
          contactPerson: 'Amit Patel',
          email: 'amit@equipmentrental.com',
          phone: '+91-9876543210',
          address: '789 Industrial Area, Gandhinagar',
          city: 'Gandhinagar',
          state: 'Gujarat',
          country: 'India',
          postalCode: '382007',
          taxNumber: 'GSTN3456789012345',
          paymentTerms: 'Net 30',
          category: 'Equipment',
          rating: 4,
          isActive: true,
          createdDate: '2024-01-10',
          updatedDate: '2024-01-10'
        },
        {
          id: '4',
          vendorCode: 'V004',
          vendorName: 'Software Vendor Inc.',
          contactPerson: 'Suresh Reddy',
          email: 'suresh@softwarevendor.com',
          phone: '+91-40-456789012',
          address: '321 Hitech City, Madhapur',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          postalCode: '500081',
          taxNumber: 'GSTN4567890123456',
          paymentTerms: 'Net 45',
          category: 'Technology',
          rating: 5,
          isActive: true,
          createdDate: '2024-01-15',
          updatedDate: '2024-01-15'
        },
        {
          id: '5',
          vendorCode: 'V005',
          vendorName: 'Manufacturing Supplies Ltd.',
          contactPerson: 'Vijay Kumar',
          email: 'vijay@manufacturingsupplies.com',
          phone: '+91-20-567890123',
          address: '654 Industrial Estate, Pimpri',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '411018',
          taxNumber: 'GSTN5678901234567',
          paymentTerms: 'Net 60',
          category: 'Raw Materials',
          rating: 3,
          isActive: true,
          createdDate: '2024-01-20',
          updatedDate: '2024-01-20'
        },
        {
          id: '6',
          vendorCode: 'V006',
          vendorName: 'Logistics Services Corp.',
          contactPerson: 'Anand Verma',
          email: 'anand@logisticscorp.com',
          phone: '+91-44-678901234',
          address: '987 Logistics Hub, Tambaram',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          postalCode: '600045',
          taxNumber: 'GSTN6789012345678',
          paymentTerms: 'Net 15',
          category: 'Logistics',
          rating: 4,
          isActive: true,
          createdDate: '2024-01-25',
          updatedDate: '2024-01-25'
        },
        {
          id: '7',
          vendorCode: 'V007',
          vendorName: 'Consulting Services LLP',
          contactPerson: 'Meera Nair',
          email: 'meera@consultingservices.com',
          phone: '+91-80-789012345',
          address: '147 Business Park, Whitefield',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          postalCode: '560066',
          taxNumber: 'GSTN7890123456789',
          paymentTerms: 'Net 30',
          category: 'Consulting',
          rating: 5,
          isActive: true,
          createdDate: '2024-02-01',
          updatedDate: '2024-02-01'
        },
        {
          id: '8',
          vendorCode: 'V008',
          vendorName: 'Maintenance Services Co.',
          contactPerson: 'Rohit Sharma',
          email: 'rohit@maintenance.com',
          phone: '+91-11-234567890',
          address: '258 Service Center, Nehru Place',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110019',
          taxNumber: 'GSTN8901234567890',
          paymentTerms: 'Net 30',
          category: 'Maintenance',
          rating: 3,
          isActive: true,
          createdDate: '2024-02-05',
          updatedDate: '2024-02-05'
        },
        {
          id: '9',
          vendorCode: 'V009',
          vendorName: 'Raw Materials Suppliers Ltd.',
          contactPerson: 'Karthik Ramesh',
          email: 'karthik@rawmaterials.com',
          phone: '+91-79-456789012',
          address: '369 Industrial Zone, GIDC',
          city: 'Vadodara',
          state: 'Gujarat',
          country: 'India',
          postalCode: '391760',
          taxNumber: 'GSTN9012345678901',
          paymentTerms: 'Net 45',
          category: 'Raw Materials',
          rating: 4,
          isActive: true,
          createdDate: '2024-02-10',
          updatedDate: '2024-02-10'
        },
        {
          id: '10',
          vendorCode: 'V010',
          vendorName: 'Packaging Solutions Inc.',
          contactPerson: 'Deepak Kumar',
          email: 'deepak@packagingsolutions.com',
          phone: '+91-120-4567890',
          address: '741 Packaging Estate, Noida',
          city: 'Noida',
          state: 'Uttar Pradesh',
          country: 'India',
          postalCode: '201301',
          taxNumber: 'GSTN0123456789012',
          paymentTerms: 'Net 30',
          category: 'Packaging',
          rating: 4,
          isActive: true,
          createdDate: '2024-02-15',
          updatedDate: '2024-02-15'
        },
        {
          id: '11',
          vendorCode: 'V011',
          vendorName: 'Safety Equipment Co.',
          contactPerson: 'Sanjay Gupta',
          email: 'sanjay@safetyequipment.com',
          phone: '+91-33-345678901',
          address: '852 Safety Zone, Salt Lake',
          city: 'Kolkata',
          state: 'West Bengal',
          country: 'India',
          postalCode: '700091',
          taxNumber: 'GSTN1234567890123',
          paymentTerms: 'Net 30',
          category: 'Equipment',
          rating: 3,
          isActive: false,
          createdDate: '2024-02-20',
          updatedDate: '2024-02-20'
        }
      ];
      this.filteredVendors = this.vendors;
      this.calculateStats();
      this.loading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats = {
      totalVendors: this.vendors.length,
      activeVendors: this.vendors.filter(v => v.isActive).length,
      topRatedVendors: this.vendors.filter(v => v.rating >= 4).length,
      categories: new Set(this.vendors.map(v => v.category)).size
    };
  }

  filterVendors() {
    this.filteredVendors = this.vendors.filter(vendor => {
      const categoryMatch = !this.selectedCategory || vendor.category === this.selectedCategory;
      const statusMatch = this.selectedStatus === '' || vendor.isActive.toString() === this.selectedStatus;
      const ratingMatch = !this.selectedRating || vendor.rating >= parseInt(this.selectedRating);
      const searchMatch = !this.searchTerm || 
        vendor.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vendor.vendorCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return categoryMatch && statusMatch && ratingMatch && searchMatch;
    });
  }

  refreshVendors() {
    this.loadVendors();
  }

  saveVendor() {
    const vendor: Vendor = {
      id: Date.now().toString(),
      vendorCode: this.newVendor.vendorCode || `V${String(this.vendors.length + 1).padStart(3, '0')}`,
      vendorName: this.newVendor.vendorName,
      contactPerson: this.newVendor.contactPerson,
      email: this.newVendor.email,
      phone: this.newVendor.phone,
      address: this.newVendor.address,
      city: this.newVendor.city,
      state: this.newVendor.state,
      country: this.newVendor.country,
      postalCode: this.newVendor.postalCode,
      taxNumber: this.newVendor.taxNumber,
      paymentTerms: this.newVendor.paymentTerms,
      category: this.newVendor.category,
      rating: this.newVendor.rating,
      isActive: this.newVendor.isActive,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    this.vendors.unshift(vendor);
    this.filteredVendors = this.vendors;
    this.calculateStats();
    this.showCreateForm = false;
    
    // Reset form
    this.newVendor = {
      vendorCode: '',
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      taxNumber: '',
      paymentTerms: 'Net 30',
      category: '',
      rating: 3,
      isActive: true
    };
  }

  viewVendor(vendor: Vendor) {
    alert(`Viewing vendor: ${vendor.vendorName}\nContact: ${vendor.contactPerson}\nEmail: ${vendor.email}\nPhone: ${vendor.phone}\nCategory: ${vendor.category}\nRating: ${vendor.rating}/5`);
  }

  editVendor(vendor: Vendor) {
    alert(`Editing vendor: ${vendor.vendorName}`);
  }

  toggleStatus(vendor: Vendor) {
    vendor.isActive = !vendor.isActive;
    alert(`Vendor ${vendor.vendorName} is now ${vendor.isActive ? 'Active' : 'Inactive'}`);
    this.calculateStats();
  }

  deleteVendor(vendor: Vendor) {
    if (confirm(`Are you sure you want to delete vendor ${vendor.vendorName}?`)) {
      const index = this.vendors.findIndex(v => v.id === vendor.id);
      if (index > -1) {
        this.vendors.splice(index, 1);
        this.filteredVendors = this.vendors;
        alert(`Vendor ${vendor.vendorName} deleted successfully!`);
      }
    }
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}
