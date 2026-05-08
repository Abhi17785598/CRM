import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsvExportService } from '../../services/csv-export.service';

// Static data that persists across component instances
let staticQualityChecks: any[] = [
  {
    id: '1',
    checkNumber: 'QC-2024-001',
    productName: 'LG LED TV 55" OLED',
    checkType: 'Display Quality Test',
    status: 'Passed',
    inspector: 'John Smith',
    checkDate: new Date('2024-01-12'),
    specifications: 'Pixel Response: <1ms, Color Accuracy: ΔE<2, Brightness: 500-800 nits',
    results: 'All pixels functional, Color accuracy ΔE=1.2, Peak brightness 750 nits',
    defects: 'None detected',
    correctiveAction: 'None required',
    nextCheckDate: new Date('2024-02-12'),
    notes: 'Premium OLED display quality verified'
  },
  {
    id: '2',
    checkNumber: 'QC-2024-002',
    productName: 'LG Washing Machine 12kg',
    checkType: 'Spin Cycle Performance',
    status: 'Failed',
    inspector: 'Sarah Johnson',
    checkDate: new Date('2024-01-10'),
    specifications: 'Max Spin: 1400 RPM ±50, Noise Level: <55dB, Vibration: <2mm',
    results: 'Max Spin: 1350 RPM, Noise Level: 58dB, Vibration: 2.8mm',
    defects: 'Excessive noise and vibration at high spin speeds',
    correctiveAction: 'Balance adjustment required, Dampening system inspection',
    nextCheckDate: new Date('2024-01-15'),
    notes: 'Unit held for rework before shipping'
  },
  {
    id: '3',
    checkNumber: 'QC-2024-003',
    productName: 'LG Refrigerator 700L',
    checkType: 'Temperature Control Test',
    status: 'Passed',
    inspector: 'Mike Brown',
    checkDate: new Date('2024-01-08'),
    specifications: 'Cooling: 3°C ±1°C, Freezer: -18°C ±2°C, Energy consumption: ≤1.2 kWh/day',
    results: 'Cooling: 3.2°C, Freezer: -18.5°C, Energy: 1.1 kWh/day',
    defects: 'None',
    correctiveAction: 'None required',
    nextCheckDate: new Date('2024-02-08'),
    notes: 'Energy efficiency and cooling performance optimal'
  },
  {
    id: '4',
    checkNumber: 'QC-2024-004',
    productName: 'LG Air Conditioner 2 Ton',
    checkType: 'Cooling Performance Test',
    status: 'Pending',
    inspector: 'Emily Davis',
    checkDate: new Date('2024-01-20'),
    specifications: 'Cooling Capacity: 24000 BTU ±5%, EER ≥ 11.0, Noise Level: <55dB',
    results: 'Pending inspection results',
    defects: 'Pending',
    correctiveAction: 'Pending',
    nextCheckDate: null,
    notes: 'Scheduled for seasonal performance testing'
  }
];

@Component({
  selector: 'app-quality-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quality-control.component.html',
  styleUrls: ['./quality-control.component.css']
})
export class QualityControlComponent implements OnInit {
  qualityChecks: any[] = [];
  selectedCheck: any | null = null;
  showCreateForm = false;
  showUpdateForm = false;
  newCheck: Partial<any> = {
    checkNumber: '',
    productName: '',
    checkType: 'Display Quality Test',
    status: 'Pending',
    inspector: '',
    checkDate: new Date(),
    specifications: '',
    results: '',
    defects: '',
    correctiveAction: '',
    nextCheckDate: null,
    notes: ''
  };

  constructor(private csvExportService: CsvExportService) { }

