import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticOpportunities: any[] = [
  {
    id: '1',
    opportunityNumber: 'O-2024-001',
    title: 'Enterprise Manufacturing Software',
    customerName: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    stage: 'Proposal',
    probability: 75,
    estimatedValue: 150000,
    expectedCloseDate: new Date('2024-02-15'),
    assignedTo: 'Sarah Johnson',
    products: 'Manufacturing ERP System',
    createdDate: new Date('2024-01-10'),
    description: 'Complete manufacturing solution for production planning and inventory management'
  },
  {
    id: '2',
    opportunityNumber: 'O-2024-002',
    title: 'Quality Control System',
    customerName: 'Manufacturing Co.',
    contactPerson: 'Jane Doe',
    stage: 'Negotiation',
    probability: 60,
    estimatedValue: 85000,
    expectedCloseDate: new Date('2024-03-01'),
    assignedTo: 'Mike Brown',
    products: 'Quality Assurance Software',
    createdDate: new Date('2024-01-08'),
    description: 'Quality control and inspection management system'
  },
  {
    id: '3',
    opportunityNumber: 'O-2024-003',
    title: 'Inventory Management Solution',
    customerName: 'Retail Store LLC',
    contactPerson: 'Bob Wilson',
    stage: 'Qualification',
    probability: 40,
    estimatedValue: 65000,
    expectedCloseDate: new Date('2024-02-28'),
    assignedTo: 'Emily Davis',
    products: 'Inventory Tracking System',
    createdDate: new Date('2024-01-05'),
    description: 'Real-time inventory management and tracking solution'
  }
];

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {
  opportunities: any[] = [];
  selectedOpportunity: any | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newOpportunity: Partial<any> = {
    opportunityNumber: '',
    title: '',
    customerName: '',
    contactPerson: '',
    stage: 'Qualification',
    probability: 50,
    estimatedValue: 0,
    expectedCloseDate: new Date(),
    assignedTo: '',
    products: '',
    createdDate: new Date(),
    description: ''
  };

  constructor(private csvExportService: CsvExportService) { }

  ngOnInit(): void {
    // Load static data
    this.opportunities = [...staticOpportunities];
  }

  getStageClass(stage: string): string {
    switch (stage) {
      case 'Qualification': return 'badge-secondary';
      case 'Proposal': return 'badge-primary';
      case 'Negotiation': return 'badge-warning';
      case 'Closed Won': return 'badge-success';
      case 'Closed Lost': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getProbabilityClass(probability: number): string {
    if (probability >= 70) return 'text-success fw-bold';
    if (probability >= 50) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }

  selectOpportunity(opportunity: any): void {
    console.log('Selecting opportunity:', opportunity);
    this.selectedOpportunity = opportunity;
  }

  createOpportunity(): void {
    console.log('Creating opportunity:', this.newOpportunity);
    if (this.newOpportunity.title && this.newOpportunity.customerName && this.newOpportunity.contactPerson) {
      const opportunity = {
        id: Date.now().toString(),
        opportunityNumber: this.newOpportunity.opportunityNumber || `O-2024-${Date.now()}`,
        title: this.newOpportunity.title || '',
        customerName: this.newOpportunity.customerName || '',
        contactPerson: this.newOpportunity.contactPerson || '',
        stage: this.newOpportunity.stage || 'Qualification',
        probability: this.newOpportunity.probability || 50,
        estimatedValue: this.newOpportunity.estimatedValue || 0,
        expectedCloseDate: this.newOpportunity.expectedCloseDate || new Date(),
        assignedTo: this.newOpportunity.assignedTo || '',
        products: this.newOpportunity.products || '',
        createdDate: this.newOpportunity.createdDate || new Date(),
        description: this.newOpportunity.description || ''
      };
      
      this.opportunities.push(opportunity);
      staticOpportunities.push(opportunity);
      this.showCreateForm = false;
      this.resetForm();
      console.log('Opportunity created successfully:', opportunity);
    }
  }

  updateOpportunity(): void {
    console.log('Updating opportunity:', this.newOpportunity);
    if (this.selectedOpportunity && this.newOpportunity.title && this.newOpportunity.customerName && this.newOpportunity.contactPerson) {
      Object.assign(this.selectedOpportunity, this.newOpportunity);
      
      // Update static data
      const staticOpportunity = staticOpportunities.find(o => o.id === this.selectedOpportunity!.id);
      if (staticOpportunity) {
        Object.assign(staticOpportunity, this.newOpportunity);
      }
      
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Opportunity updated successfully:', this.selectedOpportunity);
    }
  }

  deleteOpportunity(opportunityId: string): void {
    console.log('Deleting opportunity:', opportunityId);
    this.opportunities = this.opportunities.filter(o => o.id !== opportunityId);
    staticOpportunities = staticOpportunities.filter(o => o.id !== opportunityId);
    if (this.selectedOpportunity?.id === opportunityId) {
      this.selectedOpportunity = null;
    }
    console.log('Opportunity deleted successfully');
  }

  editOpportunity(opportunity: any): void {
    console.log('Editing opportunity:', opportunity);
    this.selectedOpportunity = opportunity;
    this.newOpportunity = { ...opportunity };
    this.showUpdateForm = true;
  }

  winOpportunity(opportunityId: string): void {
    console.log('Winning opportunity:', opportunityId);
    const opportunity = this.opportunities.find(o => o.id === opportunityId);
    const staticOpportunity = staticOpportunities.find(o => o.id === opportunityId);
    
    if (opportunity && staticOpportunity) {
      opportunity.stage = 'Closed Won';
      staticOpportunity.stage = 'Closed Won';
      console.log('Opportunity won successfully:', opportunity);
    }
  }

  loseOpportunity(opportunityId: string): void {
    console.log('Losing opportunity:', opportunityId);
    const opportunity = this.opportunities.find(o => o.id === opportunityId);
    const staticOpportunity = staticOpportunities.find(o => o.id === opportunityId);
    
    if (opportunity && staticOpportunity) {
      opportunity.stage = 'Closed Lost';
      staticOpportunity.stage = 'Closed Lost';
      console.log('Opportunity lost successfully:', opportunity);
    }
  }

  exportOpportunities(): void {
    const headers = [
      'Opportunity Number',
      'Title',
      'Customer Name',
      'Contact Person',
      'Stage',
      'Probability',
      'Estimated Value',
      'Expected Close Date',
      'Assigned To',
      'Products',
      'Created Date',
      'Description'
    ];

    const columnMapping = {
      opportunityNumber: 'Opportunity Number',
      title: 'Title',
      customerName: 'Customer Name',
      contactPerson: 'Contact Person',
      stage: 'Stage',
      probability: 'Probability',
      estimatedValue: 'Estimated Value',
      expectedCloseDate: 'Expected Close Date',
      assignedTo: 'Assigned To',
      products: 'Products',
      createdDate: 'Created Date',
      description: 'Description'
    };

    const formattedData = this.csvExportService.formatDataForExport(this.opportunities, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('opportunities');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newOpportunity = {
      opportunityNumber: '',
      title: '',
      customerName: '',
      contactPerson: '',
      stage: 'Qualification',
      probability: 50,
      estimatedValue: 0,
      expectedCloseDate: new Date(),
      assignedTo: '',
      products: '',
      createdDate: new Date(),
      description: ''
    };
  }
}
