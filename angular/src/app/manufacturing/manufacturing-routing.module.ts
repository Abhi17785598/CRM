import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

export const MANUFACTURING_ROUTES: Routes = [
  {
    path: '',
    component: ManufacturingComponent,
    children: [
      {
        path: 'production-orders',
        component: ProductionOrdersComponent,
      },
      {
        path: 'production-orders/create',
        component: ProductionOrderCreateComponent,
      },
      {
        path: 'production-orders/create/materials',
        component: ProductionOrderMaterialsComponent,
      },
      {
        path: 'production-orders/create/scheduling',
        component: ProductionOrderSchedulingComponent,
      },
      {
        path: 'production-orders/create/review',
        component: ProductionOrderReviewComponent,
      },
      {
        path: 'production-orders/:id',
        component: ProductionOrderDetailsComponent,
      },
      {
        path: 'production-orders/:id/edit',
        component: ProductionOrderEditComponent,
      },
      {
        path: 'work-orders',
        component: WorkOrdersComponent,
      },
      {
        path: 'quality-control',
        component: QualityControlComponent,
      },
      {
        path: 'maintenance',
        component: MaintenanceComponent,
      },
      {
        path: '',
        redirectTo: 'production-orders',
        pathMatch: 'full',
      },
    ],
  },
];
