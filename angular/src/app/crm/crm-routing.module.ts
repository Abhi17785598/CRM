import { Routes } from '@angular/router';
import { CrmComponent } from './crm.component';
import { CustomersComponent } from './customers/customers.component';
import { LeadsComponent } from './leads/leads.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';

export const CRM_ROUTES: Routes = [
  {
    path: '',
    component: CrmComponent,
    children: [
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'leads',
        component: LeadsComponent,
      },
      {
        path: 'opportunities',
        component: OpportunitiesComponent,
      },
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full',
      },
    ],
  },
];
