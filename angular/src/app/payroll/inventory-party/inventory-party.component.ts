import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventory-party',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventory-party.component.html',
  styleUrls: ['./inventory-party.component.scss']
})
export class InventoryPartyComponent implements OnInit {
  parties: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;
  searchTerm: string = '';
  filteredParties: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadParties();
  }

  loadParties(): void {
    this.loading = true;
    
    // Mock data for inventory parties - replace with actual API call
    const mockParties = [
      {
        id: 1,
        partyCode: 'PART001',
        partyName: 'ABC Suppliers',
        contactPerson: 'John Smith',
        email: 'john@abcsuppliers.com',
        phone: '+1-555-0101',
        address: '123 Supplier St, City, State 12345',
        category: 'Supplier',
        status: 'Active',
        balance: 25000.00,
        lastTransaction: new Date('2024-01-15'),
        createdAt: new Date('2023-01-01')
      },
      {
        id: 2,
        partyCode: 'PART002',
        partyName: 'XYZ Distributors',
        contactPerson: 'Jane Doe',
        email: 'jane@xyzdistributors.com',
        phone: '+1-555-0102',
        address: '456 Distribution Ave, City, State 67890',
        category: 'Distributor',
        status: 'Active',
        balance: -15000.00,
        lastTransaction: new Date('2024-01-14'),
        createdAt: new Date('2023-02-15')
      },
      {
        id: 3,
        partyCode: 'PART003',
        partyName: 'Retail Solutions Inc',
        contactPerson: 'Mike Johnson',
        email: 'mike@retailsolutions.com',
        phone: '+1-555-0103',
        address: '789 Retail Blvd, City, State 11111',
        category: 'Customer',
        status: 'Active',
        balance: 35000.00,
        lastTransaction: new Date('2024-01-13'),
        createdAt: new Date('2023-03-20')
      },
      {
        id: 4,
        partyCode: 'PART004',
        partyName: 'Manufacturing Co',
        contactPerson: 'Sarah Wilson',
        email: 'sarah@manufacturingco.com',
        phone: '+1-555-0104',
        address: '321 Factory Rd, City, State 22222',
        category: 'Manufacturer',
        status: 'Inactive',
        balance: 0.00,
        lastTransaction: new Date('2023-12-01'),
        createdAt: new Date('2023-04-10')
      }
    ];

    setTimeout(() => {
      this.parties = mockParties;
      this.filteredParties = [...this.parties];
      this.totalPages = Math.ceil(this.filteredParties.length / this.pageSize);
      this.loading = false;
      console.log('✅ Inventory parties loaded:', this.parties.length);
    }, 1000);
  }

  searchParties(): void {
    if (!this.searchTerm) {
      this.filteredParties = [...this.parties];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredParties = this.parties.filter(party => 
        party.partyCode.toLowerCase().includes(term) ||
        party.partyName.toLowerCase().includes(term) ||
        party.contactPerson.toLowerCase().includes(term) ||
        party.email.toLowerCase().includes(term) ||
        party.category.toLowerCase().includes(term)
      );
    }
    
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredParties.length / this.pageSize);
  }

  getStatusText(status: string): string {
    return status || 'Unknown';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  getCategoryClass(category: string): string {
    switch (category?.toLowerCase()) {
      case 'supplier':
        return 'badge-info';
      case 'customer':
        return 'badge-primary';
      case 'distributor':
        return 'badge-warning';
      case 'manufacturer':
        return 'badge-dark';
      default:
        return 'badge-secondary';
    }
  }

  get paginatedParties(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredParties.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginatedEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredParties.length);
  }

  getPaginatedStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  deleteParty(party: any): void {
    if (confirm(`Are you sure you want to delete ${party.partyName}?`)) {
      // Implement delete logic
      console.log('Deleting party:', party.partyName);
    }
  }

  exportToCSV(): void {
    const csvData = this.filteredParties.map(party => ({
      'Party Code': party.partyCode,
      'Party Name': party.partyName,
      'Contact Person': party.contactPerson,
      'Email': party.email,
      'Phone': party.phone,
      'Category': party.category,
      'Status': party.status,
      'Balance (₹)': party.balance,
      'Last Transaction': party.lastTransaction.toLocaleDateString()
    }));

    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `inventory_parties_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }
}
