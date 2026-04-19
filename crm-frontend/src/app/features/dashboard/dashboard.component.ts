import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { forkJoin, timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary, DailyInteractionCount, TopContact } from '../../core/models/dashboard.model';
import { Interaction } from '../../core/models/interaction.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    TimeAgoPipe
  ],
  template: `
    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Overview</h1>
        </div>
        <div class="refresh-pill">
          <mat-icon [class.spinning]="isRefreshing">refresh</mat-icon>
          <span>Auto-refreshing every 60s</span>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div *ngFor="let card of summaryCards; let i = index" 
             class="summary-card card staggered-entrance" 
             [style.animation-delay]="i * 0.08 + 's'">
          <div class="card-top">
            <span class="label">{{card.label}}</span>
            <div class="icon-container" [style.background-color]="card.iconBg">
              <mat-icon [style.color]="card.iconColor">{{card.icon}}</mat-icon>
            </div>
          </div>
          <div class="card-bottom">
            <div class="value">{{summary ? $any(summary)[card.key] : '0'}}</div>
            <div class="trend" *ngIf="card.trend">
              <mat-icon>trending_up</mat-icon>
              <span>{{card.trend}} this month</span>
            </div>
          </div>
          <!-- Decorative accent -->
          <svg class="decorative-accent" viewBox="0 0 100 100" [style.color]="card.iconColor">
            <circle cx="80" cy="80" r="40" fill="currentColor" fill-opacity="0.1" />
          </svg>
        </div>
      </div>

      <div class="main-grid">
        <!-- Chart Column -->
        <div class="chart-section card">
          <div class="chart-header">
            <div class="titles">
              <h3>Interactions — last 30 days</h3>
              <span class="sub" *ngIf="summary">{{summary.interactionsThisWeek * 4}} total</span>
            </div>
            <div class="period-tabs">
              <span class="tab">7d</span>
              <span class="tab active">30d</span>
              <span class="tab">90d</span>
            </div>
          </div>
          <div class="chart-content">
            <canvas *ngIf="chartData" baseChart
              [data]="chartData"
              [options]="chartOptions"
              [type]="'bar'">
            </canvas>
            <div *ngIf="!chartData" class="chart-loader">
              <mat-spinner diameter="30"></mat-spinner>
            </div>
          </div>
        </div>

        <!-- Recent Activity Column -->
        <div class="activity-section card">
          <div class="section-header">
            <mat-icon>history</mat-icon>
            <h3>Recent Activity</h3>
          </div>
          <div class="activity-list">
            <div *ngFor="let activity of recentInteractions" class="activity-item" [routerLink]="['/contacts', activity.contactId]">
              <div class="type-icon" [ngClass]="activity.type.toLowerCase()">
                <mat-icon>{{getIcon(activity.type)}}</mat-icon>
              </div>
              <div class="activity-details">
                <div class="contact-name">{{activity.contactName}}</div>
                <div class="subject">{{activity.subject}}</div>
              </div>
              <div class="time-ago">{{activity.interactionDate | timeAgo}}</div>
            </div>
            <div *ngIf="recentInteractions.length === 0" class="empty-state">
              No recent activity found.
            </div>
          </div>
          <a routerLink="/interactions" class="view-all-link">View all →</a>
        </div>
      </div>

      <!-- Most Engaged Contacts Section -->
      <div class="engaged-section card">
        <div class="section-header-top">
          <div class="section-header">
            <mat-icon class="stars-icon">star</mat-icon>
            <h3>Most Engaged Contacts</h3>
          </div>
          <a routerLink="/contacts" class="view-all-link">View all →</a>
        </div>

        <div class="table-responsive">
          <table class="engaged-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>CONTACT</th>
                <th>INTERACTIONS</th>
                <th>LAST CONTACT</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let contact of topContacts; let i = index" [routerLink]="['/contacts', contact.contactId]">
                <td>
                  <span class="rank-circle">{{i + 1}}</span>
                </td>
                <td>
                  <div class="contact-box">
                    <span class="name">{{contact.contactName}}</span>
                  </div>
                </td>
                <td>
                  <div class="engagement-box">
                    <span class="count">{{contact.interactionCount}}</span>
                    <div class="mini-bar-bg">
                      <div class="mini-bar" [style.width.%]="(contact.interactionCount / (topContacts[0]?.interactionCount || 1)) * 100"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="last-active">{{contact.lastInteractionDate | timeAgo}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }

    .refresh-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--indigo-50);
      border: 1px solid var(--indigo-200);
      border-radius: 20px;
      padding: 6px 14px;
      color: var(--indigo-600);
      font-size: 12px;
      font-weight: 500;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        &.spinning {
          animation: spin 2s linear infinite;
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      padding: 24px;
      position: relative;
      overflow: hidden;

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        .label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--gray-400);
        }

        .icon-container {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          mat-icon { font-size: 22px; width: 22px; height: 22px; }
        }
      }

      .card-bottom {
        .value {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          line-height: 1;
          color: var(--gray-900);
        }
        .trend {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--green-500);
          font-weight: 500;
          mat-icon { font-size: 14px; width: 14px; height: 14px; }
        }
      }

      .decorative-accent {
        position: absolute;
        right: -10px;
        bottom: -10px;
        width: 60px;
        height: 60px;
      }
    }

    .main-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
      margin-bottom: 20px;
    }

    .chart-section {
      padding: 24px;
      display: flex;
      flex-direction: column;

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h3 { font-size: 16px; font-weight: 600; color: var(--gray-800); margin: 0; }
        .sub { font-size: 13px; color: var(--gray-400); margin-left: 12px; }

        .period-tabs {
          display: flex;
          gap: 4px;
          background: var(--gray-50);
          padding: 4px;
          border-radius: 10px;

          .tab {
            font-size: 12px;
            font-weight: 500;
            color: var(--gray-500);
            padding: 4px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s;

            &.active {
              background: var(--indigo-600);
              color: white;
            }
          }
        }
      }

      .chart-content {
        flex: 1;
        height: 240px;
        position: relative;
      }

      .chart-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }

    .activity-section {
      padding: 24px;
      display: flex;
      flex-direction: column;

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
        mat-icon { color: var(--indigo-500); font-size: 18px; width: 18px; height: 18px; }
        h3 { font-size: 16px; font-weight: 600; color: var(--gray-800); margin: 0; }
      }

      .activity-list {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .activity-item {
        display: flex;
        gap: 12px;
        padding: 14px 0;
        border-bottom: 1px solid var(--gray-100);
        cursor: pointer;
        transition: transform 0.15s;

        &:hover { transform: translateX(4px); }
        &:last-child { border-bottom: none; }

        .type-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          mat-icon { font-size: 18px; width: 18px; height: 18px; }

          &.call { background: #DBEAFE; color: #2563EB; }
          &.email { background: #D1FAE5; color: #059669; }
          &.meeting { background: #EDE9FE; color: #7C3AED; }
          &.note { background: #FEF3C7; color: #D97706; }
        }

        .activity-details {
          flex: 1;
          min-width: 0;
          .contact-name { font-size: 14px; font-weight: 600; color: var(--gray-900); }
          .subject { font-size: 13px; color: var(--gray-500); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        }

        .time-ago { font-size: 12px; color: var(--gray-400); white-space: nowrap; }
      }

      .view-all-link {
        margin-top: 16px;
        text-align: right;
        font-size: 13px;
        font-weight: 600;
        color: var(--indigo-600);
        text-decoration: none;
      }
    }

    .engaged-section {
      padding: 24px;
      
      .section-header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        .stars-icon { color: var(--amber-500); }
        h3 { font-size: 16px; font-weight: 600; color: var(--gray-800); margin: 0; }
      }

      .engaged-table {
        width: 100%;
        border-collapse: collapse;

        th {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: var(--gray-400);
          padding: 12px 0;
          text-align: left;
        }

        tr {
          cursor: pointer;
          border-bottom: 1px solid var(--gray-100);
          &:hover { background: var(--indigo-50); }
          &:last-child { border-bottom: none; }
        }

        td { padding: 14px 0; vertical-align: middle; }

        .rank-circle {
          display: inline-flex;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--indigo-600);
          color: white;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .name { font-size: 14px; font-weight: 600; color: var(--gray-900); }

        .engagement-box {
          display: flex;
          align-items: center;
          gap: 12px;
          .count { font-size: 14px; font-weight: 700; color: var(--gray-900); min-width: 20px; }
          .mini-bar-bg { flex: 1; max-width: 80px; height: 6px; background: var(--gray-100); border-radius: 3px; overflow: hidden; }
          .mini-bar { height: 100%; background: var(--indigo-500); }
        }

        .last-active { font-size: 13px; color: var(--gray-400); }
      }
    }

    .staggered-entrance {
      animation: fadeInUp 0.4s ease forwards;
      opacity: 0;
    }

    @media (max-width: 1024px) {
      .summary-cards { grid-template-columns: repeat(2, 1fr); }
      .main-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .summary-cards { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  recentInteractions: Interaction[] = [];
  topContacts: TopContact[] = [];
  isRefreshing = false;
  
  chartData: ChartConfiguration<'bar'>['data'] | null = null;
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F172A',
        bodyColor: '#475569',
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
      } as any
    },
    scales: {
      y: { grid: { color: '#F1F5F9' }, border: { display: false }, ticks: { color: '#94A3B8', font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { size: 11 } } }
    }
  };

  summaryCards = [
    { label: 'Total Contacts', key: 'totalContacts', icon: 'people', iconBg: '#EEF2FF', iconColor: '#4F46E5' },
    { label: 'Active Contacts', key: 'activeContacts', icon: 'check_circle', iconBg: '#D1FAE5', iconColor: '#059669', trend: '↑ 12%' },
    { label: 'Interactions (LW)', key: 'interactionsThisWeek', icon: 'chat', iconBg: '#EEF2FF', iconColor: '#6366F1', trend: '↑ 8%' },
    { label: 'Follow-ups Due', key: 'followUpsDue', icon: 'error', iconBg: '#FEF3C7', iconColor: '#D97706' }
  ];

  private refreshSub: Subscription | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.refreshSub = timer(0, 60000).pipe(
      switchMap(() => {
        this.isRefreshing = true;
        return forkJoin({
          summary: this.dashboardService.getSummary(),
          chart: this.dashboardService.getInteractionChart(),
          recent: this.dashboardService.getRecentInteractions(),
          top: this.dashboardService.getTopContacts()
        });
      })
    ).subscribe(res => {
      this.summary = res.summary;
      this.recentInteractions = res.recent;
      this.topContacts = res.top;
      this.prepareChartData(res.chart);
      setTimeout(() => this.isRefreshing = false, 1000);
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  private prepareChartData(chartData: DailyInteractionCount[]): void {
    this.chartData = {
      labels: chartData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          data: chartData.map(d => d.count),
          backgroundColor: '#6366F1E6', // var(--indigo-500) with 90% opacity
          hoverBackgroundColor: '#4338CA', // var(--indigo-700)
          borderRadius: 6,
          barThickness: 12
        }
      ]
    };
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
}
