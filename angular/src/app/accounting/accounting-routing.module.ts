import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingComponent } from './accounting.component';
import { InvoicesComponent } from './invoices.component';
import { PaymentsComponent } from './payments.component';
import { ExpensesComponent } from './expenses.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: AccountingComponent,
    pathMatch: 'full'
  },
  {
    path: 'invoices',
    component: InvoicesComponent
  },
  {
    path: 'payments',
    component: PaymentsComponent
  },
  {
    path: 'expenses',
    component: ExpensesComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {}
