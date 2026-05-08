import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './payroll.component';
import { AttendanceManagementComponent } from '../hrms/attendance-management.component';
import { LeaveManagementComponent } from '../hrms/leave-management.component';
import { PayrollManagementComponent } from '../hrms/payroll-management.component';

@NgModule({
  declarations: [
    PayrollComponent,
    AttendanceManagementComponent,
    LeaveManagementComponent,
    PayrollManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    PayrollRoutingModule
  ],
})
export class PayrollModule { }
