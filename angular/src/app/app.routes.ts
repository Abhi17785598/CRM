import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.routes').then(m => m.homeRoutes),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.createRoutes()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.createRoutes()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.createRoutes()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.createRoutes()),
  },
  {
    path: 'manufacturing',
    loadChildren: () =>
      import('./manufacturing/manufacturing.module').then(m => m.ManufacturingModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then(m => m.ProductsModule),
  },
  {
    path: 'barcode',
    loadChildren: () =>
      import('./barcode/barcode.module').then(m => m.BarcodeModule),
  },
  {
    path: 'crm',
    loadChildren: () =>
      import('./crm/crm.module').then(m => m.CrmModule),
  },
  {
    path: 'logistics',
    loadChildren: () =>
      import('./logistics/logistics.module').then(m => m.LogisticsModule),
  },
  {
    path: 'purchase',
    loadChildren: () =>
      import('./purchase/purchase.module').then(m => m.PurchaseModule),
  },
  {
    path: 'hrms',
    loadChildren: () =>
      import('./payroll/payroll.module').then(m => m.PayrollModule),
  },
  {
    path: 'accounting',
    loadChildren: () =>
      import('./accounting/accounting.module').then(m => m.AccountingModule),
  }
];
