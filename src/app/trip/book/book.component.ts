import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService, UserService} from '@app/services';
import {Reservation, Trip, User} from '@app/entities';
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
        this.form = this.formBuilder.group({
            seats: [1, [Validators.min(1), Validators.max(10)]],
            paid: [true]
        });

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

                    console.log(this.trip.user);

                    this.userService.get(String(this.trip.user)).subscribe(
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

        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        const result = window.confirm('Are you sure you want to book ' + Number(this.f.seats.value) + ' place(s) ? ' +
            '\nIt\'s gonna cost you : ' + Number(this.f.seats.value * 5) + ' $CAD');
        if (result) {
            const reservation: Reservation = this.form.value;
            reservation.trip = this.trip;
            reservation.user = this.userService.getSessionUser();
            this.tripService.bookReservation(reservation).pipe(first()).subscribe(
                data => {
                    this.loading = false;
                    if (data !== undefined) {// POST succeeded
                        this.alertService.success('Reservation successfully created', {keepAfterRouteChange: true});
                        this.router.navigate([this.returnUrl]);
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            );
        } else {
            this.loading = false;
        }
    }
}
