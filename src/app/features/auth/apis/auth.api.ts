import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@shared/lib/custom-api-connector.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private api: ApiClientService) {}

  public login(email: string, password: string, lang: string = 'ar'): Observable<unknown> {
    // Relative path so it uses baseUrl from config; pass query as params
    return this.api.get('erp/Erp_Users/erp_login', {
      params: { email, password, lang },
    });
  }
}
