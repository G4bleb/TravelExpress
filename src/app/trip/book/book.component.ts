import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService} from '@app/services';
import {Trip} from '@app/entities';
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
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({

        });
    }

    getTripDetail() {
        const id = Number(new URL(window.location.href).searchParams.get('id'));


        this.tripService.getTrip(id).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// create succeeded

                    // this.alertService.info(`Found ${this.trips.length} trip(s)`);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }
}
