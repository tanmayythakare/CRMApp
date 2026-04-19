import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen" style="background: var(--bg)">
      <!-- Only show sidebar if not on login page -->
      <app-sidebar *ngIf="!isLoginPage()"></app-sidebar>
      
      <main class="flex-1 overflow-auto" [style.padding]="isLoginPage() ? '0' : '32px 36px'">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
