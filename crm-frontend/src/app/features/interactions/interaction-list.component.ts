import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InteractionService } from '../../core/services/interaction.service';
import { Interaction, InteractionType } from '../../core/models/interaction.model';
import { InteractionTimelineComponent } from './interaction-timeline.component';
import { InteractionFormDialogComponent } from './interaction-form-dialog.component';

@Component({
  selector: 'app-interaction-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    InteractionTimelineComponent
  ],
  template: `
    <div class="interactions-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Interactions</h1>
          <p class="subtitle">All communications across your contacts</p>
        </div>
        
        <button class="btn-primary" (click)="onLogInteraction()">
          <mat-icon>add</mat-icon>
          Log Interaction
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar card">
        <mat-form-field appearance="outline" class="filter-select">
          <mat-select [formControl]="typeFilter">
            <mat-option [value]="null">All Types</mat-option>
            <mat-option value="CALL">Calls</mat-option>
            <mat-option value="EMAIL">Email</mat-option>
            <mat-option value="MEETING">Meetings</mat-option>
            <mat-option value="NOTE">Notes</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-select period-select">
          <mat-select [formControl]="daysFilter">
            <mat-option [value]="7">Last 7 days</mat-option>
            <mat-option [value]="30">Last 30 days</mat-option>
            <mat-option [value]="90">Last 90 days</mat-option>
            <mat-option [value]="365">All time</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="search-wrapper">
          <mat-icon class="search-icon">search</mat-icon>
          <input type="text" [formControl]="searchControl" placeholder="Search by subject or contact..." class="search-input">
        </div>
      </div>

      <!-- Interactions List -->
      <div class="list-card card">
        <div *ngIf="isLoading" class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div *ngFor="let group of groupedInteractions" class="date-group">
          <div class="date-header">{{group.dateLabel}}</div>
          
          <div *ngFor="let item of group.items" class="interaction-item">
            <div class="type-icon" [ngClass]="item.type.toLowerCase()">
              <mat-icon>{{getIcon(item.type)}}</mat-icon>
            </div>
            
            <div class="item-content">
              <div class="row-1">
                <span class="subject">{{item.subject}}</span>
                <span class="type-badge" [ngClass]="'badge-' + item.type.toLowerCase()">{{item.type}}</span>
              </div>
              
              <div class="row-2">
                <a [routerLink]="['/contacts', item.contactId]" class="contact-link">{{item.contactName}}</a>
                <span class="divider"> · </span>
                <span class="time">{{item.interactionDate | date:'shortTime'}}</span>
                <span class="duration" *ngIf="item.durationMinutes"> · {{item.durationMinutes}} mins</span>
              </div>
              
              <div *ngIf="item.outcome" class="outcome-row">
                <span class="outcome-label">OUTCOME:</span>
                <span class="outcome-tag">{{item.outcome}}</span>
              </div>
            </div>

            <div class="item-actions">
              <button mat-icon-button class="edit-btn">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button class="delete-btn">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="groupedInteractions.length === 0 && !isLoading" class="empty-state">
          <mat-icon class="empty-icon">forum</mat-icon>
          <h3>No interactions yet</h3>
          <p>Start logging calls, emails, and meetings</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .interactions-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;

      .subtitle {
        font-size: 14px;
        color: var(--gray-500);
        margin-top: 4px;
      }
    }

    .filter-bar {
      padding: 16px 20px;
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;

      .filter-select {
        width: 160px;
        ::ng-deep .mat-mdc-text-field-wrapper { height: 42px; background: var(--gray-50) !important; border-radius: 10px !important; }
        ::ng-deep .mat-mdc-form-field-flex { height: 42px !important; align-items: center !important; }
        ::ng-deep .mat-mdc-form-field-infix { padding-top: 8px !important; padding-bottom: 8px !important; }
      }

      .period-select { width: 180px; }

      .search-wrapper {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--gray-400);
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        .search-input {
          width: 100%;
          height: 42px;
          border: 1.5px solid var(--gray-200);
          border-radius: 10px;
          padding: 0 14px 0 40px;
          font-size: 14px;
          background: var(--gray-50);
          outline: none;
          transition: all 0.15s;

          &:focus {
            border-color: var(--indigo-400);
            background: white;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          }
        }
      }
    }

    .list-card {
      overflow: hidden;
      position: relative;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.7);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-blur: 2px;
    }

    .date-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: var(--gray-400);
      padding: 14px 24px 6px;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-100);
    }

    .interaction-item {
      padding: 20px 24px;
      border-bottom: 1px solid var(--gray-100);
      display: flex;
      gap: 16px;
      align-items: flex-start;
      transition: background 0.12s;
      cursor: pointer;

      &:hover {
        background: var(--indigo-50);
      }

      &:last-child {
        border-bottom: none;
      }

      .type-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon { font-size: 20px; width: 20px; height: 20px; }

        &.call { background: #DBEAFE; color: #2563EB; }
        &.email { background: #D1FAE5; color: #059669; }
        &.meeting { background: #EDE9FE; color: #7C3AED; }
        &.note { background: #FEF3C7; color: #D97706; }
      }

      .item-content {
        flex: 1;

        .row-1 {
          display: flex;
          align-items: center;
          gap: 12px;

          .subject { font-size: 15px; font-weight: 600; color: var(--gray-900); }
          .type-badge {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            
            &.badge-call { background: #DBEAFE; color: #1E40AF; }
            &.badge-email { background: #D1FAE5; color: #065F46; }
            &.badge-meeting { background: #EDE9FE; color: #5B21B6; }
            &.badge-note { background: #FEF3C7; color: #92400E; }
          }
        }

        .row-2 {
          margin-top: 4px;
          display: flex;
          align-items: center;
          font-size: 13px;

          .contact-link { color: var(--indigo-600); font-weight: 500; text-decoration: none; &:hover { text-decoration: underline; } }
          .divider, .time, .duration { color: var(--gray-400); }
        }

        .outcome-row {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;

          .outcome-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--gray-400); letter-spacing: 0.7px; }
          .outcome-tag { border: 1px solid var(--gray-200); border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 500; color: var(--gray-600); background: var(--gray-50); }
        }
      }

      .item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;

        .edit-btn, .delete-btn {
          color: var(--gray-400);
          border-radius: 8px;
          &:hover { background: var(--indigo-50); color: var(--indigo-600); }
        }
        .delete-btn:hover { background: #FEF2F2; color: var(--red-500); }
      }
    }

    .empty-state {
      padding: 64px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .empty-icon { font-size: 64px; width: 64px; height: 64px; color: var(--gray-200); margin-bottom: 16px; }
      h3 { font-size: 18px; font-weight: 600; color: var(--gray-700); margin-bottom: 8px; }
      p { font-size: 14px; color: var(--gray-400); }
    }
  `]
})
export class InteractionListComponent implements OnInit {
  groupedInteractions: { dateLabel: string, items: Interaction[] }[] = [];
  interactions: Interaction[] = [];
  isLoading = false;

