import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="!text-xl !font-bold">Confirm Delete</h2>
    <mat-dialog-content>
      <p class="text-slate-600">Are you sure you want to delete <span class="font-bold text-slate-800">{{data.name}}</span>? This action cannot be undone.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="!pb-6 !px-6 gap-2">
      <button mat-button (click)="dialogRef.close(false)" class="!rounded-xl px-4">Cancel</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)" class="!rounded-xl px-4 bg-red-600 hover:bg-red-700">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}
}

import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
