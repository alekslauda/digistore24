import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Message, MessageStatus } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:4141/api/messages';

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  all(): Observable<Message[]> {
    return this.http
      .get<{ items: any[] }>(this.apiUrl)
      .pipe(
        map((response) =>
          response.items.map((item) => new Message(item.message, item.status))
        ),
        tap((messages) => this.messagesSubject.next(messages)),
        catchError((error: HttpErrorResponse) => {
          const serverError = error.error?.message || 'Unknown error';
          return throwError(() => new Error(serverError));
        })
      );
  }

  createMessage(text: string): Observable<Message> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User not authenticated'));
        }

        const body = { text, creator: user.id };
        const token = user.token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http
          .post<{ message: any }>(this.apiUrl, body, { headers })
          .pipe(
            map((response) => new Message(response.message.message, MessageStatus.SENT)),
            catchError((error: HttpErrorResponse) => {
              const serverError = error.error?.message || 'Unknown error';
              return throwError(() => new Error(serverError));
            })
          );
      })
    );
  }

  add(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }
}
