import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountingComponent } from './accounting.component';
import { InvoicesComponent } from './invoices.component';
import { PaymentsComponent } from './payments.component';
import { ExpensesComponent } from './expenses.component';
import { ReportsComponent } from './reports.component';
import { AccountingRoutingModule } from './accounting-routing.module';

@NgModule({
  declarations: [
    AccountingComponent,
    InvoicesComponent,
    PaymentsComponent,
    ExpensesComponent,
    ReportsComponent
  ],
  imports: [CommonModule, RouterModule, FormsModule, AccountingRoutingModule]
})
export class AccountingModule {}
