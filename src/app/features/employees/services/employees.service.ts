import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmployeesApiService } from '../apis/employees.api';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);

  constructor(
    private employeesApi: EmployeesApiService,
  ) {}

  private mapToEmployee(e: unknown, index: number): Employee {
    const obj = e as Record<string, unknown>;
    return {
      id: this.getNumber(obj, 'id', index + 1),
      employeeId: this.getNumber(obj, 'employeeId', 0),
      nameAr: this.getString(obj, 'nameAr', 'N/A'),
      nameEn: this.getString(obj, 'nameEn', 'N/A'),
      email: this.getString(obj, 'email', ''),
      password: this.getString(obj, 'password', ''),
      job: this.getString(obj, 'job', 'N/A'),
      companyId: this.getNumber(obj, 'companyId', 0),
      status: this.getBoolean(obj, 'status', true),
      department_id_random: this.getNumber(obj, 'department_id_random', 0),
      department_name_ar: this.getString(obj, 'department_name_ar', 'N/A'),
      department_name_en: this.getString(obj, 'department_name_en', 'N/A'),
      address: this.getStringOrNull(obj, 'address'),
      nationality: this.getString(obj, 'nationality', 'N/A'),
      national_id: this.getStringOrNull(obj, 'national_id'),
      marital_status: this.getNumberOrNull(obj, 'marital_status'),
      marital_status_name_ar: this.getStringOrNull(obj, 'marital_status_name_ar'),
      marital_status_name_en: this.getStringOrNull(obj, 'marital_status_name_en'),
      company_emp_code: this.getStringOrNull(obj, 'company_emp_code'),
      system_emp_code: this.getStringOrNull(obj, 'system_emp_code'),
      gender: this.getNumber(obj, 'gender', 0),
      gender_name_ar: this.getStringOrNull(obj, 'gender_name_ar'),
      gender_name_en: this.getStringOrNull(obj, 'gender_name_en'),
      birthdate: this.getString(obj, 'birthdate', new Date().toISOString()),
      str_birthdate: this.getStringOrNull(obj, 'str_birthdate'),
      joining_date: this.getString(obj, 'joining_date', new Date().toISOString()),
      str_joining_date: this.getStringOrNull(obj, 'str_joining_date'),
      direct_manager_id: this.getNumberOrNull(obj, 'direct_manager_id'),
      direct_manager_name_ar: this.getStringOrNull(obj, 'direct_manager_name_ar'),
      direct_manager_name_en: this.getStringOrNull(obj, 'direct_manager_name_en'),
      employment_status: this.getNumber(obj, 'employment_status', 1),
      employment_status_name_ar: this.getString(obj, 'employment_status_name_ar', 'نشط'),
      employment_status_name_en: this.getString(obj, 'employment_status_name_en', 'Active Employee'),
      emp_image: this.getStringOrNull(obj, 'emp_image'),
      phone_no: this.getStringOrNull(obj, 'phone_no'),
      roleNameAr: this.getString(obj, 'roleNameAr', 'الدور الإفتراضي'),
      roleNameEn: this.getString(obj, 'roleNameEn', 'Default Role'),
      employment_id: this.getNumberOrNull(obj, 'employment_id'),
      employment_code: this.getStringOrNull(obj, 'employment_code'),
      roleId: this.getNumber(obj, 'roleId', 0),
      emp_session_id: this.getStringOrNull(obj, 'emp_session_id'),
      decrypted_session_id: this.getStringOrNull(obj, 'decrypted_session_id'),
      job_type: this.getNumberOrNull(obj, 'job_type'),
      job_type_name_ar: this.getStringOrNull(obj, 'job_type_name_ar'),
      job_type_name_en: this.getStringOrNull(obj, 'job_type_name_en'),
      shift_type: this.getNumberOrNull(obj, 'shift_type'),
      shift_type_name_ar: this.getStringOrNull(obj, 'shift_type_name_ar'),
      shift_type_name_en: this.getStringOrNull(obj, 'shift_type_name_en'),
    };
  }

  private getString(obj: Record<string, unknown>, key: string, fallback: string): string {
    const v = obj[key];
    return typeof v === 'string' ? v : fallback;
  }

  private getStringOrNull(obj: Record<string, unknown>, key: string): string | null {
    const v = obj[key];
    return typeof v === 'string' ? v : null;
  }

  private getNumber(obj: Record<string, unknown>, key: string, fallback: number): number {
    const v = obj[key];
    return typeof v === 'number' ? v : Number(v ?? fallback);
  }

  private getNumberOrNull(obj: Record<string, unknown>, key: string): number | null {
    const v = obj[key];
    if (v === null || v === undefined) return null;
    return typeof v === 'number' ? v : Number(v);
  }

  private getBoolean(obj: Record<string, unknown>, key: string, fallback: boolean): boolean {
    const v = obj[key];
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    if (typeof v === 'number') return v !== 0;
    return fallback;
  }

  public loadEmployees(companyId: string) {
    return this.employeesApi.getAllByCompany(companyId).pipe(
      tap((data) => {
        const mapped: Employee[] = Array.isArray(data)
          ? (data as unknown[]).map((e, i) => this.mapToEmployee(e, i))
          : [];
        this.employeesSubject.next(mapped);
      }),
    );
  }

  public addEmployee(emp: Employee) {
    this.employeesSubject.next([...this.employeesSubject.value, emp]);
  }

  public updateEmployee(updated: Employee) {
    const next = this.employeesSubject.value.map((e) => (e.id === updated.id ? updated : e));
    this.employeesSubject.next(next);
  }

  public deleteEmployee(id: number) {
    this.employeesSubject.next(this.employeesSubject.value.filter((e) => e.id !== id));
  }

  public get employees$(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }
}
