import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Interaction } from '../../core/models/interaction.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-interaction-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule, TimeAgoPipe],
  template: `
    <div class="timeline-wrapper">
      <!-- Connector line -->
      <div class="connector-line"></div>

      <div *ngFor="let item of interactions" class="timeline-item">
        <!-- Icon circle -->
        <div class="icon-circle" [ngClass]="item.type.toLowerCase()">
          <mat-icon>{{getIcon(item.type)}}</mat-icon>
        </div>

        <!-- Content Card -->
        <div class="activity-card">
          <div class="card-row-1">
            <span class="subject">{{item.subject}}</span>
            <span class="date">{{item.interactionDate | timeAgo}}</span>
          </div>
          
          <div class="card-row-2">
            <span class="type-badge" [ngClass]="'badge-' + item.type.toLowerCase()">
              {{item.type}}
            </span>
            <span class="duration" *ngIf="item.durationMinutes"> · {{item.durationMinutes}} mins</span>
          </div>
          
          <p class="description" *ngIf="item.description">
            {{item.description}}
          </p>
          
          <div *ngIf="item.outcome" class="outcome-row">
            <span class="outcome-label">OUTCOME:</span>
            <span class="outcome-tag">{{item.outcome}}</span>
          </div>
        </div>
      </div>

      <div *ngIf="interactions.length === 0" class="empty-timeline">
        No interactions recorded yet.
      </div>
    </div>
  `,
  styles: [`
    .timeline-wrapper {
      position: relative;
      padding-top: 8px;
    }

    .connector-line {
      position: absolute;
      left: 19px;
      top: 20px;
      bottom: 20px;
      width: 2px;
      background: var(--gray-100);
      z-index: 0;
    }

    .timeline-item {
      display: flex;
      gap: 16px;
      padding-bottom: 24px;
      position: relative;
    }

    .icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      flex-shrink: 0;
      box-shadow: 0 0 0 4px white;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &.call { background: #DBEAFE; color: #2563EB; }
      &.email { background: #D1FAE5; color: #059669; }
      &.meeting { background: #EDE9FE; color: #7C3AED; }
      &.note { background: #FEF3C7; color: #D97706; }
    }

    .activity-card {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 16px 20px;
      border: 1px solid var(--gray-100);
      transition: all 0.15s ease;

      &:hover {
        border-color: var(--indigo-200);
        box-shadow: 0 4px 12px rgba(99,102,241,0.08);
      }
    }

    .card-row-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .subject {
        font-size: 14px;
        font-weight: 600;
        color: var(--gray-900);
      }

      .date {
        font-size: 12px;
        color: var(--gray-400);
      }
    }

    .card-row-2 {
      margin-top: 6px;
      display: flex;
      align-items: center;

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

      .duration {
        font-size: 12px;
        color: var(--gray-400);
        margin-left: 4px;
      }
    }

    .description {
      font-size: 13px;
      color: var(--gray-600);
      margin-top: 10px;
      line-height: 1.6;
    }

    .outcome-row {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 8px;

      .outcome-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--gray-400);
        letter-spacing: 0.7px;
      }

      .outcome-tag {
        border: 1px solid var(--gray-200);
        border-radius: 6px;
        padding: 3px 10px;
        font-size: 12px;
        font-weight: 500;
        color: var(--gray-600);
        background: var(--gray-50);
      }
    }

    .empty-timeline {
      padding: 32px;
      text-align: center;
      color: var(--gray-400);
      font-style: italic;
    }
  `]
})
export class InteractionTimelineComponent {
  @Input() interactions: Interaction[] = [];

  getIcon(type: string): string {
    switch (type) {
      case 'CALL': return 'call';
      case 'EMAIL': return 'email';
      case 'MEETING': return 'groups';
      case 'NOTE': return 'sticky_note_2';
      default: return 'event';
    }
  }
}
