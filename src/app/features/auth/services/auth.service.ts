import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthApiService } from '../apis/auth.api';
import { LoginResponse } from '../models/user.model';
import { SESSION_COMPANY_ID_KEY } from '../constants/auth.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: AuthApiService) {}

  public login(email: string, password: string): Observable<string> {
    return this.api.login(email, password).pipe(
      map((resp) => this.extractCompanyId(resp)),
      tap((companyId) => {
        if (companyId) {
          sessionStorage.setItem(SESSION_COMPANY_ID_KEY, companyId);
        }
      }),
    );
  }

  public getCompanyId(): string | null {
    return sessionStorage.getItem(SESSION_COMPANY_ID_KEY);
  }

  private extractCompanyId(resp: unknown): string {
    const candidate = resp as LoginResponse;
    const idValue = candidate.company_id ?? candidate.companyId ?? '';
    return typeof idValue === 'number' ? String(idValue) : (idValue ?? '');
  }
}
