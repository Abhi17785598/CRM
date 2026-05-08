import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeComponent } from './barcode.component';

const routes: Routes = [
  {
    path: '',
    component: BarcodeComponent,
    pathMatch: 'full'
  },
  {
    path: 'scanner',
    component: BarcodeComponent
  },
  {
    path: 'generator',
    component: BarcodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarcodeRoutingModule {}
