import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.sessionService.ensureSessionLoaded();
  }

  getHeaderUserDisplayName(): string {
    const sessionUser = this.sessionService.userDisplayName();

    if (sessionUser) {
      return sessionUser;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return 'Current user';
    }

    return localStorage.getItem('comp3133_user') || 'Current user';
  }

  logout(): void {
    this.sessionService.clearToken();
    this.router.navigate(['/login']);
  }
}
