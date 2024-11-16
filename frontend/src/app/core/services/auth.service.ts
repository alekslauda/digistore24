import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:4141/api/users';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ user: any; token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          const user: User = {
            id: response.user.id,
            username: response.user.username,
            token: response.token,
          };
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }),
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          const serverError = error.error?.message || 'Registration failed';
          return throwError(() => new Error(serverError));
        })
      );
  }

  register(username: string, password: string): Observable<boolean> {
  return this.http
    .post<{ user: any; token: string }>(`${this.apiUrl}/register`, { username, password })
    .pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const serverError = error.error?.message || 'Registration failed';
        return throwError(() => new Error(serverError));
      })
    );
}

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value || !!localStorage.getItem('user');
  }
}
