import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BarcodeComponent } from './barcode.component';
import { BarcodeRoutingModule } from './barcode-routing.module';

@NgModule({
  declarations: [BarcodeComponent],
  imports: [CommonModule, RouterModule, FormsModule, BarcodeRoutingModule]
})
export class BarcodeModule {}
