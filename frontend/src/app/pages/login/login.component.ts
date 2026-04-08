import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card">
      <div>
        <p class="label">Welcome!</p>
        <h2>Login</h2>
        <p class="supporting-text">Sign in before accessing the employee management screens.</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
        <label>
          Username or Email
          <input type="text" formControlName="usernameOrEmail" placeholder="Enter username or email" />
        </label>
        @if (showFieldError('usernameOrEmail')) {
          <p class="error-text">Username or email is required.</p>
        }

        <label>
          Password
          <input type="password" formControlName="password" placeholder="Enter password" />
        </label>
        @if (showFieldError('password')) {
          <p class="error-text">Password must be at least 6 characters.</p>
        }

        @if (errorMessage()) {
          <p class="error-banner">{{ errorMessage() }}</p>
        }

        <button type="submit" [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Signing in...' : 'Login' }}
        </button>
      </form>

      <p class="footer-link">
        Need an account?
        <a routerLink="/signup">Create one here</a>
      </p>
    </section>
  `,
  styles: [`
    .auth-card {
      max-width: 520px;
      margin: 0 auto;
      padding: 32px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.26);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
      display: grid;
      gap: 24px;
    }

    .label {
      margin: 0 0 8px;
      color: #0f766e;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 2rem;
    }

    .supporting-text,
    .footer-link {
      margin: 0;
      color: #475569;
    }

    form {
      display: grid;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 8px;
      color: #334155;
      font-weight: 600;
    }

    input {
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      padding: 12px 14px;
      font: inherit;
    }

    input:focus {
      outline: 2px solid #0f766e;
      outline-offset: 2px;
      border-color: #0f766e;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 14px 18px;
      background: linear-gradient(135deg, #0f766e, #2563eb);
      color: white;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    .error-text,
    .error-banner {
      margin: 0;
      color: #b91c1c;
      font-size: 0.95rem;
    }

    .error-banner {
      padding: 12px 14px;
      border-radius: 14px;
      background: #fee2e2;
    }

    a {
      color: #1d4ed8;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly loginForm = this.fb.nonNullable.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  showFieldError(fieldName: 'usernameOrEmail' | 'password'): boolean {
    const control = this.loginForm.get(fieldName);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { usernameOrEmail, password } = this.loginForm.getRawValue();

    this.isSubmitting.set(true);

    this.authService.login(usernameOrEmail, password).subscribe({
      next: () => {
        this.sessionService.setUserDisplayName(usernameOrEmail);
        this.isSubmitting.set(false);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.message ?? 'Login failed. Please try again.');
      }
    });
  }
}
