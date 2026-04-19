import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(this.getUserFromStorage());
  
  user = computed(() => this.userSignal());
  isLoggedIn = computed(() => !!this.userSignal());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => {
        localStorage.setItem('crm_token', res.token);
        localStorage.setItem('crm_user', JSON.stringify({ id: res.id, email: res.email, fullName: res.fullName }));
        this.userSignal.set({ id: res.id, email: res.email, fullName: res.fullName });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('crm_token');
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('crm_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
