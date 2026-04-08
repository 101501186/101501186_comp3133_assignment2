import { Component, inject } from '@angular/core';
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

  logout(): void {
    this.sessionService.clearToken();
    this.router.navigate(['/login']);
  }
}
