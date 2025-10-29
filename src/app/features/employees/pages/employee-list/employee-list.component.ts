import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesService } from '../../services/employees.service';
import { Employee } from '../../models/employee.model';
import { EMPLOYEE_STATUSES } from '../../constants/employees.constants';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements OnInit {
  public readonly statuses = EMPLOYEE_STATUSES;
  public searchControl = this.fb.control('');
  public statusFilter = this.fb.control(this.statuses[0]);

  // private static readonly SEARCH_DEBOUNCE_MS = 300;

  public employees$: Observable<Employee[]> = this.employeesService.employees$;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    const companyId = this.authService.getCompanyId();
    if (companyId) {
      this.employeesService.loadEmployees(companyId).subscribe();
    }
  }

  public addDemoEmployee() {

    this.employeesService.employees$.pipe(take(1)).subscribe((employees) => {
      const nextId = Math.max(0, ...employees.map((e) => e.id)) + 1;
      this.employeesService.addEmployee({
        id: nextId,
        employeeId: nextId,
        nameAr: 'New Employee',
        nameEn: 'New Employee',
        email: `new.employee${nextId}@example.com`,
        password: 'password123',
        job: 'Developer',
        companyId: Number(this.authService.getCompanyId()!),
        status: true,
        department_id_random: 0,
        department_name_ar: '',
        department_name_en: '',
        address: null,
        nationality: '',
        national_id: null,
        marital_status: null,
        marital_status_name_ar: null,
        marital_status_name_en: null,
        company_emp_code: null,
        system_emp_code: null,
        gender: 0,
        gender_name_ar: null,
        gender_name_en: null,
        birthdate: '',
        str_birthdate: null,
        joining_date: '',
        str_joining_date: null,
        direct_manager_id: null,
        direct_manager_name_ar: null,
        direct_manager_name_en: null,
        employment_status: 0,
        employment_status_name_ar: '',
        employment_status_name_en: '',
        emp_image: null,
        phone_no: null,
        roleNameAr: '',
        roleNameEn: '',
        employment_id: null,
        employment_code: null,
        roleId: 0,
        emp_session_id: null,
        decrypted_session_id: null,
        job_type: null,
        job_type_name_ar: null,
        job_type_name_en: null,
        shift_type: null,
        shift_type_name_ar: null,
        shift_type_name_en: null,
      });
    });
  }

  public editEmployee(emp: Employee) {
    this.employeesService.updateEmployee({ ...emp, nameEn: String(emp.nameEn ?? emp.nameAr ?? 'Edited') } as Employee);
  }

  public deleteEmployee(emp: Employee) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete', message: `Delete ${String(emp.nameEn ?? emp.nameAr ?? emp.email ?? emp.id)}?` },
    });
    ref.afterClosed().subscribe((yes) => {
      if (yes) {
        this.employeesService.deleteEmployee(Number(emp.id));
      }
    });
  }
}
