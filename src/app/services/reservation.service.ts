import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation, Trip, User } from '@app/entities';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from '@app/services/alert.service';
import { environment } from '@environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from '@app/services/user.service';
import { Search } from '@app/entities/search';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    private alertService: AlertService,
    private userService: UserService) {

  }

  createReservation(reservation: Reservation) {
    const user: User = this.userService.getSessionUser();
    console.log(reservation);
    return this.http.post<Reservation>(`${environment.apiUrl}/reservation`, reservation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` })
    }).pipe(
      tap((newReservation) => {
        this.log(`created reservation w/ id=${newReservation._id}`);
      }),
      catchError(this.handleError<Reservation>('Booking'))
    );
  }

  /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed`);
      // this.log(`${operation} failed: ${error.message}`);
      this.log(`${operation} failed: ${error.error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the AlertService */
  private log(message: string) {
    this.alertService.error(message);
  }
}
