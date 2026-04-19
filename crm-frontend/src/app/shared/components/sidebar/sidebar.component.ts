import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">
          <mat-icon>analytics</mat-icon>
        </div>
        <span class="logo-text">CRM Hub</span>
      </div>

      <nav class="nav-links">
        <a *ngFor="let item of navItems" 
           [routerLink]="item.route" 
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
           class="nav-item">
          <mat-icon>{{item.icon}}</mat-icon>
          <span>{{item.label}}</span>
        </a>
      </nav>

      <div class="user-profile">
        <div class="avatar">
          {{getInitials(authService.user()?.fullName || 'User')}}
        </div>
        <div class="user-info">
          <p class="name">{{authService.user()?.fullName}}</p>
          <p class="email">{{authService.user()?.email}}</p>
        </div>
        <button mat-icon-button [matMenuTriggerFor]="profileMenu" class="menu-btn">
          <mat-icon>more_vert</mat-icon>
        </button>
        
        <mat-menu #profileMenu="matMenu" xPosition="after" yPosition="above">
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon class="text-red-500">logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 256px;
      background: var(--indigo-900);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      box-shadow: 4px 0 24px rgba(0,0,0,0.12);
      z-index: 100;
    }

    .logo-area {
      padding: 24px 20px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: var(--indigo-500);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-text {
      color: white;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
      margin-left: 12px;
    }

    .nav-links {
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .nav-item {
      padding: 10px 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255,255,255,0.55);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.18s ease;
      text-decoration: none;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: inherit;
      }

      &:hover {
        background: rgba(255,255,255,0.07);
        color: rgba(255,255,255,0.85);
      }

      &.active {
        background: var(--indigo-600);
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(99,102,241,0.35);

        mat-icon {
          color: white;
        }
      }
    }

    .user-profile {
      margin-top: auto;
      padding: 16px 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--indigo-500);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      min-width: 0;

      .name {
        color: white;
        font-size: 13px;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .email {
        color: rgba(255,255,255,0.45);
        font-size: 12px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .menu-btn {
      color: rgba(255,255,255,0.4) !important;
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;

      mat-icon {
        font-size: 18px;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Contacts', icon: 'people', route: '/contacts' },
    { label: 'Interactions', icon: 'forum', route: '/interactions' }
  ];

  constructor(public authService: AuthService) {}

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
