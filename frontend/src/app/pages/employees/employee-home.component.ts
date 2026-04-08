import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-employee-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="employee-shell">
      <div class="hero-card">
        <div>
          <p class="label">Protected Route</p>
          <h2>Employee Dashboard</h2>
          <p class="supporting-text">
            Your session token is stored through Angular dependency injection and persisted in local storage.
          </p>
        </div>

        <div class="token-card">
          <p class="token-title">Current Session Token</p>
          <code>{{ sessionService.token() || 'No active session' }}</code>
        </div>
      </div>

      <div class="grid">
        <article>
          <h3>Routing and Navigation</h3>
          <p>Login and signup routes are public. The employees route is protected by an auth guard.</p>
        </article>

        <article>
          <h3>Reactive Forms</h3>
          <p>Both authentication screens use Angular reactive forms with validation for required fields and password rules.</p>
        </article>

        <article>
          <h3>Session Management</h3>
          <p>The token is kept in a shared service so other components and future guards can read the same auth state.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .employee-shell {
      display: grid;
      gap: 24px;
    }

    .hero-card {
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.9fr);
      padding: 28px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.26);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
    }

    .label {
      margin: 0 0 8px;
      color: #7c3aed;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    h2,
    h3 {
      margin: 0 0 8px;
    }

    .supporting-text,
    article p,
    .token-title {
      margin: 0;
      color: #475569;
    }

    .token-card {
      padding: 18px;
      border-radius: 20px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }

    code {
      display: block;
      margin-top: 12px;
      overflow-wrap: anywhere;
      color: #1e3a8a;
    }

    .grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    article {
      padding: 22px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.24);
    }

    @media (max-width: 900px) {
      .hero-card,
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeHomeComponent {
  protected readonly sessionService = inject(SessionService);
}
