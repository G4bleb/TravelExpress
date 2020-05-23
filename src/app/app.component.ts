import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '@app/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'TravelExpress';

    constructor(private router: Router) {
    }

    getUser() {
        return localStorage.getItem('user');
    }

    logout() {
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}
