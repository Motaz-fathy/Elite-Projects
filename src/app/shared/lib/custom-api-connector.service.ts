/* eslint-disable no-magic-numbers */
import { ApplicationInitStatus, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ReactiveConfigService } from '@deejayy/reactive-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ConfigVars } from 'src/app/app.module';

export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string>;
  params?: Record<string, string | number | boolean>;
  withCredentials?: boolean;
  responseType?: 'json';
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private baseUrl = '';

  constructor(
    private http: HttpClient,
    private config: ReactiveConfigService<ConfigVars>,
    private initStatus: ApplicationInitStatus,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.initStatus.donePromise.then(() => {
      this.baseUrl = this.config.get('apiUrl') ?? '';
    });
  }

  public get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.get<T>(url, httpOptions).pipe(catchError((err) => this.handleError(err)));
  }

  public post<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.post<T>(url, body, httpOptions).pipe(catchError((err) => this.handleError(err)));
  }

  public put<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.put<T>(url, body, httpOptions).pipe(catchError((err) => this.handleError(err)));
  }

  public delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.delete<T>(url, httpOptions).pipe(catchError((err) => this.handleError(err)));
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path; // absolute URL, don't prefix
    }
    const base = this.baseUrl || this.config.get('apiUrl') || '';
    const needsSlash = !base.endsWith('/') && !path.startsWith('/');
    return `${base}${needsSlash ? '/' : ''}${path}`;
  }

  private buildHttpOptions(options?: ApiRequestOptions) {
    const headers = this.createHeaders(options?.headers);
    const params = this.createParams(options?.params);
    return {
      headers,
      params,
      withCredentials: options?.withCredentials ?? false,
      responseType: options?.responseType ?? 'json',
    };
  }

  private createHeaders(headers?: HttpHeaders | Record<string, string>): HttpHeaders {
    let httpHeaders = headers instanceof HttpHeaders ? headers : new HttpHeaders(headers ?? {});
    const token = this.getToken();
    if (token && !httpHeaders.has('Authorization')) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }
    return httpHeaders;
  }

  private createParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private getToken(): string | null {
    return (
      sessionStorage.getItem('auth_token') ??
      localStorage.getItem('auth_token') ??
      sessionStorage.getItem('token') ??
      localStorage.getItem('token')
    );
  }

  // Global error handler: show a notification and optionally redirect to login for 401/403
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any) {
    const status = Number(error?.status ?? 0);
    const message = String(error?.message ?? 'Unexpected error');

    if (status === 401 || status === 403) {
      this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 4000 });
      // Optional: clear token (uncomment if desired)
      // sessionStorage.removeItem('auth_token'); localStorage.removeItem('auth_token');
      this.router.navigate(['/auth/login']).catch(() => {});
    } else {
      this.snackBar.open(message, 'Close', { duration: 4000 });
    }

    return throwError(() => error);
  }
}
