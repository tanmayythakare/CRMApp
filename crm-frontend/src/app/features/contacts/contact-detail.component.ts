import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { ContactService } from '../../core/services/contact.service';
import { InteractionService } from '../../core/services/interaction.service';
import { InteractionTimelineComponent } from '../interactions/interaction-timeline.component';
import { InteractionFormDialogComponent } from '../interactions/interaction-form-dialog.component';
import { ContactFormDialogComponent } from './contact-form-dialog.component';
import { Contact } from '../../core/models/contact.model';
import { Interaction } from '../../core/models/interaction.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    InteractionTimelineComponent
  ],
  template: `
    <div *ngIf="contact" class="detail-container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <a routerLink="/contacts">Contacts</a>
        <mat-icon>chevron_right</mat-icon>
        <span>{{contact.name}}</span>
      </nav>

      <!-- Header Card -->
      <div class="header-card card">
        <div class="avatar" [ngStyle]="getAvatarStyles(contact.name)">
          {{getInitials(contact.name)}}
        </div>
        
        <div class="info-block">
          <h1 class="name">{{contact.name}}</h1>
          <p class="role-company">{{contact.role || 'No role'}} &#64; {{contact.company || 'Private'}}</p>
          <div class="badge-row">
            <span class="badge" [ngClass]="'badge-' + contact.status.toLowerCase()">
              {{contact.status}}
            </span>
          </div>
          <div class="tags-row">
            <div class="tag-pill">
              <mat-icon>mail</mat-icon>
              <span>{{contact.email}}</span>
            </div>
            <div class="tag-pill" *ngIf="contact.phone">
              <mat-icon>call</mat-icon>
              <span>{{contact.phone}}</span>
            </div>
          </div>
        </div>

        <div class="actions">
          <button mat-icon-button (click)="onEdit()" class="edit-btn">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button class="delete-btn">
            <mat-icon>delete_outline</mat-icon>
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-pill card">
          <div class="stat-value">{{interactions.length}}</div>
          <div class="stat-label">Total Interactions</div>
        </div>
        <div class="stat-pill card">
          <div class="stat-value">{{getLastContactDate()}}</div>
          <div class="stat-label">Last Contact</div>
        </div>
        <div class="stat-pill card">
          <div class="stat-value">{{getMemberSinceDate()}}</div>
          <div class="stat-label">Member Since</div>
        </div>
      </div>

      <!-- Interaction Timeline Section -->
      <div class="timeline-section">
        <div class="section-header">
          <h2>Interaction History</h2>
          <button class="btn-primary" (click)="onAddInteraction()">
            <mat-icon>add</mat-icon>
            Log Interaction
          </button>
        </div>

        <div class="timeline-container">
          <app-interaction-timeline [interactions]="interactions"></app-interaction-timeline>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="!contact" class="loading-state">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 13px;
      color: var(--gray-400);

      a {
        color: inherit;
        text-decoration: none;
        transition: color 0.15s;
        &:hover { color: var(--indigo-600); }
      }

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      span {
        color: var(--gray-800);
        font-weight: 500;
      }
    }

    .header-card {
      padding: 32px;
      display: flex;
      gap: 24px;
      align-items: flex-start;
      margin-bottom: 16px;

      .avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: 700;
        flex-shrink: 0;
      }

      .info-block {
        flex: 1;

        .name {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: var(--gray-900);
          margin: 0;
        }

        .role-company {
          font-size: 15px;
          color: var(--gray-500);
          margin-top: 4px;
        }

        .badge-row {
          margin-top: 10px;
        }

        .tags-row {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: wrap;

          .tag-pill {
            display: flex;
            align-items: center;
            gap: 6px;
            background: var(--gray-50);
            border: 1px solid var(--gray-100);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            color: var(--gray-600);

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
              color: var(--gray-400);
            }
          }
        }
      }

      .actions {
        display: flex;
        gap: 8px;

        .edit-btn, .delete-btn {
          color: var(--gray-400);
          border-radius: 8px;
          &:hover { background: var(--indigo-50); color: var(--indigo-600); }
        }
        .delete-btn:hover { background: #FEF2F2; color: var(--red-500); }
      }
    }

    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;

      .stat-pill {
        flex: 1;
        padding: 16px 20px;
        text-align: left;

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: var(--gray-900);
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--gray-400);
          margin-top: 2px;
        }
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        font-size: 16px;
        font-weight: 600;
        color: var(--gray-800);
        margin: 0;
        font-family: inherit !important; /* Overriding global display font for this specific header */
      }

      .btn-primary {
        padding: 8px 16px;
      }
    }

    .timeline-container {
      background: transparent;
    }

    .loading-state {
      padding: 100px 0;
      display: flex;
      justify-content: center;
    }
  `]
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;
  interactions: Interaction[] = [];

  private avatarColorPairs = [
    { bg: '#FEE2E2', text: '#DC2626' },
    { bg: '#DBEAFE', text: '#2563EB' },
    { bg: '#D1FAE5', text: '#059669' },
    { bg: '#FEF3C7', text: '#D97706' },
    { bg: '#EDE9FE', text: '#7C3AED' },
    { bg: '#FCE7F3', text: '#DB2777' },
    { bg: '#E0F2FE', text: '#0284C7' },
    { bg: '#F1F5F9', text: '#475569' },
  ];

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private interactionService: InteractionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: string): void {
    forkJoin({
      contact: this.contactService.getContactById(id),
      interactions: this.interactionService.getInteractions(id)
    }).subscribe({
      next: (res) => {
        this.contact = res.contact;
        this.interactions = res.interactions.sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime());
      },
      error: () => this.snackBar.open('Error loading contact details', 'Close', { duration: 3000 })
    });
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getAvatarStyles(name: string) {
    const charCodeSum = (name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const pair = this.avatarColorPairs[charCodeSum % this.avatarColorPairs.length];
    return { 'background-color': pair.bg, 'color': pair.text };
  }

  getLastContactDate(): string {
    if (!this.interactions.length) return '—';
    const last = this.interactions[0];
    return new Date(last.interactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMemberSinceDate(): string {
    if (!this.contact?.createdAt) return '—';
    return new Date(this.contact.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  onEdit(): void {
    const dialogRef = this.dialog.open(ContactFormDialogComponent, {
      width: '560px',
      data: this.contact
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contact = result;
        this.snackBar.open('Contact updated', 'Close', { duration: 3000 });
      }
    });
  }

  onAddInteraction(): void {
    if (!this.contact) return;

    const dialogRef = this.dialog.open(InteractionFormDialogComponent, {
      width: '520px',
      data: { contactId: this.contact.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Activity logged', 'Close', { duration: 3000 });
        this.loadInteractions(this.contact!.id);
      }
    });
  }

  loadInteractions(id: string): void {
    this.interactionService.getInteractions(id).subscribe({
      next: (res) => {
        this.interactions = res.sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime());
      },
      error: () => this.snackBar.open('Error loading interactions', 'Close', { duration: 3000 })
    });
  }
}

