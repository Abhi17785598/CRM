import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ManufacturingComponent } from './manufacturing.component';
import { ProductionOrdersComponent } from './production-orders/production-orders.component';
import { ProductionOrderDetailsComponent } from './production-orders/production-order-details.component';
import { ProductionOrderCreateComponent } from './production-orders/production-order-create.component';
import { ProductionOrderMaterialsComponent } from './production-orders/production-order-materials.component';
import { ProductionOrderSchedulingComponent } from './production-orders/production-order-scheduling.component';
import { ProductionOrderReviewComponent } from './production-orders/production-order-review.component';
import { ProductionOrderEditComponent } from './production-orders/production-order-edit.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { QualityControlComponent } from './quality-control/quality-control.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MANUFACTURING_ROUTES } from './manufacturing-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(MANUFACTURING_ROUTES),
    SharedModule,
    ManufacturingComponent,
    ProductionOrdersComponent,
    ProductionOrderDetailsComponent,
    ProductionOrderCreateComponent,
    ProductionOrderMaterialsComponent,
    ProductionOrderSchedulingComponent,
    ProductionOrderReviewComponent,
    ProductionOrderEditComponent,
    WorkOrdersComponent,
    QualityControlComponent,
    MaintenanceComponent
  ]
})
export class ManufacturingModule {}
