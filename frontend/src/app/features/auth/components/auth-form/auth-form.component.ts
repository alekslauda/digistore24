import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  isLogin = true;
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';
      const { username, password } = this.form.value;

      const authObservable = this.isLogin
        ? this.authService.login(username, password)
        : this.authService.register(username, password);

      authObservable.subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/chat']);
          } else {
            this.error = this.isLogin
              ? 'Invalid username or password'
              : 'Registration failed. Please try again.';
          }
        },
        error: (err) => {
          this.error = err || 'An unexpected error occurred';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.loading = false;
    this.error = '';
    this.form.reset();
  }
}