  typeFilter = new FormControl<InteractionType | null>(null);
  daysFilter = new FormControl<number>(30);
  searchControl = new FormControl('');

  constructor(
    private interactionService: InteractionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInteractions();

    this.typeFilter.valueChanges.subscribe(() => this.loadInteractions());
    this.daysFilter.valueChanges.subscribe(() => this.loadInteractions());
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.loadInteractions());
  }

  loadInteractions(): void {
    this.isLoading = true;
    const type = this.typeFilter.value || undefined;
    const days = this.daysFilter.value || 30;
    const search = this.searchControl.value || undefined;

    this.interactionService.getInteractions(undefined, days, type).subscribe({
      next: (res) => {
        this.interactions = res;
        if (search) {
          const s = search.toLowerCase();
          this.interactions = this.interactions.filter(i => 
            i.subject.toLowerCase().includes(s) || 
            i.contactName?.toLowerCase().includes(s)
          );
        }
        this.groupInteractions();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  groupInteractions(): void {
    const groups: { [key: string]: Interaction[] } = {};
    
    this.interactions.forEach(item => {
      const date = new Date(item.interactionDate);
      const label = this.getDateLabel(date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });

    this.groupedInteractions = Object.keys(groups).map(label => ({
      dateLabel: label,
      items: groups[label]
    }));
  }

  getDateLabel(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (checkDate.getTime() === today.getTime()) return 'Today';
    if (checkDate.getTime() === yesterday.getTime()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined }).toUpperCase();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'CALL': return 'call';
      case 'EMAIL': return 'email';
      case 'MEETING': return 'groups';
      case 'NOTE': return 'sticky_note_2';
      default: return 'event';
    }
  }

  onLogInteraction(): void {
    const dialogRef = this.dialog.open(InteractionFormDialogComponent, {
      width: '520px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInteractions();
      }
    });
  }
}
