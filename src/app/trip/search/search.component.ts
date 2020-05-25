import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService} from '@app/services';
import {Trip, Search} from '@app/entities';
import {DatePipe} from '@angular/common';
import {first} from 'rxjs/operators';
import {faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    providers: [DatePipe]
})
export class SearchTripComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    trips: Array<Trip>;
    sortDown = faSortUp;
    search: Search;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private tripService: TripService,
        private alertService: AlertService,
        private datePipe: DatePipe) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            fromLocation: ['', Validators.required],
            toLocation: ['', Validators.required],
            minFromDate: ['', Validators.required],
            // toDate: ['', Validators.required],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        this.searchTrips();

        this.f.fromLocation.setValue(this.search.fromLocation);
        this.f.toLocation.setValue(this.search.toLocation);
        this.f.minFromDate.setValue(this.search.minFromDate);
    }

    get f() {
        return this.form.controls;
    }

    getTripsSize() {
        return this.trips === undefined ? 0 : this.trips.length;
    }

    getTrips() {
        return this.trips;
    }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const search: Search = this.form.value;

        const newUrl = new URL(window.location.href);
        // newUrl.searchParams.set('search', JSON.stringify(search));
        Object.keys(search).forEach(key => {
            if (search[key] !== undefined) {
                newUrl.searchParams.set(key, search[key]);
            }
        });

        window.location.href = newUrl.toString();
    }

    searchTrips() {
        const newUrl = new URL(window.location.href);
        this.search = {} as Search;
        let searchParamsNumber = 0;
        newUrl.searchParams.forEach((value, key) => {
            this.search[key] = value;
            searchParamsNumber++;
        });

        if (searchParamsNumber === 0) {
            return;
        }

        this.tripService.findTrips(this.search).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// create succeeded
                    this.trips = data;
                    console.log(this.trips);
                    // this.alertService.info(`Found ${this.trips.length} trip(s)`);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

    hideDiv() {
        if (this.sortDown === faSortDown) {
            this.sortDown = faSortUp;
            document.getElementById('div-filters').classList.remove('d-none');
        } else {
            this.sortDown = faSortDown;
            document.getElementById('div-filters').classList.add('d-none');
        }
    }
}
