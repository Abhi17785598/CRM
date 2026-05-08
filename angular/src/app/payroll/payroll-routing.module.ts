import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollComponent } from './payroll.component';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PayslipsNewComponent } from './payslips-new/payslips-new.component';
import { AttendanceManagementComponent } from '../hrms/attendance-management.component';
import { LeaveManagementComponent } from '../hrms/leave-management.component';
import { PayrollManagementComponent } from '../hrms/payroll-management.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      {
        path: 'employees',
        loadComponent: () => import('./employees/employees.component').then(m => m.EmployeesComponent),
      },
      {
        path: 'all-employees',
        component: AllEmployeesComponent,
        data: { title: 'All Employees' }
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        data: { title: 'Inventory Management' }
      },
      {
        path: 'payslips',
        loadComponent: () => import('./payslips/payslips.component').then(m => m.PayslipsComponent),
      },
      {
        path: 'payslips-new',
        component: PayslipsNewComponent,
        data: { title: 'Payslip Management' }
      },
      {
        path: 'attendance',
        component: AttendanceManagementComponent,
        data: { title: 'Attendance Management' }
      },
      {
        path: 'leave',
        component: LeaveManagementComponent,
        data: { title: 'Leave Management' }
      },
      {
        path: 'payroll-management',
        component: PayrollManagementComponent,
        data: { title: 'Payroll Management' }
      },
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
