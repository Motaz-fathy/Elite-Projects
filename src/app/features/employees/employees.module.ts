import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AdvancedDataTableComponent } from '../../shared/components/advanced-data-table/advanced-data-table.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
  },
];

@NgModule({
  declarations: [EmployeeListComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    AdvancedDataTableComponent,
  ],
})
export class EmployeesModule {}
