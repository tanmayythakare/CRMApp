import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          authService.logout();
          errorMessage = 'Session expired. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied.';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        } else {
          errorMessage = error.error?.message || 'Server error';
        }
      }

      snackBar.open(errorMessage, 'Close', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top' });
      return throwError(() => error);
    })
  );
};
