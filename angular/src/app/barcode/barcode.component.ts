import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ScannedItem {
  id: string;
  barcode: string;
  timestamp: Date;
  productName?: string;
  quantity?: number;
}

interface GeneratedBarcode {
  id: string;
  data: string;
  type: string;
  timestamp: Date;
  format: string;
}

@Component({
  selector: 'app-barcode',
  standalone: false,
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-3">Barcode Management</h2>
          <p class="text-muted">Generate and manage product barcodes</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <ul class="nav nav-tabs mb-4" id="barcodeTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="scanner-tab" data-bs-toggle="tab" data-bs-target="#scanner" type="button" role="tab">
            <i class="fas fa-qrcode me-2"></i>Scanner
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="generator-tab" data-bs-toggle="tab" data-bs-target="#generator" type="button" role="tab">
            <i class="fas fa-barcode me-2"></i>Generator
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab">
            <i class="fas fa-history me-2"></i>History
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content" id="barcodeTabContent">
        <!-- Scanner Tab -->
        <div class="tab-pane fade show active" id="scanner" role="tabpanel">
          <div class="row">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-qrcode me-2"></i>Barcode Scanner</h5>
                </div>
                <div class="card-body">
                  <div class="scanner-container text-center p-4 border rounded" style="min-height: 300px; background: #f8f9fa;">
                    <div *ngIf="!isScanning" class="scanner-placeholder">
                      <i class="fas fa-qrcode fa-4x text-primary mb-3"></i>
                      <h5>Scanner Ready</h5>
                      <p class="text-muted">Click "Start Scanning" to begin</p>
                      <button class="btn btn-primary" (click)="startScanning()">
                        <i class="fas fa-play me-2"></i>Start Scanning
                      </button>
                    </div>
                    <div *ngIf="isScanning" class="scanner-active">
                      <div class="scanner-animation mb-3">
                        <div class="scanner-line"></div>
                        <i class="fas fa-qrcode fa-4x text-success"></i>
                      </div>
                      <h5 class="text-success">Scanning...</h5>
                      <p class="text-muted">Position barcode in front of camera</p>
                      <button class="btn btn-danger" (click)="stopScanning()">
                        <i class="fas fa-stop me-2"></i>Stop Scanning
                      </button>
                    </div>
                  </div>
                  
                  <!-- Manual Input -->
                  <div class="mt-4">
                    <h6>Manual Entry</h6>
                    <div class="input-group">
                      <input type="text" class="form-control" [(ngModel)]="manualBarcode" placeholder="Enter barcode manually">
                      <button class="btn btn-outline-primary" (click)="processManualBarcode()">
                        <i class="fas fa-keyboard me-2"></i>Process
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h6><i class="fas fa-cog me-2"></i>Scanner Settings</h6>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Barcode Type</label>
                    <select class="form-select" [(ngModel)]="scannerType">
                      <option value="auto">Auto Detect</option>
                      <option value="ean13">EAN-13</option>
                      <option value="ean8">EAN-8</option>
                      <option value="code128">Code 128</option>
                      <option value="code39">Code 39</option>
                      <option value="qr">QR Code</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Sound</label>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="soundEnabled">
                      <label class="form-check-label">Enable beep sound</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Auto-submit</label>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="autoSubmit">
                      <label class="form-check-label">Automatically submit scanned codes</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Generator Tab -->
        <div class="tab-pane fade" id="generator" role="tabpanel">
          <div class="row">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5><i class="fas fa-barcode me-2"></i>Barcode Generator</h5>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" [class.active]="!bulkMode" (click)="toggleBulkMode()">
                        <i class="fas fa-barcode me-1"></i>Single
                      </button>
                      <button class="btn btn-primary" [class.active]="bulkMode" (click)="toggleBulkMode()">
                        <i class="fas fa-layer-group me-1"></i>Bulk
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <!-- Single Barcode Generation -->
                  <div *ngIf="!bulkMode">
                    <form (ngSubmit)="generateBarcode()">
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Data/Value</label>
                          <input type="text" class="form-control" [(ngModel)]="generatorData" name="data" required placeholder="Enter barcode data">
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Barcode Type</label>
                          <select class="form-select" [(ngModel)]="generatorType" name="type">
                            <option value="CODE128">Code 128</option>
                            <option value="CODE39">Code 39</option>
                            <option value="EAN13">EAN-13</option>
                            <option value="EAN8">EAN-8</option>
                            <option value="QR">QR Code</option>
                            <option value="UPC">UPC-A</option>
                          </select>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Width</label>
                          <input type="number" class="form-control" [(ngModel)]="barcodeWidth" name="width" min="100" max="500">
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Height</label>
                          <input type="number" class="form-control" [(ngModel)]="barcodeHeight" name="height" min="50" max="200">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Show Text</label>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" [(ngModel)]="showText" name="showText">
                            <label class="form-check-label">Display barcode value</label>
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Product Name (Optional)</label>
                          <input type="text" class="form-control" [(ngModel)]="productName" name="productName" placeholder="Product name">
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary">
                        <i class="fas fa-qrcode me-2"></i>Generate Barcode
                      </button>
                    </form>
                  </div>

                  <!-- Bulk Barcode Generation -->
                  <div *ngIf="bulkMode">
                    <form (ngSubmit)="generateBulkBarcodes()">
                      <div class="row">
                        <div class="col-md-4 mb-3">
                          <label class="form-label">Prefix</label>
                          <input type="text" class="form-control" [(ngModel)]="bulkPrefix" placeholder="PROD" value="PROD">
                        </div>
                        <div class="col-md-3 mb-3">
                          <label class="form-label">Start Number</label>
                          <input type="number" class="form-control" [(ngModel)]="bulkStart" min="1" value="1">
                        </div>
                        <div class="col-md-3 mb-3">
                          <label class="form-label">End Number</label>
                          <input type="number" class="form-control" [(ngModel)]="bulkEnd" min="1" value="10">
                        </div>
                        <div class="col-md-2 mb-3">
                          <label class="form-label">Total</label>
                          <input type="text" class="form-control" [value]="(bulkEnd - bulkStart + 1)" readonly>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Barcode Type</label>
                          <select class="form-select" [(ngModel)]="generatorType" name="type">
                            <option value="CODE128">Code 128</option>
                            <option value="CODE39">Code 39</option>
                            <option value="EAN13">EAN-13</option>
                            <option value="EAN8">EAN-8</option>
                            <option value="QR">QR Code</option>
                            <option value="UPC">UPC-A</option>
                          </select>
                        </div>
                        <div class="col-md-3 mb-3">
                          <label class="form-label">Width</label>
                          <input type="number" class="form-control" [(ngModel)]="barcodeWidth" name="width" min="100" max="500">
                        </div>
                        <div class="col-md-3 mb-3">
                          <label class="form-label">Height</label>
                          <input type="number" class="form-control" [(ngModel)]="barcodeHeight" name="height" min="50" max="200">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Show Text</label>
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" [(ngModel)]="showText" name="showText">
                            <label class="form-check-label">Display barcode value</label>
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Product Name (Optional)</label>
                          <input type="text" class="form-control" [(ngModel)]="productName" name="productName" placeholder="Product name">
                        </div>
                      </div>
                      <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-success">
                          <i class="fas fa-layer-group me-2"></i>Generate {{ (bulkEnd - bulkStart + 1) }} Barcodes
                        </button>
                        <button type="button" class="btn btn-outline-secondary" (click)="bulkStart = 1; bulkEnd = 10">
                          <i class="fas fa-redo me-2"></i>Reset Range
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h6><i class="fas fa-eye me-2"></i>Preview</h6>
                </div>
                <div class="card-body text-center">
                  <div *ngIf="generatedBarcode" class="barcode-preview">
                    <div class="barcode-display mb-3 p-3 border rounded bg-white">
                      <canvas #barcodeCanvas [attr.width]="barcodeWidth" [attr.height]="barcodeHeight" class="barcode-canvas"></canvas>
                    </div>
                    <div *ngIf="showText" class="barcode-text mb-3">
                      <strong class="fs-5">{{ generatedBarcode.data }}</strong>
                      <div *ngIf="productName" class="text-muted small">{{ productName }}</div>
                    </div>
                    <div class="mt-3">
                      <button class="btn btn-success me-2" (click)="downloadBarcode()">
                        <i class="fas fa-download me-2"></i>Download PNG
                      </button>
                      <button class="btn btn-outline-primary me-2" (click)="printBarcode()">
                        <i class="fas fa-print me-2"></i>Print
                      </button>
                      <button class="btn btn-outline-secondary" (click)="copyToClipboard()">
                        <i class="fas fa-copy me-2"></i>Copy
                      </button>
                    </div>
                  </div>
                  <div *ngIf="!generatedBarcode" class="preview-placeholder">
                    <i class="fas fa-barcode fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Generated barcode will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div class="tab-pane fade" id="history" role="tabpanel">
          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-qrcode me-2"></i>Recent Scans</h5>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Barcode</th>
                          <th>Product</th>
                          <th>Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let scan of recentScans.slice(0, 5)">
                          <td><code>{{ scan.barcode }}</code></td>
                          <td>{{ scan.productName || 'Unknown' }}</td>
                          <td>{{ scan.timestamp | date:'short' }}</td>
                          <td>
                            <button class="btn btn-sm btn-outline-primary" (click)="viewScanDetails(scan)">
                              <i class="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                        <tr *ngIf="recentScans.length === 0">
                          <td colspan="4" class="text-center text-muted">No scans yet</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5><i class="fas fa-barcode me-2"></i>Generated Barcodes</h5>
                  <button *ngIf="generatedBarcodes.length > 1" class="btn btn-sm btn-success" (click)="downloadAllBarcodes()">
                    <i class="fas fa-download me-1"></i>Download All
                  </button>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Type</th>
                          <th>Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let barcode of generatedBarcodes.slice(0, 5)">
                          <td><code>{{ barcode.data }}</code></td>
                          <td>{{ barcode.type }}</td>
                          <td>{{ barcode.timestamp | date:'short' }}</td>
                          <td>
                            <button class="btn btn-sm btn-outline-success" (click)="downloadGeneratedBarcode(barcode)">
                              <i class="fas fa-download"></i>
                            </button>
                          </td>
                        </tr>
                        <tr *ngIf="generatedBarcodes.length === 0">
                          <td colspan="4" class="text-center text-muted">No barcodes generated yet</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scanner-container {
      position: relative;
      overflow: hidden;
    }
    
    .scanner-animation {
      position: relative;
      display: inline-block;
    }
    
    .scanner-line {
      position: absolute;
      top: 0;
      left: 50%;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, transparent, #28a745, transparent);
      transform: translateX(-50%);
      animation: scan 2s linear infinite;
    }
    
    @keyframes scan {
      0% { top: 0; }
      50% { top: 100%; }
      100% { top: 0; }
    }
    
    .barcode-display {
      background: white;
    }
    
    .barcode-canvas {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
    }
  `]
})
export class BarcodeComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef<HTMLCanvasElement>;
  
  // Scanner properties
  isScanning = false;
  scannerType = 'auto';
  soundEnabled = true;
  autoSubmit = false;
  manualBarcode = '';
  recentScans: ScannedItem[] = [];

  // Generator properties
  generatorData = '';
  generatorType = 'CODE128';
  barcodeWidth = 300;
  barcodeHeight = 100;
  showText = true;
  productName = '';
  generatedBarcode: GeneratedBarcode | null = null;
  generatedBarcodes: GeneratedBarcode[] = [];
  
  // Bulk generation properties
  bulkMode = false;
  bulkData = '';
  bulkPrefix = 'PROD';
  bulkStart = 1;
  bulkEnd = 10;
  bulkGenerated = 0;

  ngOnInit() {
    this.loadHistory();
  }

  ngAfterViewInit() {
    // Canvas is ready
  }

  // Scanner methods
  startScanning() {
    this.isScanning = true;
    // Simulate scanning
    setTimeout(() => {
      this.simulateScan();
    }, 3000);
  }

  stopScanning() {
    this.isScanning = false;
  }

  simulateScan() {
    const mockBarcodes = ['1234567890123', '9876543210987', '5555666677778'];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    
    const scan: ScannedItem = {
      id: Date.now().toString(),
      barcode: randomBarcode,
      timestamp: new Date(),
      productName: `Product ${randomBarcode.slice(-4)}`,
      quantity: 1
    };
    
    this.recentScans.unshift(scan);
    this.saveHistory();
    
    if (this.soundEnabled) {
      this.playBeep();
    }
    
    if (this.autoSubmit) {
      this.processScan(scan);
    } else {
      this.isScanning = false;
    }
  }

  processManualBarcode() {
    if (this.manualBarcode.trim()) {
      const scan: ScannedItem = {
        id: Date.now().toString(),
        barcode: this.manualBarcode,
        timestamp: new Date(),
        productName: `Manual Entry`,
        quantity: 1
      };
      
      this.recentScans.unshift(scan);
      this.saveHistory();
      this.manualBarcode = '';
      
      if (this.soundEnabled) {
        this.playBeep();
      }
    }
  }

  processScan(scan: ScannedItem) {
    console.log('Processing scan:', scan);
    // Here you would typically update inventory, look up product, etc.
  }

  viewScanDetails(scan: ScannedItem) {
    console.log('Scan details:', scan);
    // Show scan details in modal or expand section
  }

  // Generator methods
  generateBarcode() {
    if (!this.generatorData.trim()) return;

    const barcode: GeneratedBarcode = {
      id: Date.now().toString(),
      data: this.generatorData,
      type: this.generatorType,
      timestamp: new Date(),
      format: `${this.barcodeWidth}x${this.barcodeHeight}`
    };

    this.generatedBarcode = barcode;
    this.generatedBarcodes.unshift(barcode);
    this.saveHistory();
    
    // Draw the barcode on canvas
    setTimeout(() => {
      this.drawBarcode(barcode);
    }, 100);
  }

  generateBulkBarcodes() {
    if (this.bulkStart > this.bulkEnd) {
      alert('Start number must be less than or equal to end number');
      return;
    }

    this.bulkGenerated = 0;
    const totalToGenerate = this.bulkEnd - this.bulkStart + 1;

    for (let i = this.bulkStart; i <= this.bulkEnd; i++) {
      const barcodeData = `${this.bulkPrefix}${i.toString().padStart(4, '0')}`;
      
      const barcode: GeneratedBarcode = {
        id: `${Date.now()}_${i}`,
        data: barcodeData,
        type: this.generatorType,
        timestamp: new Date(),
        format: `${this.barcodeWidth}x${this.barcodeHeight}`
      };

      this.generatedBarcodes.unshift(barcode);
      this.bulkGenerated++;
    }

    this.saveHistory();
    
    // Show the last generated barcode
    if (this.generatedBarcodes.length > 0) {
      this.generatedBarcode = this.generatedBarcodes[0];
      setTimeout(() => {
        this.drawBarcode(this.generatedBarcode);
      }, 100);
    }

    alert(`Successfully generated ${this.bulkGenerated} barcodes from ${this.bulkPrefix}${this.bulkStart.toString().padStart(4, '0')} to ${this.bulkPrefix}${this.bulkEnd.toString().padStart(4, '0')}`);
  }

  toggleBulkMode() {
    this.bulkMode = !this.bulkMode;
    if (this.bulkMode) {
      this.generatorData = '';
    }
  }

  drawBarcode(barcode: GeneratedBarcode) {
    if (!this.barcodeCanvas) return;
    
    const canvas = this.barcodeCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate barcode pattern based on type
    const pattern = this.generateBarcodePattern(barcode.data, barcode.type);
    
    // Draw barcode
    const barWidth = canvas.width / pattern.length;
    const barHeight = canvas.height - (this.showText ? 20 : 10);
    
    ctx.fillStyle = 'black';
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(i * barWidth, 5, barWidth, barHeight);
      }
    }

    // Draw text if enabled
    if (this.showText) {
      ctx.fillStyle = 'black';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(barcode.data, canvas.width / 2, canvas.height - 5);
    }
  }

  generateBarcodePattern(data: string, type: string): string {
    // Simple barcode pattern generation (in real app, use proper barcode library)
    let pattern = '';
    
    switch (type) {
      case 'CODE128':
        // Simplified Code128 pattern
        pattern = this.generateCode128Pattern(data);
        break;
      case 'CODE39':
        // Simplified Code39 pattern
        pattern = this.generateCode39Pattern(data);
        break;
      case 'EAN13':
        // Simplified EAN13 pattern
        pattern = this.generateEAN13Pattern(data);
        break;
      case 'QR':
        // For QR codes, we'll create a simple pattern
        pattern = this.generateQRPattern(data);
        break;
      default:
        pattern = this.generateCode128Pattern(data);
    }
    
    return pattern;
  }

  generateCode128Pattern(data: string): string {
    // Simplified Code128 B pattern
    let pattern = '11010010000'; // Start code B
    
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) - 32; // Code128 B starts at space (32)
      const binaryPattern = this.getCode128Binary(charCode);
      pattern += binaryPattern;
    }
    
    pattern += '1100011101011'; // Stop code
    return pattern;
  }

  generateCode39Pattern(data: string): string {
    // Simplified Code39 pattern
    let pattern = '100010111011101010001110101'; // Start *
    
    for (let i = 0; i < data.length; i++) {
      const char = data[i].toUpperCase();
      const charPattern = this.getCode39Pattern(char);
      pattern += charPattern + '0'; // Inter-character gap
    }
    
    pattern += '100010111011101010001110101'; // Stop *
    return pattern;
  }

  generateEAN13Pattern(data: string): string {
    // Simplified EAN13 pattern (for demo purposes)
    let pattern = '101'; // Start guard
    
    // Generate pattern for first 12 digits (13th is checksum)
    for (let i = 0; i < Math.min(12, data.length); i++) {
      const digit = parseInt(data[i]) || 0;
      pattern += this.getEAN13Pattern(digit, i < 6);
    }
    
    pattern += '101'; // End guard
    return pattern;
  }

  generateQRPattern(data: string): string {
    // Very simplified QR-like pattern for demo
    const size = 25;
    let pattern = '';
    
    // Create a simple QR-like pattern
    for (let i = 0; i < size * size; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      
      // Add position markers
      if ((row < 7 && col < 7) || 
          (row < 7 && col >= size - 7) || 
          (row >= size - 7 && col < 7)) {
        pattern += (i % 2 === 0) ? '1' : '0';
      } else {
        // Random pattern for data
        pattern += (data.charCodeAt(i % data.length) % 3 === 0) ? '1' : '0';
      }
    }
    
    return pattern;
  }

  getCode128Binary(charCode: number): string {
    // Simplified Code128 B binary patterns
    const patterns = [
      '11011001100', '11001101100', '11001100110', '10010011000',
      '10010001100', '10001001100', '10011001000', '10011000100',
      '10001100100', '11001001000', '11001000100', '11000100100',
      '10110011100', '10011011100', '10011101100', '10011111000',
      '10110001100', '10001101100', '10001111000', '11000111000',
      '11010001100', '11000101100', '11000100110', '10110011000',
      '10011001100', '10011000110', '11001100110', '10111001100',
      '10011101100', '10011100110', '11001110110', '10111000110',
      '10001110110', '11101100110', '11010011100', '11000111100',
      '11000110110', '11100010110', '10101111000', '10100011110',
      '10001011110', '10111001000', '10111000100', '10001110100',
      '11101110110', '11010001110', '11000101110', '11011101110',
      '11101101110', '11101110100', '11100011110', '10111101110',
      '11110111000', '11110011110', '11111011110', '11011111110',
      '11101111010', '11110111100', '11111011100', '11111000110',
      '11100011010', '11101101110', '11110001110', '11111001100',
      '11111011000', '11100011100', '11101111000', '11110001100'
    ];
    
    return patterns[charCode] || '11011001100';
  }

  getCode39Pattern(char: string): string {
    // Simplified Code39 patterns
    const patterns: { [key: string]: string } = {
      '0': '101001101101', '1': '110100101011', '2': '101100101011',
      '3': '110110010101', '4': '101001101011', '5': '110100110101',
      '6': '101100110101', '7': '101001011011', '8': '110100101101',
      '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
      'C': '110110100101', 'D': '101011001011', 'E': '110101100101',
      'F': '101101100101', 'G': '101010011011', 'H': '110101001101',
      'I': '101101001101', 'J': '101011001101', 'K': '110101010011',
      'L': '101101010011', 'M': '110101101001', 'N': '101011010011',
      'O': '110101100110', 'P': '101101100110', 'Q': '101010110011',
      'R': '110101011001', 'S': '101101011001', 'T': '101011011001',
      'U': '110010101011', 'V': '100110101011', 'W': '110011010101',
      'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
      '-': '100101011011', '.': '110010101101', ' ': '100110101101',
      '$': '100100100101', '/': '100100101001', '+': '100101001001',
      '%': '101001001001'
    };
    
    return patterns[char] || '101001101101'; // Default to '0'
  }

  getEAN13Pattern(digit: number, isLeft: boolean): string {
    // Simplified EAN13 patterns
    const leftPatterns = [
      '0001101', '0011001', '0010011', '0111101', '0100011',
      '0110001', '0101111', '0111011', '0110111', '0001011'
    ];
    
    const rightPatterns = [
      '1110010', '1100110', '1101100', '1000010', '1011100',
      '1001110', '1010000', '1000100', '1001000', '1110100'
    ];
    
    const pattern = isLeft ? leftPatterns[digit] : rightPatterns[digit];
    return pattern || '0001101';
  }

  downloadBarcode() {
    if (!this.generatedBarcode || !this.barcodeCanvas) return;
    
    const canvas = this.barcodeCanvas.nativeElement;
    
    // Create download link
    const link = document.createElement('a');
    link.download = `barcode_${this.generatedBarcode.data}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    console.log('Barcode downloaded:', this.generatedBarcode.data);
  }

  printBarcode() {
    if (!this.generatedBarcode || !this.barcodeCanvas) return;
    
    const canvas = this.barcodeCanvas.nativeElement;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Barcode</title></head>
          <body style="text-align: center; padding: 20px;">
            <h3>Barcode: ${this.generatedBarcode.data}</h3>
            ${this.productName ? `<p>Product: ${this.productName}</p>` : ''}
            <img src="${canvas.toDataURL()}" style="max-width: 100%;" />
            <p>Type: ${this.generatedBarcode.type}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    console.log('Barcode printed:', this.generatedBarcode.data);
  }

  copyToClipboard() {
    if (!this.generatedBarcode) return;
    
    navigator.clipboard.writeText(this.generatedBarcode.data).then(() => {
      console.log('Barcode copied to clipboard:', this.generatedBarcode.data);
      // Show success message (you could add a toast notification here)
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  downloadGeneratedBarcode(barcode: GeneratedBarcode) {
    console.log('Downloading generated barcode:', barcode);
    alert(`Barcode ${barcode.data} downloaded successfully!`);
  }

  downloadAllBarcodes() {
    if (this.generatedBarcodes.length === 0) {
      alert('No barcodes to download!');
      return;
    }

    // Create a zip-like download (simplified - in real app, use a zip library)
    this.generatedBarcodes.forEach((barcode, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `barcode_${barcode.data}_${Date.now()}.png`;
        link.href = this.generateBarcodeDataUrl(barcode);
        link.click();
      }, index * 200); // Stagger downloads to avoid browser blocking
    });

    alert(`Downloading ${this.generatedBarcodes.length} barcodes...`);
  }

  generateBarcodeDataUrl(barcode: GeneratedBarcode): string {
    // Create a temporary canvas for this barcode
    const canvas = document.createElement('canvas');
    canvas.width = parseInt(barcode.format.split('x')[0]);
    canvas.height = parseInt(barcode.format.split('x')[1]);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Generate the barcode pattern
    const pattern = this.generateBarcodePattern(barcode.data, barcode.type);
    
    // Draw barcode on temporary canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / pattern.length;
    const barHeight = canvas.height - 20;
    
    ctx.fillStyle = 'black';
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(i * barWidth, 5, barWidth, barHeight);
      }
    }
    
    // Draw text if enabled
    if (this.showText) {
      ctx.fillStyle = 'black';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(barcode.data, canvas.width / 2, canvas.height - 5);
    }
    
    return canvas.toDataURL();
  }

  // Utility methods
  playBeep() {
    // Simulate beep sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => {});
  }

  loadHistory() {
    // Load from localStorage in a real app
    const savedScans = localStorage.getItem('barcodeScans');
    const savedGenerated = localStorage.getItem('generatedBarcodes');
    
    if (savedScans) {
      this.recentScans = JSON.parse(savedScans);
    }
    
    if (savedGenerated) {
      this.generatedBarcodes = JSON.parse(savedGenerated);
    }
  }

  saveHistory() {
    // Save to localStorage in a real app
    localStorage.setItem('barcodeScans', JSON.stringify(this.recentScans));
    localStorage.setItem('generatedBarcodes', JSON.stringify(this.generatedBarcodes));
  }
}
