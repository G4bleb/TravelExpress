import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService} from '@app/services';
import {Search, Trip} from '@app/entities';
import {first} from 'rxjs/operators';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchTripComponent implements OnInit {
    form: FormGroup;
    filterForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    trips: Array<Trip>;
    sortDown = faMinus;
    search: Search;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private tripService: TripService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            fromLocation: ['', Validators.required],
            toLocation: ['', Validators.required],
            minFromDate: ['', Validators.required],
            // toDate: ['', Validators.required],
        });

        this.filterForm = this.formBuilder.group({
            minToDate: [''],
            minSeats: ['', [Validators.min(1), Validators.max(10)]],
            minLuggage: [''],
            smoke: [false],
            minTalk: [0],
            maxTalk: [2],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        this.searchTrips();

        if (this.f.minFromDate.value === undefined || this.f.minFromDate.value === '') {
            this.f.minFromDate.setValue(this.getCurrentDateTimeWithTimezone());
            // console.log(this.f.minFromDate.value);

            // this.f.minFromDate.setValue(new Date().toISOString().substring(0, 16))
        }

    }

    getCurrentDateTimeWithTimezone(): string {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
        return (new Date(Date.now() - tzoffset)).toISOString().substring(0, 16);
    }

    get f() {
        return this.form.controls;
    }

    get ff() {
        return this.filterForm.controls;
    }

    getTripsSize() {
        return this.trips === undefined ? 0 : this.trips.length;
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
        const search: Search = this.filterForm.value;
        search.fromLocation = this.f.fromLocation.value;
        search.toLocation = this.f.toLocation.value;
        search.minFromDate = this.f.minFromDate.value;

        const newUrl = new URL(window.location.href.split('?')[0]);

        // newUrl.searchParams.set('search', JSON.stringify(search));
        Object.keys(search).forEach(key => {
            if (search[key] !== undefined && search[key] !== null && search[key] !== 'null' && search[key] !== '') {
                if (key.includes('Talk')) { // On regade minTalk et maxTalk pour parser la bonne valeur à partir du range
                    if (search[key] === 0) {
                        search[key] = 'no';
                    } else if (search[key] === 1) {
                        search[key] = 'little';
                    } else if (search[key] === 2) {
                        search[key] = 'yes';
                    }
                }
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
            if (key.includes('Date')) {// When it's a date, we have to convert it to be processed by the API
                this.search[key] = new Date(this.search[key]); // form field (string) to Date object
            }
            if (key.includes('Talk')) {// On regarde les champs minTalk et maxTalk pour afficher la bonne valeur dans le range
                if (value === 'no') {
                    this.ff[key].setValue(0);
                } else if (value === 'little') {
                    this.ff[key].setValue(1);
                } else if (value === 'yes') {
                    this.ff[key].setValue(2);
                }
            }
            searchParamsNumber++;
        });

        if (searchParamsNumber === 0) {
            return;
        }

        this.f.fromLocation.setValue(this.search.fromLocation);
        this.f.toLocation.setValue(this.search.toLocation);
        this.f.minFromDate.setValue(this.search.minFromDate.toISOString().substring(0, 16));
        if (this.search.minToDate !== undefined) {
            this.ff.minToDate.setValue(this.search.minToDate.toISOString().substring(0, 10));
        }
        this.ff.minLuggage.setValue(this.search.minLuggage);
        this.ff.minSeats.setValue(this.search.minSeats);
        // @ts-ignore smoke n'est pas un booléen donc faut comparer avec la valeur string
        if (this.search.smoke !== undefined && this.search.smoke === 'true') {
            this.ff.smoke.setValue(this.search.smoke);
        }

        console.log(this.search);

        this.tripService.findTrips(this.search).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// create succeeded
                    this.trips = data;
                    this.trips.forEach(trip => {
                        trip.toDate = new Date(trip.toDate);
                        trip.fromDate = new Date(trip.fromDate);
                    });
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
        if (this.sortDown === faPlus) {
            this.sortDown = faMinus;
            document.getElementById('div-filters').classList.remove('d-none');
        } else {
            this.sortDown = faPlus;
            document.getElementById('div-filters').classList.add('d-none');
        }
    }

    book(tripId: number) {
        window.location.href = '/trip/book?id=' + tripId;
    }
}
