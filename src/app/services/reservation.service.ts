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

  // POST a new reservation
  createReservation(reservation: Reservation) {
    const user: User = this.userService.getSessionUser();
    return this.http.post<Reservation>(`${environment.apiUrl}/reservation`, reservation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` })
    }).pipe(
      tap((newReservation) => {
        // this.log(`created reservation w/ id=${newReservation._id}`);
      }),
      catchError(this.handleError<Reservation>('Booking'))
    );
  }

  //GET all of the current user's reservations
  getCurrentUserReservations(): Observable<Array<Reservation>> {
    const user: User = this.userService.getSessionUser();
    return this.http.get<Array<Reservation>>(`${environment.apiUrl}/reservation`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }),
      params: { userID: user._id }
    }).pipe(
      tap((newReservation) => {
        // this.log(`created reservation w/ id=${newReservation._id}`);
      }),
      catchError(this.handleError<Array<Reservation>>('Getting all reservations'))
    );
  }

  //GET all the reservations on a specific trip (using the trip's id)
  getTripReservations(tripId:string): Observable<Array<Reservation>> {
    return this.http.get<Array<Reservation>>(`${environment.apiUrl}/reservation`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: { tripID: tripId }
    }).pipe(
      tap((newReservation) => {
        // this.log(`created reservation w/ id=${newReservation._id}`);
      }),
      catchError(this.handleError<Array<Reservation>>('Getting reservations of trip'))
    );
  }
  
  //POST pay a reservation
  payReservation(reservationId: string): Observable<Reservation> {
    const user: User = this.userService.getSessionUser();
    console.log(`${environment.apiUrl}/reservation/pay/${reservationId}`);
    console.log(`Bearer ${user.token}`);
    return this.http.post<Reservation>(`${environment.apiUrl}/reservation/pay/${reservationId}`, null,{
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }),
    }).pipe(
      tap((paidReservation) => {
        // this.log(`paid reservation w/ id=${newReservation._id}`);
      }),
      catchError(this.handleError<Reservation>('Payment'))
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
