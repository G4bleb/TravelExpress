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
            repeat: ['no', Validators.required],
            endRepeat: [null],
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
        trip.fromDate = new Date(trip.fromDate);
        trip.toDate = new Date(trip.toDate);
        if (trip.repeat === 'no') { // S'il n'y a pas de répétition du voyage alors on met la date de fin de répétition à null
            trip.endRepeat = null;
        } else {
            // Sinon comme il y a répétition on vérifie que la date de fin est bien après aujourd'hui
            trip.endRepeat = new Date(trip.endRepeat);
            if (trip.endRepeat.getTime() < Date.now()) {
                this.f.endRepeat.setErrors({'today': true});
            }
        }
        if (trip.fromDate.getTime() > trip.toDate.getTime()) { // Si la date de départ est après la date d'arrivée
            this.f.toDate.setErrors({'incorrect': true});
        }
        if (trip.fromDate.getTime() < Date.now()) { // Si la date de départ est avant aujourd'hui
            this.f.fromDate.setErrors({'today': true});
        }
        if (trip.toDate.getTime() < Date.now()) { // Si la date d'arrivée est avant aujourd'hui
            this.f.toDate.setErrors({'today': true});
        }

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

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

    showFrequencyEnding() {
        if (this.f.repeat.value !== 'no') {
            if (document.getElementById('div-endrepeat').classList.contains('d-none')) {
                document.getElementById('div-endrepeat').classList.remove('d-none');
            }
        } else {
            if (!document.getElementById('div-endrepeat').classList.contains('d-none')) {
                document.getElementById('div-endrepeat').classList.add('d-none');
            }
        }
    }
}
