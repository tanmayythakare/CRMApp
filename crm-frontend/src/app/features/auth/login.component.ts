import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-wrapper">
      <!-- Left Panel -->
      <div class="left-panel">
        <div class="logo-area">
          <div class="logo-icon">
            <mat-icon>analytics</mat-icon>
          </div>
          <span class="logo-text">CRM Hub</span>
        </div>

        <div class="middle-content">
          <div class="quote-mark">“</div>
          <h1 class="tagline">Every relationship, perfectly tracked.</h1>
          <p class="tagline-sub">Turn contacts into long-term partnerships with CRM Hub.</p>

          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>people_outline</mat-icon></div>
              <span>Contact & interaction tracking</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>insights</mat-icon></div>
              <span>Real-time dashboard insights</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><mat-icon>groups</mat-icon></div>
              <span>Team-ready from day one</span>
            </div>
          </div>
        </div>

        <div class="bottom-copy">
          © 2025 CRM Hub. Built for teams.
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="form-card card">
          <div class="form-header">
            <h2 class="welcome-title">Welcome back</h2>
            <p class="welcome-sub">Sign in to your workspace</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="field-group">
              <label>Email Address</label>
              <div class="input-wrapper">
                <mat-icon class="prefix-icon">mail_outline</mat-icon>
                <input type="email" formControlName="email" placeholder="name@company.com" class="custom-input">
              </div>
            </div>

            <div class="field-group">
              <label>Password</label>
              <div class="input-wrapper">
                <mat-icon class="prefix-icon">lock_outline</mat-icon>
                <input [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="••••••••" class="custom-input">
                <button type="button" class="suffix-btn" (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </div>
            </div>

            <button type="submit" class="submit-btn" [disabled]="isLoading">
              <span *ngIf="!isLoading">Sign In</span>
              <div *ngIf="isLoading" class="loading-state">
                <mat-spinner diameter="20" color="accent"></mat-spinner>
                <span>Signing in...</span>
              </div>
            </button>
          </form>

          <div class="demo-box">
            <div class="divider">
              <span>OR</span>
            </div>
            <div class="credentials-plate">
              <div class="cp-left">
                <div class="cp-label">DEMO CREDENTIALS</div>
                <div class="cp-values">admin&#64;crm.com / admin123</div>
              </div>
              <a href="javascript:void(0)" class="use-btn" (click)="fillDemo()">Use these</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: grid;
      grid-template-columns: 45% 55%;
      height: 100vh;
      overflow: hidden;
    }

    .left-panel {
      background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
      padding: 60px 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      position: relative;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 16px;
      .logo-icon {
        width: 52px;
        height: 52px;
        background: rgba(255,255,255,0.12);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        mat-icon { font-size: 28px; width: 28px; height: 28px; }
      }
      .logo-text { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    }

    .middle-content {
      .quote-mark {
        font-family: 'DM Serif Display', serif;
        font-size: 80px;
        color: rgba(255,255,255,0.12);
        line-height: 1;
        margin-bottom: -10px;
      }
      .tagline {
        font-family: 'DM Serif Display', serif;
        font-size: 34px;
        line-height: 1.3;
        margin: 0;
      }
      .tagline-sub {
        font-size: 15px;
        color: rgba(255,255,255,0.55);
        margin-top: 16px;
        line-height: 1.7;
      }
      .features-list {
        margin-top: 48px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .feature-item {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 14px;
        color: rgba(255,255,255,0.7);
        font-weight: 500;
        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          mat-icon { font-size: 18px; width: 18px; height: 18px; }
        }
      }
    }

    .bottom-copy {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
    }

    .right-panel {
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 40px;
    }

    .form-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
    }

    .form-header {
      margin-bottom: 32px;
      .welcome-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--gray-900); margin: 0; }
      .welcome-sub { font-size: 14px; color: var(--gray-500); margin-top: 4px; }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field-group {
      label { display: block; font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px; }
      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .prefix-icon {
          position: absolute;
          left: 14px;
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--gray-400);
        }

        .custom-input {
          width: 100%;
          height: 46px;
          border-radius: 10px;
          border: 1.5px solid var(--gray-200);
          padding: 0 14px 0 44px;
          font-size: 14px;
          color: var(--gray-800);
          background: var(--gray-50);
          transition: all 0.15s;
          outline: none;

          &:focus {
            border-color: var(--indigo-500);
            background: white;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          }
        }

        .suffix-btn {
          position: absolute;
          right: 10px;
          border: none;
          background: none;
          color: var(--gray-400);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          &:hover { background: var(--gray-100); }
          mat-icon { font-size: 18px; width: 18px; height: 18px; }
        }
      }
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      background: var(--indigo-600);
      color: white;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.2px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(79,70,229,0.4);
      transition: all 0.18s;
      margin-top: 8px;

      &:hover:not(:disabled) {
        background: var(--indigo-700);
        box-shadow: 0 6px 20px rgba(79,70,229,0.5);
        transform: translateY(-1px);
      }

      &:active:not(:disabled) { transform: translateY(0); }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        ::ng-deep .mat-mdc-progress-spinner circle { stroke: white !important; }
      }
    }

    .demo-box {
      margin-top: 32px;
      .divider {
        position: relative;
        text-align: center;
        margin-bottom: 24px;
        &::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--gray-100); z-index: 0; }
        span { background: white; padding: 0 12px; position: relative; z-index: 1; font-size: 11px; font-weight: 700; color: var(--gray-300); }
      }
    }

    .credentials-plate {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 10px;
      padding: 14px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .cp-label { font-size: 10px; font-weight: 700; color: var(--gray-400); letter-spacing: 0.8px; }
      .cp-values { font-size: 13px; color: var(--gray-600); font-weight: 500; margin-top: 4px; }
      .use-btn { color: var(--indigo-600); font-size: 12px; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }
    }

    @media (max-width: 768px) {
      .login-wrapper { grid-template-columns: 1fr; }
      .left-panel { display: none; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  fillDemo(): void {
    this.loginForm.patchValue({
      email: 'admin@crm.com',
      password: 'admin123'
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.isLoading = false
      });
    }
  }
}
