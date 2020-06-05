import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AlertService, TripService, UserService} from '@app/services';
import {Search, Trip, User} from '@app/entities';
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
    trips: Array<Trip>;
    filtersToggleIcon = faPlus;
    search: Search;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private tripService: TripService,
        private userService: UserService,
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

        if (this.f.minFromDate.value === undefined || this.f.minFromDate.value === '') {
            this.f.minFromDate.setValue(this.getDateWithTimezone(new Date()));
            // console.log(this.f.minFromDate.value);

            // this.f.minFromDate.setValue(new Date().toISOString().substring(0, 16))
        }

        this.route.queryParamMap.subscribe(params => {
            this.searchTrips(params);
        });
    }

    getDateWithTimezone(date: Date): string {
        const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        return (new Date(date.getTime() - tzoffset)).toISOString().substring(0, 16);
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

        let search: Search;
        if (this.filtersToggleIcon === faMinus) {// If filters are on (div open)
            search = this.filterForm.value;
        } else {
            search = {} as Search;
        }
        search.fromLocation = this.f.fromLocation.value;
        search.toLocation = this.f.toLocation.value;
        search.minFromDate = this.f.minFromDate.value;

        const newparams = {};

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
                newparams[key] = search[key];
            }
        });

        this.router.navigate([], {queryParams: newparams});
    }

    searchTrips(params: ParamMap) {
        this.loading = true;
        this.search = {} as Search;
        let searchParamsCount = 0;

        params.keys.forEach(key => {
            this.search[key] = params.get(key);
            if (key.includes('Date')) {// When it's a date, we have to convert it to be processed by the API
                this.search[key] = new Date(this.search[key]); // form field (string) to Date object
            }
            if (key.includes('Talk')) {// On regarde les champs minTalk et maxTalk pour afficher la bonne valeur dans le range
                if (params.get(key) === 'no') {
                    this.ff[key].setValue(0);
                } else if (params.get(key) === 'little') {
                    this.ff[key].setValue(1);
                } else if (params.get(key) === 'yes') {
                    this.ff[key].setValue(2);
                }
            }
            searchParamsCount++;
        });

        if (searchParamsCount === 0) {
            return;
        }

        this.f.fromLocation.setValue(this.search.fromLocation);
        this.f.toLocation.setValue(this.search.toLocation);
        this.f.minFromDate.setValue(this.getDateWithTimezone(this.search.minFromDate));
        if (this.filtersToggleIcon === faMinus) { // If filters are on (div open)
            if (this.search.minToDate !== undefined) {
                this.ff.minToDate.setValue(this.getDateWithTimezone(this.search.minToDate));
            }
            this.ff.minLuggage.setValue(this.search.minLuggage);
            this.ff.minSeats.setValue(this.search.minSeats);
            // @ts-ignore smoke n'est pas un booléen donc faut comparer avec la valeur string
            if (this.search.smoke !== undefined && this.search.smoke === 'true') {
                this.ff.smoke.setValue(this.search.smoke);
            }
        }

        this.tripService.findTrips(this.search).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// search succeeded
                    this.trips = data;
                    this.trips.forEach(trip => {
                        trip.toDate = new Date(trip.toDate);
                        trip.fromDate = new Date(trip.fromDate);
                        // We got user id, we need its infos
                        this.userService.get(String(trip.user)).subscribe(
                            user => {
                                // console.log(data);
                                if (user !== undefined) {// GET succeeded
                                    trip.user = user as User;
                                }
                            }
                        );
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

    toggleFiltersDiv() {
        if (this.filtersToggleIcon === faPlus) {
            this.filtersToggleIcon = faMinus;
            document.getElementById('div-filters').classList.remove('d-none');
        } else {
            this.filtersToggleIcon = faPlus;
            document.getElementById('div-filters').classList.add('d-none');
        }
    }

    book(tripId: string) {
        this.router.navigate(['/trip/book', tripId]);
    }
}
