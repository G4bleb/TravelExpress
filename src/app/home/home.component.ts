import {Component, OnInit} from '@angular/core';
import {UserService} from '@app/services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    getUser() {
        return localStorage.getItem('user');
    }
}
