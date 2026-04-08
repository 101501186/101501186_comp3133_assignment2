import { PLATFORM_ID, Injectable, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tokenStorageKey = 'comp3133_token';
  private readonly userStorageKey = 'comp3133_user';
  private readonly tokenState = signal(this.readStoredToken());
  private readonly userState = signal(this.readStoredUser());

  readonly token = computed(() => this.tokenState());
  readonly userDisplayName = computed(() => this.userState());
  readonly isAuthenticated = computed(() => Boolean(this.tokenState()));

  ensureSessionLoaded(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.tokenState()) {
      this.tokenState.set(localStorage.getItem(this.tokenStorageKey));
    }

    if (!this.userState()) {
      this.userState.set(localStorage.getItem(this.userStorageKey));
    }
  }

  setSession(token: string, userDisplayName: string): void {
    this.tokenState.set(token);
    this.userState.set(userDisplayName);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenStorageKey, token);
      localStorage.setItem(this.userStorageKey, userDisplayName);
    }
  }

  setUserDisplayName(userDisplayName: string): void {
    this.userState.set(userDisplayName);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userStorageKey, userDisplayName);
    }
  }

  clearToken(): void {
    this.tokenState.set(null);
    this.userState.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenStorageKey);
      localStorage.removeItem(this.userStorageKey);
    }
  }

  private readStoredToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(this.tokenStorageKey);
  }

  private readStoredUser(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(this.userStorageKey);
  }
}
