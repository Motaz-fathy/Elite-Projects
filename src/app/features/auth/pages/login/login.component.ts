import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public loading = false;
  public errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email ?? '', password ?? '').subscribe({
      next: (companyId) => {
        this.loading = false;
        if (companyId) {
          this.router.navigate(['/employees']);
        } else {
          this.errorMsg = 'Login succeeded but companyId was not found in the response.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Login failed. Please check credentials.';
      },
    });
  }
}
