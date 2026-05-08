import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { PurchaseOrdersComponent } from './purchase-orders.component';
import { VendorsComponent } from './vendors.component';
import { QuotationsComponent } from './quotations.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: PurchaseOrdersComponent
  },
  {
    path: 'vendors',
    component: VendorsComponent
  },
  {
    path: 'quotations',
    component: QuotationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule {}
