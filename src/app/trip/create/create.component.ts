import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService, UserService} from '@app/services';
import {Trip} from '@app/entities';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateTripComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

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
            user: [this.userService.getSessionUser()],
            fromLocation: ['', Validators.required],
            toLocation: ['', Validators.required],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            repeat: ['', Validators.required],
            endRepeat: ['', Validators.required],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        const trip: Trip = this.form.value;

        this.loading = true;
        this.tripService.createTrip(trip).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// create succeeded
                    this.alertService.success('Trip successfully created', {keepAfterRouteChange: true});
                    window.location.href = this.returnUrl;
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }
}
