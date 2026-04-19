import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContactService } from '../../core/services/contact.service';
import { Contact, ContactStatus } from '../../core/models/contact.model';
import { ContactFormDialogComponent } from './contact-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="contacts-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Contacts</h1>
          <p class="subtitle">Manage and track your customer relationships</p>
        </div>
        
        <button class="btn-primary" (click)="onAddContact()">
          <mat-icon>add</mat-icon>
          Add Contact
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar card">
        <div class="search-wrapper">
          <mat-icon class="search-icon">search</mat-icon>
          <input type="text" [formControl]="searchControl" placeholder="Search contacts..." class="search-input">
        </div>

        <mat-form-field appearance="outline" class="status-select-field">
          <mat-select [formControl]="statusFilter">
            <mat-option [value]="null">All Statuses</mat-option>
            <mat-option value="ACTIVE">Active</mat-option>
            <mat-option value="LEAD">Lead</mat-option>
            <mat-option value="CUSTOMER">Customer</mat-option>
            <mat-option value="INACTIVE">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Table Card -->
      <div class="table-card card">
        <div *ngIf="isLoading" class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="table-responsive">
          <table class="contacts-table">
            <thead>
              <tr>
                <th>CONTACT</th>
                <th>COMPANY</th>
                <th>STATUS</th>
                <th class="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let contact of contacts" (click)="onViewDetail(contact)" class="data-row">
                <td>
                  <div class="contact-info">
                    <div class="avatar" [ngStyle]="getAvatarStyles(contact.name)">
                      {{ getInitials(contact.name) }}
                    </div>
                    <div>
                      <div class="name-link">{{contact.name}}</div>
                      <div class="email-sub">{{contact.email}}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="company-name">{{contact.company || '—'}}</div>
                  <div class="role-sub">{{contact.role || '—'}}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + contact.status.toLowerCase()">
                    {{contact.status}}
                  </span>
                </td>
                <td class="text-right actions-cell" (click)="$event.stopPropagation()">
                  <button mat-icon-button (click)="onEdit(contact)" class="edit-btn" title="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="onDelete(contact)" class="delete-btn" title="Delete">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr *ngIf="contacts.length === 0 && !isLoading">
                <td colspan="4">
                  <div class="empty-state">
                    <mat-icon class="empty-icon">search_off</mat-icon>
                    <h3>No contacts found</h3>
                    <p>Try adjusting your search or add a new contact</p>
                    <button class="btn-primary mt-4" (click)="onAddContact()">
                      <mat-icon>add</mat-icon>
                      Add Contact
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <mat-paginator [length]="totalElements"
                       [pageSize]="pageSize"
                       [pageSizeOptions]="[5, 10, 20, 50]"
                       (page)="onPageChange($event)"
                       class="custom-paginator">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .contacts-container {
      max-width: 1400px;
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

      .status-select-field {
        width: 160px;
        ::ng-deep .mat-mdc-form-field-wrapper {
          padding-bottom: 0;
        }
        ::ng-deep .mat-mdc-text-field-wrapper {
          height: 42px;
          background: var(--gray-50) !important;
          border-radius: 10px !important;
        }
        ::ng-deep .mat-mdc-form-field-flex {
          height: 42px !important;
          align-items: center !important;
        }
        ::ng-deep .mat-mdc-form-field-infix {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
      }
    }

    .table-card {
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

    .contacts-table {
      width: 100%;
      border-collapse: collapse;

      thead {
        background: var(--gray-50);
        border-bottom: 1.5px solid var(--gray-100);

        th {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: var(--gray-400);
          padding: 14px 20px;
          text-align: left;
        }
      }

      .data-row {
        border-bottom: 1px solid var(--gray-100);
        transition: background 0.12s;
        cursor: pointer;

        &:hover {
          background: var(--indigo-50);
          
          .name-link {
            color: var(--indigo-600);
            text-decoration: underline;
          }
        }

        &:last-child {
          border-bottom: none;
        }

        td {
          padding: 12px 20px;
          vertical-align: middle;
        }
      }
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
      }

      .name-link {
        font-size: 14px;
        font-weight: 600;
        color: var(--gray-900);
        transition: color 0.15s;
      }

      .email-sub {
        font-size: 12px;
        color: var(--gray-400);
        margin-top: 2px;
      }
    }

    .company-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-700);
    }

    .role-sub {
      font-size: 12px;
      color: var(--gray-400);
      margin-top: 2px;
    }

    .actions-cell {
      white-space: nowrap;

      .edit-btn, .delete-btn {
        color: var(--gray-400);
        transition: all 0.15s;
        border-radius: 8px;

        &:hover {
          background: var(--indigo-50);
          color: var(--indigo-600);
        }
      }

      .delete-btn:hover {
        background: #FEF2F2;
        color: var(--red-500);
      }
    }

    .empty-state {
      padding: 64px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--gray-200);
        margin-bottom: 16px;
      }

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: var(--gray-400);
      }
    }

    .custom-paginator {
      background: var(--gray-50) !important;
      border-top: 1.5px solid var(--gray-100);
      font-size: 13px;
      color: var(--gray-500);
    }

    .text-right { text-align: right; }
  `]
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  isLoading = false;

  searchControl = new FormControl('');
  statusFilter = new FormControl<ContactStatus | null>(null);

  private avatarColorPairs = [
    { bg: '#FEE2E2', text: '#DC2626' }, // Red
    { bg: '#DBEAFE', text: '#2563EB' }, // Blue
    { bg: '#D1FAE5', text: '#059669' }, // Green
    { bg: '#FEF3C7', text: '#D97706' }, // Amber
    { bg: '#EDE9FE', text: '#7C3AED' }, // Purple
    { bg: '#FCE7F3', text: '#DB2777' }, // Pink
    { bg: '#E0F2FE', text: '#0284C7' }, // Sky
    { bg: '#F1F5F9', text: '#475569' }, // Slate
  ];

  constructor(
    private contactService: ContactService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContacts();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadContacts();
    });

    this.statusFilter.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadContacts();
    });
  }

  loadContacts(): void {
    this.isLoading = true;
    const search = this.searchControl.value || '';
    const status = this.statusFilter.value || undefined;

    this.contactService.getContacts(this.currentPage, this.pageSize, search, status)
      .subscribe({
        next: (response) => {
          this.contacts = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Error loading contacts', 'Close', { duration: 3000 });
        }
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getAvatarStyles(name: string) {
    const charCodeSum = (name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const pair = this.avatarColorPairs[charCodeSum % this.avatarColorPairs.length];
    return {
      'background-color': pair.bg,
      'color': pair.text
    };
  }

  onAddContact(): void {
    const dialogRef = this.dialog.open(ContactFormDialogComponent, {
      width: '560px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Contact added successfully', 'Close', { duration: 3000 });
        this.loadContacts();
      }
    });
  }

  onEdit(contact: Contact): void {
    const dialogRef = this.dialog.open(ContactFormDialogComponent, {
      width: '560px',
      data: contact,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Contact updated successfully', 'Close', { duration: 3000 });
        this.loadContacts();
      }
    });
  }

  onDelete(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { name: contact.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteContact(contact.id).subscribe({
          next: () => {
            this.snackBar.open('Contact deleted successfully', 'Close', { duration: 3000 });
            this.loadContacts();
          },
          error: () => this.snackBar.open('Error deleting contact', 'Close', { duration: 3000 })
        });
      }
    });
  }

  onViewDetail(contact: Contact): void {
    this.router.navigate(['/contacts', contact.id]);
  }
}
