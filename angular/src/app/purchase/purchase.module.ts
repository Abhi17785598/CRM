import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseComponent } from './purchase.component';
import { PurchaseOrdersComponent } from './purchase-orders.component';
import { VendorsComponent } from './vendors.component';
import { QuotationsComponent } from './quotations.component';
import { PurchaseRoutingModule } from './purchase-routing.module';

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseOrdersComponent,
    VendorsComponent,
    QuotationsComponent
  ],
  imports: [CommonModule, RouterModule, FormsModule, PurchaseRoutingModule]
})
export class PurchaseModule {}
