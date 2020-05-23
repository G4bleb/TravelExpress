import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Trip, User} from '@app/entities';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertService} from '@app/services/alert.service';
import {environment} from '@environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TripService {

    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient, private alertService: AlertService) {

    }

    /** POST create a trip */
    createTrip(trip: Trip) {
        const user: User = JSON.parse(localStorage.getItem('user'));
        return this.http.post<Trip>(`${environment.apiUrl}/trip`, trip, {
            headers: new HttpHeaders({'Content-Type': 'application/json'}).set('Authorization', 'BEARER <' + user.token + '>'),
        }).pipe(
            // tslint:disable-next-line:no-shadowed-variable
            tap((trip: Trip) => {
                this.log(`created trip w/ id=${trip._id}`);
            }),
            catchError(this.handleError<User>('Registration'))
        );
    }

    findTrips() {

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
            this.log(`${operation} failed`);
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a UserService message with the AlertService */
    private log(message: string) {
        this.alertService.error(message);
    }
}
