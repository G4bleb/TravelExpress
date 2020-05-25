import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {AlertService} from '@app/services/alert.service';
import {User} from '@app/entities';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient, private alertService: AlertService) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    /** POST: add a new user to the server */
    register(userToAdd: User): Observable<{ user: User }> {
        return this.http.post<{ user: User }>(`${environment.apiUrl}/user`, userToAdd, this.httpOptions).pipe(
            tap(({user}) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                // this.log(`registered user w/ id=${user._id}`);
            }),
            catchError(this.handleError<{ user: User }>('Registration'))
        );
    }

    /** POST : log in a user using his email and his password */
    login(email: string, password: string): Observable<{ user: User }> {
        return this.http.post<{ user: User }>(`${environment.apiUrl}/user/login`, {email, password}, this.httpOptions).pipe(
            tap(({user}) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                // this.log(`logged with user w/ id=${user._id}`);
            }),
            catchError(this.handleError<{ user: User }>('Login'))
        );
    }

    /** PUT : edit the preferences for the current user */
    editProfile(replacementUser: User, token: string): Observable<{ user: User }> {
        return this.http.put<{ user: User }>(`${environment.apiUrl}/user`, replacementUser, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}),
        }).pipe(
            tap(({ user }) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                // this.log(`updated user w/ id=${user._id}`);
            }),
            catchError(this.handleError<{ user: User }>('Profile Editing'))
        );
    }

    getSessionUser(): User {
        return this.userSubject.getValue();
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
