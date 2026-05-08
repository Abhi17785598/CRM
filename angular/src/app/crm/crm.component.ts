import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerDto, CustomerType, CustomerStatus } from '../models/crm.models';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css']
})
export class CrmComponent implements OnInit {

  customers: CustomerDto[] = [];
  selectedCustomer: CustomerDto | null = null;

  customer: CustomerDto = {
    id: '',
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

  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }
}
