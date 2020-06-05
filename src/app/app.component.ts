import {Component} from '@angular/core';
import {Router} from '@angular/router';

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
        this.router.navigate(['/']);
    }
}
