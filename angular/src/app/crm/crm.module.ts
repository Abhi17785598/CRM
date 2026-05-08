import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CrmComponent } from './crm.component';
import { CustomersComponent } from './customers/customers.component';
import { LeadsComponent } from './leads/leads.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { CRM_ROUTES } from './crm-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RouterModule.forChild(CRM_ROUTES),
    CrmComponent,
    CustomersComponent,
    LeadsComponent,
    OpportunitiesComponent
  ]
})
export class CrmModule {}
