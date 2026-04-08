import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card">
      <div>
        <p class="label">Create account</p>
        <h2>Signup</h2>
        <p class="supporting-text">Register a new user before accessing the employee management screens.</p>
      </div>

      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" novalidate>
        <label>
          Username
          <input type="text" formControlName="username" placeholder="Choose a username" />
        </label>
        @if (showFieldError('username')) {
          <p class="error-text">Username is required.</p>
        }

        <label>
          Email
          <input type="email" formControlName="email" placeholder="Enter your email" />
        </label>
        @if (showFieldError('email')) {
          <p class="error-text">Enter a valid email address.</p>
        }

        <label>
          Password
          <input type="password" formControlName="password" placeholder="Create a password" />
        </label>
        @if (showFieldError('password')) {
          <p class="error-text">Password must be at least 6 characters.</p>
        }

        <label>
          Confirm Password
          <input type="password" formControlName="confirmPassword" placeholder="Re-enter your password" />
        </label>
        @if (signupForm.hasError('passwordMismatch') && (signupForm.dirty || signupForm.touched)) {
          <p class="error-text">Passwords must match.</p>
        }

        @if (successMessage()) {
          <p class="success-banner">{{ successMessage() }}</p>
        }

        @if (errorMessage()) {
          <p class="error-banner">{{ errorMessage() }}</p>
        }

        <button type="submit" [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Creating account...' : 'Signup' }}
        </button>
      </form>

      <p class="footer-link">
        Already registered?
        <a routerLink="/login">Login here</a>
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
      color: #1d4ed8;
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
      outline: 2px solid #2563eb;
      outline-offset: 2px;
      border-color: #2563eb;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 14px 18px;
      background: linear-gradient(135deg, #2563eb, #0f766e);
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
    .error-banner,
    .success-banner {
      margin: 0;
      font-size: 0.95rem;
    }

    .error-text,
    .error-banner {
      color: #b91c1c;
    }

    .success-banner {
      color: #166534;
      padding: 12px 14px;
      border-radius: 14px;
      background: #dcfce7;
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
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly signupForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  showFieldError(fieldName: 'username' | 'email' | 'password'): boolean {
    const control = this.signupForm.get(fieldName);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.signupForm.getRawValue();

    this.isSubmitting.set(true);

    this.authService.signup(username ?? '', email ?? '', password ?? '').subscribe({
      next: (message) => {
        this.isSubmitting.set(false);
        this.successMessage.set(message);
        this.signupForm.reset();
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.message ?? 'Signup failed. Please try again.');
      }
    });
  }
}
