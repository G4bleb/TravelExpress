import {Component, OnInit} from '@angular/core';
import {UserService} from '@app/services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
    }

    getUser() {
        return this.userService.getSessionUser();
    }
}
