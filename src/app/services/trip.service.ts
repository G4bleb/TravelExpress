import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Trip, User} from '@app/entities';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertService} from '@app/services/alert.service';
import {environment} from '@environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {UserService} from '@app/services/user.service';
import {Search} from '@app/entities/search';

@Injectable({
    providedIn: 'root'
})
export class TripService {

    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient,
                private alertService: AlertService,
                private userService: UserService) {

    }

    /** POST create a trip */
    createTrip(tripToAdd: Trip) {
        const user: User = this.userService.getSessionUser();
        return this.http.post<Trip>(`${environment.apiUrl}/trip`, tripToAdd, {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`}),
        }).pipe(
            tap((trip: Trip) => {
                // this.log(`created trip w/ id=${trip._id}`);
            }),
            catchError(this.handleError<User>('Trip creation'))
        );
    }

    findTrips(search: Search): Observable<Array<Trip>> {
        return this.http.get<Array<Trip>>(`${environment.apiUrl}/trip?`, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}), params: search as any
        }).pipe(
            tap((trips) => {
                // this.log('Got some trips : ' + trips.length);
            }),
            catchError(this.handleError<Array<Trip>>('Trip research'))
        );
    }

    getTrip(id: string): Observable<{ trip: Trip }> {
        return this.http.get<{ trip: Trip }>(`${environment.apiUrl}/trip?`, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}), params: id as any
        }).pipe(
            tap((trip) => {
                // this.log(`got trip w/ id=${trip._id}`);
            }),
            catchError(this.handleError<{ trip: Trip }>('Trip research'))
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
