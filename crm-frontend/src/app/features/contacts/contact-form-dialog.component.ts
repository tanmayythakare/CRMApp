import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactStatus } from '../../core/models/contact.model';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="title">{{ data ? 'Edit' : 'Create' }} Contact</h2>
        <p class="subtitle">Enter the details of your connection</p>
      </div>

      <div class="modal-content">
        <form [formGroup]="contactForm" class="contact-form">
          <div class="field-group">
            <label>Full Name</label>
            <div class="input-wrapper">
              <mat-icon class="prefix-icon">person_outline</mat-icon>
              <input type="text" formControlName="name" placeholder="E.g. John Smith" class="custom-input">
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label>Company</label>
              <div class="input-wrapper">
                <mat-icon class="prefix-icon">business</mat-icon>
                <input type="text" formControlName="company" placeholder="Acme Inc." class="custom-input">
              </div>
            </div>
            <div class="field-group">
              <label>Role</label>
              <div class="input-wrapper">
                <mat-icon class="prefix-icon">badge</mat-icon>
                <input type="text" formControlName="role" placeholder="Director" class="custom-input">
              </div>
            </div>
          </div>

          <div class="field-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <mat-icon class="prefix-icon">mail_outline</mat-icon>
              <input type="email" formControlName="email" placeholder="john@example.com" class="custom-input">
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label>Phone Number</label>
              <div class="input-wrapper">
                <mat-icon class="prefix-icon">phone_outline</mat-icon>
                <input type="text" formControlName="phone" placeholder="+1..." class="custom-input">
              </div>
            </div>
            <div class="field-group">
              <label>Status</label>
              <mat-form-field appearance="outline" class="custom-select">
                <mat-select formControlName="status">
                  <mat-option value="LEAD">Lead</mat-option>
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="CUSTOMER">Customer</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class="field-group">
            <label>Internal Notes</label>
            <div class="input-wrapper textarea-wrapper">
              <textarea formControlName="notes" placeholder="Any additional background..." class="custom-input custom-textarea" rows="3"></textarea>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" (click)="onCancel()">Cancel</button>
        <button class="btn-submit" [disabled]="contactForm.invalid || isLoading" (click)="onSave()">
          <span *ngIf="!isLoading">{{ data ? 'Update' : 'Create' }} Contact</span>
          <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container { display: flex; flex-direction: column; overflow: hidden; }
    
    .modal-header {
      padding: 24px 32px;
      border-bottom: 1px solid var(--gray-100);
      .title { font-family: 'DM Serif Display', serif; font-size: 24px; color: var(--gray-900); margin: 0; }
      .subtitle { font-size: 14px; color: var(--gray-500); margin-top: 4px; }
    }

    .modal-content {
      padding: 32px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .contact-form { display: flex; flex-direction: column; gap: 20px; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

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
          color: var(--gray-400);
        }

        .custom-input {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          border: 1.5px solid var(--gray-200);
          padding: 0 14px 0 42px;
          font-size: 14px;
          background: var(--gray-50);
          outline: none;
          transition: all 0.15s;

          &:focus {
            border-color: var(--indigo-500);
            background: white;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          }
        }
        
        &.textarea-wrapper .custom-input { padding-top: 10px; height: auto; }
        &.textarea-wrapper .prefix-icon { display: none; }
        &.textarea-wrapper .custom-input { padding-left: 14px; }
      }
    }

    .custom-select {
      width: 100%;
      ::ng-deep .mat-mdc-text-field-wrapper { height: 42px !important; background: var(--gray-50) !important; border-radius: 10px !important; }
      ::ng-deep .mat-mdc-form-field-flex { height: 42px !important; align-items: center !important; }
      ::ng-deep .mat-mdc-form-field-infix { padding: 4px 0 !important; }
    }

    .modal-actions {
      padding: 24px 32px;
      background: var(--gray-50);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid var(--gray-100);

      .btn-cancel {
        padding: 0 20px;
        height: 42px;
        border-radius: 10px;
        border: 1px solid var(--gray-200);
        background: white;
        font-size: 14px;
        font-weight: 600;
        color: var(--gray-600);
        cursor: pointer;
        &:hover { background: var(--gray-50); }
      }

      .btn-submit {
        padding: 0 24px;
        height: 42px;
        border-radius: 10px;
        border: none;
        background: var(--indigo-600);
        color: white;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(79,70,229,0.3);
        &:hover:not(:disabled) { background: var(--indigo-700); }
        &:disabled { opacity: 0.7; cursor: not-allowed; }
        ::ng-deep .mat-mdc-progress-spinner circle { stroke: white !important; }
      }
    }
  `]
})
export class ContactFormDialogComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private dialogRef: MatDialogRef<ContactFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact | null
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      role: [''],
      status: ['ACTIVE', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.contactForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const request = this.contactForm.value;

      if (this.data) {
        this.contactService.updateContact(this.data.id, request).subscribe({
          next: (res) => this.dialogRef.close(res),
          error: () => this.isLoading = false
        });
      } else {
        this.contactService.createContact(request).subscribe({
          next: (res) => this.dialogRef.close(res),
          error: () => this.isLoading = false
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
