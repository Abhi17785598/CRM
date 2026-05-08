import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  
  // Sales data for CRM charts
  getSalesData() {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [65000, 78000, 90000, 81000, 96000, 105000],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Costs',
          data: [28000, 35000, 42000, 38000, 45000, 48000],
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  // Sales data for different periods
  getSalesDataForPeriod(period: string) {
    const periods: { [key: string]: any } = {
      '6m': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [65000, 78000, 90000, 81000, 96000, 105000],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Costs',
            data: [28000, 35000, 42000, 38000, 45000, 48000],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      '1y': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [65000, 78000, 90000, 81000, 96000, 105000, 112000, 108000, 115000, 121000, 118000, 125000],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Costs',
            data: [28000, 35000, 42000, 38000, 45000, 48000, 52000, 49000, 54000, 58000, 55000, 60000],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      'all': {
        labels: ['2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Revenue',
            data: [680000, 820000, 950000, 1100000],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Costs',
            data: [320000, 380000, 420000, 480000],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      }
    };
    
    return periods[period] || periods['6m'];
  }

  // Production data for manufacturing charts
  getProductionData() {
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Production Orders',
          data: [12, 19, 15, 25],
          backgroundColor: '#28a745'
        },
        {
          label: 'Completed Orders',
          data: [10, 17, 13, 22],
          backgroundColor: '#17a2b8'
        }
      ]
    };
  }

  // Payroll data for HR charts
  getPayrollData() {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Total Payroll',
          data: [45000, 46000, 47500, 46800, 48200, 49000],
          backgroundColor: '#ffc107'
        },
        {
          label: 'Overtime Pay',
          data: [3500, 4200, 3800, 5100, 4500, 4800],
          backgroundColor: '#fd7e14'
        }
      ]
    };
  }

  // Customer growth data
  getCustomerGrowthData() {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Customers',
          data: [8, 12, 15, 11, 18, 14],
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111, 66, 193, 0.1)',
          tension: 0.4
        }
      ]
    };
  }

  // Inventory status data
  getInventoryStatusData() {
    return {
      labels: ['Raw Materials', 'Work in Progress', 'Finished Goods', 'Low Stock Items'],
      datasets: [{
        data: [65, 25, 45, 8],
        backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#dc3545']
      }]
    };
  }

  // Employee distribution data
  getEmployeeDistributionData() {
    return {
      labels: ['Manufacturing', 'Sales', 'HR', 'Finance', 'Management'],
      datasets: [{
        data: [35, 20, 8, 12, 14],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1']
      }]
    };
  }

  // Performance metrics data for radar chart
  getPerformanceData() {
    return {
      labels: ['Quality', 'Efficiency', 'Delivery', 'Cost Control', 'Innovation', 'Customer Satisfaction'],
      datasets: [
        {
          label: 'Current Quarter',
          data: [95, 87, 92, 78, 85, 91],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          pointBackgroundColor: '#007bff',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#007bff'
        },
        {
          label: 'Previous Quarter',
          data: [88, 82, 89, 75, 80, 87],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          pointBackgroundColor: '#28a745',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#28a745'
        }
      ]
    };
  }

  // Generate random data for real-time updates
  generateRandomData(baseValue: number, variance: number): number {
    return baseValue + Math.floor(Math.random() * variance * 2 - variance);
  }

  // Chart configuration options
  getChartOptions(title: string, yLabel: string = '') {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: yLabel !== '',
            text: yLabel
          }
        }
      }
    };
  }

  // Pie chart options
  getPieChartOptions(title: string) {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true,
          position: 'right'
        }
      }
    };
  }
}
