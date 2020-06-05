import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService, UserService} from '@app/services';
import {Trip, User} from '@app/entities';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.css']
})
export class BookTripComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    trip: Trip;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private tripService: TripService,
        private alertService: AlertService,
        private userService: UserService) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({});

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

        const id: string = this.route.snapshot.paramMap.get('id');
        console.log(`Getting trip w/ id : ${id}`);

        if (id === undefined) {
            this.alertService.error('Failed to parse trip id from route');
            this.router.navigate([this.returnUrl]);
        } else {
            this.getTripDetail(id);
        }
    }

    get f() {
        return this.form.controls;
    }

    getTripDetail(id: string) {
        this.tripService.getTrip(id).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// GET succeeded
                    this.trip = data[0];
                    this.trip.toDate = new Date(this.trip.toDate);
                    this.trip.fromDate = new Date(this.trip.fromDate);

                    this.userService.get(this.trip.user as string).subscribe(
                        user => {
                            // console.log(data);
                            if (user !== undefined) {// GET succeeded
                                this.trip.user = user as User;
                            }
                        }
                    );
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        this.loading = true;

        const result = window.confirm('Are you sure you want to book a place ?');
        if (result) {

        }
    }
}
