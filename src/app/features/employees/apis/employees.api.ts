import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@shared/lib/custom-api-connector.service';

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  constructor(private api: ApiClientService) {}

  public getAllByCompany(companyId: string): Observable<unknown> {
    return this.api.get('erp/Mangement/get_all_erp_employees_by_company_id', {
      params: { company_id: companyId },
    });
  }
}
