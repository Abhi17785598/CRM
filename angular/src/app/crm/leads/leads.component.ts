import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticLeads: any[] = [
  {
    id: '1',
    leadNumber: 'L-2024-001',
    companyName: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    email: 'john.smith@techsolutions.com',
    phone: '+1-555-0123',
    source: 'Website',
    status: 'New',
    priority: 'High',
    estimatedValue: 50000,
    assignedTo: 'Sarah Johnson',
    createdDate: new Date('2024-01-10'),
    notes: 'Interested in enterprise manufacturing solution'
  },
  {
    id: '2',
    leadNumber: 'L-2024-002',
    companyName: 'Manufacturing Co.',
    contactPerson: 'Jane Doe',
    email: 'jane.doe@manufacturing.com',
    phone: '+1-555-0124',
    source: 'Referral',
    status: 'Qualified',
    priority: 'Medium',
    estimatedValue: 35000,
    assignedTo: 'Mike Brown',
    createdDate: new Date('2024-01-08'),
    notes: 'Looking for production planning software'
  },
  {
    id: '3',
    leadNumber: 'L-2024-003',
    companyName: 'Retail Store LLC',
    contactPerson: 'Bob Wilson',
    email: 'bob.wilson@retail.com',
    phone: '+1-555-0125',
    source: 'Cold Call',
    status: 'Contacted',
    priority: 'Low',
    estimatedValue: 25000,
    assignedTo: 'Emily Davis',
    createdDate: new Date('2024-01-05'),
    notes: 'Potential customer for inventory management'
  }
];

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  leads: any[] = [];
  selectedLead: any | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newLead: Partial<any> = {
    leadNumber: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New',
    priority: 'Medium',
    estimatedValue: 0,
    assignedTo: '',
    createdDate: new Date(),
    notes: ''
  };

  constructor(private csvExportService: CsvExportService) { }

  ngOnInit(): void {
    // Load static data
    this.leads = [...staticLeads];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'New': return 'badge-primary';
      case 'Qualified': return 'badge-success';
      case 'Contacted': return 'badge-warning';
      case 'Lost': return 'badge-danger';
      case 'Converted': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'text-danger fw-bold';
      case 'Medium': return 'text-warning fw-bold';
      case 'Low': return 'text-info fw-bold';
      default: return 'text-secondary';
    }
  }

  selectLead(lead: any): void {
    console.log('Selecting lead:', lead);
    this.selectedLead = lead;
  }

  createLead(): void {
    console.log('Creating lead:', this.newLead);
    if (this.newLead.companyName && this.newLead.contactPerson && this.newLead.email) {
      const lead = {
        id: Date.now().toString(),
        leadNumber: this.newLead.leadNumber || `L-2024-${Date.now()}`,
        companyName: this.newLead.companyName || '',
        contactPerson: this.newLead.contactPerson || '',
        email: this.newLead.email || '',
        phone: this.newLead.phone || '',
        source: this.newLead.source || '',
        status: this.newLead.status || 'New',
        priority: this.newLead.priority || 'Medium',
        estimatedValue: this.newLead.estimatedValue || 0,
        assignedTo: this.newLead.assignedTo || '',
        createdDate: this.newLead.createdDate || new Date(),
        notes: this.newLead.notes || ''
      };
      
      this.leads.push(lead);
      staticLeads.push(lead);
      this.showCreateForm = false;
      this.resetForm();
      console.log('Lead created successfully:', lead);
    }
  }

  updateLead(): void {
    console.log('Updating lead:', this.newLead);
    if (this.selectedLead && this.newLead.companyName && this.newLead.contactPerson && this.newLead.email) {
      Object.assign(this.selectedLead, this.newLead);
      
      // Update static data
      const staticLead = staticLeads.find(l => l.id === this.selectedLead!.id);
      if (staticLead) {
        Object.assign(staticLead, this.newLead);
      }
      
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Lead updated successfully:', this.selectedLead);
    }
  }

  deleteLead(leadId: string): void {
    console.log('Deleting lead:', leadId);
    this.leads = this.leads.filter(l => l.id !== leadId);
    staticLeads = staticLeads.filter(l => l.id !== leadId);
    if (this.selectedLead?.id === leadId) {
      this.selectedLead = null;
    }
    console.log('Lead deleted successfully');
  }

  editLead(lead: any): void {
    console.log('Editing lead:', lead);
    this.selectedLead = lead;
    this.newLead = { ...lead };
    this.showUpdateForm = true;
  }

  convertLead(leadId: string): void {
    console.log('Converting lead:', leadId);
    const lead = this.leads.find(l => l.id === leadId);
    const staticLead = staticLeads.find(l => l.id === leadId);
    
    if (lead && staticLead) {
      lead.status = 'Converted';
      staticLead.status = 'Converted';
      console.log('Lead converted successfully:', lead);
    }
  }

  exportLeads(): void {
    const headers = [
      'Lead Number',
      'Company Name',
      'Contact Person',
      'Email',
      'Phone',
      'Source',
      'Status',
      'Priority',
      'Estimated Value',
      'Assigned To',
      'Created Date',
      'Notes'
    ];

    const columnMapping = {
      leadNumber: 'Lead Number',
      companyName: 'Company Name',
      contactPerson: 'Contact Person',
      email: 'Email',
      phone: 'Phone',
      source: 'Source',
      status: 'Status',
      priority: 'Priority',
      estimatedValue: 'Estimated Value',
      assignedTo: 'Assigned To',
      createdDate: 'Created Date',
      notes: 'Notes'
    };

    const formattedData = this.csvExportService.formatDataForExport(this.leads, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('leads');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newLead = {
      leadNumber: '',
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      source: 'Website',
      status: 'New',
      priority: 'Medium',
      estimatedValue: 0,
      assignedTo: '',
      createdDate: new Date(),
      notes: ''
    };
  }
}
