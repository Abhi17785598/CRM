import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductCatalogComponent } from './product-catalog.component';
import { ProductManagementComponent } from './product-management.component';
import { CategoriesComponent } from './categories.component';
import { ProductDetailsComponent } from './product-details.component';
import { ProductReportComponent } from './product-report.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: 'catalog/:id',
        component: ProductDetailsComponent,
      },
      {
        path: 'catalog/:id/report',
        component: ProductReportComponent,
      },
      {
        path: 'management',
        component: ProductManagementComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: ':id',
        component: ProductDetailsComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(PRODUCTS_ROUTES)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
