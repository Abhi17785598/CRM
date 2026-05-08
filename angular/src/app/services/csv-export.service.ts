import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {
  
  exportToCsv(data: any[], filename: string, headers?: string[]): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    let csvContent = '';
    
    // Add headers if provided
    if (headers && headers.length > 0) {
      csvContent += headers.join(',') + '\n';
    } else {
      // Use keys from first object as headers
      const keys = Object.keys(data[0]);
      csvContent += keys.join(',') + '\n';
    }

    // Add data rows
    data.forEach(item => {
      const row = this.convertObjectToCsvRow(item);
      csvContent += row + '\n';
    });

    // Create and download the file
    this.downloadCsvFile(csvContent, filename);
  }

  private convertObjectToCsvRow(obj: any): string {
    const values = Object.values(obj).map(value => {
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string and escape commas and quotes
      let stringValue = String(value);
      
      // If the value contains comma, newline, or quotes, wrap in quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
      }
      
      return stringValue;
    });
    
    return values.join(',');
  }

  private downloadCsvFile(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error('Your browser does not support downloading files');
    }
  }

  // Utility method to format data for export
  formatDataForExport(data: any[], columnMapping?: { [key: string]: string }): any[] {
    if (!columnMapping) {
      return data;
    }

    return data.map(item => {
      const formattedItem: any = {};
      Object.keys(columnMapping).forEach(key => {
        formattedItem[columnMapping[key]] = item[key];
      });
      return formattedItem;
    });
  }

  // Method to get current timestamp for filename
  getTimestampedFilename(baseName: string): string {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `${baseName}_${timestamp}.csv`;
  }
}