  ngOnInit(): void {
    // Load static data
    this.qualityChecks = [...staticQualityChecks];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Passed': return 'badge-success';
      case 'Failed': return 'badge-danger';
      case 'Pending': return 'badge-warning';
      case 'Cancelled': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  selectCheck(check: any): void {
    console.log('Selecting quality check:', check);
    this.selectedCheck = check;
  }

  createCheck(): void {
    console.log('Creating quality check:', this.newCheck);
    if (this.newCheck.checkNumber && this.newCheck.productName && this.newCheck.inspector) {
      const check = {
        id: Date.now().toString(),
        checkNumber: this.newCheck.checkNumber || '',
        productName: this.newCheck.productName || '',
        checkType: this.newCheck.checkType || '',
        status: this.newCheck.status || 'Pending',
        inspector: this.newCheck.inspector || '',
        checkDate: this.newCheck.checkDate || new Date(),
        specifications: this.newCheck.specifications || '',
        results: this.newCheck.results || '',
        defects: this.newCheck.defects || '',
        correctiveAction: this.newCheck.correctiveAction || '',
        nextCheckDate: this.newCheck.nextCheckDate,
        notes: this.newCheck.notes || ''
      };
      
      this.qualityChecks.push(check);
      staticQualityChecks.push(check);
      this.showCreateForm = false;
      this.resetForm();
      console.log('Quality check created successfully:', check);
    }
  }

  updateCheck(): void {
    console.log('Updating quality check:', this.newCheck);
    if (this.selectedCheck && this.newCheck.productName && this.newCheck.inspector) {
      Object.assign(this.selectedCheck, this.newCheck);
      
      // Update static data
      const staticCheck = staticQualityChecks.find(qc => qc.id === this.selectedCheck!.id);
      if (staticCheck) {
        Object.assign(staticCheck, this.newCheck);
      }
      
      this.showUpdateForm = false;
      this.resetForm();
      console.log('Quality check updated successfully:', this.selectedCheck);
    }
  }

  deleteCheck(checkId: string): void {
    console.log('Deleting quality check:', checkId);
    this.qualityChecks = this.qualityChecks.filter(qc => qc.id !== checkId);
    staticQualityChecks = staticQualityChecks.filter(qc => qc.id !== checkId);
    if (this.selectedCheck?.id === checkId) {
      this.selectedCheck = null;
    }
    console.log('Quality check deleted successfully');
  }

  editCheck(check: any): void {
    console.log('Editing quality check:', check);
    this.selectedCheck = check;
    this.newCheck = { ...check };
    this.showUpdateForm = true;
  }

  approveCheck(checkId: string): void {
    console.log('Approving quality check:', checkId);
    const check = this.qualityChecks.find(qc => qc.id === checkId);
    const staticCheck = staticQualityChecks.find(qc => qc.id === checkId);
    
    if (check && staticCheck) {
      check.status = 'Passed';
      staticCheck.status = 'Passed';
      console.log('Quality check approved:', check);
    }
  }

  failCheck(checkId: string): void {
    console.log('Failing quality check:', checkId);
    const check = this.qualityChecks.find(qc => qc.id === checkId);
    const staticCheck = staticQualityChecks.find(qc => qc.id === checkId);
    
    if (check && staticCheck) {
      check.status = 'Failed';
      staticCheck.status = 'Failed';
      console.log('Quality check failed:', check);
    }
  }

  exportQualityChecks(): void {
    const headers = [
      'Check Number',
      'Product Name',
      'Check Type',
      'Status',
      'Inspector',
      'Check Date',
      'Specifications',
      'Results',
      'Defects',
      'Corrective Action',
      'Next Check Date',
      'Notes'
    ];

    const columnMapping = {
      checkNumber: 'Check Number',
      productName: 'Product Name',
      checkType: 'Check Type',
      status: 'Status',
      inspector: 'Inspector',
      checkDate: 'Check Date',
      specifications: 'Specifications',
      results: 'Results',
      defects: 'Defects',
      correctiveAction: 'Corrective Action',
      nextCheckDate: 'Next Check Date',
      notes: 'Notes'
    };

    const formattedData = this.csvExportService.formatDataForExport(this.qualityChecks, columnMapping);
    const filename = this.csvExportService.getTimestampedFilename('quality_checks');
    this.csvExportService.exportToCsv(formattedData, filename, headers);
  }

  resetForm(): void {
    this.newCheck = {
      checkNumber: '',
      productName: '',
      checkType: 'Dimensional Inspection',
      status: 'Pending',
      inspector: '',
      checkDate: new Date(),
      specifications: '',
      results: '',
      defects: '',
      correctiveAction: '',
      nextCheckDate: null,
      notes: ''
    };
  }
}
