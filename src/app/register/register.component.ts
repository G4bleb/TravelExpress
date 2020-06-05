import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {first} from 'rxjs/operators';

import {User} from '@app/entities';
import {AlertService, UserService} from '@app/services';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) {
    }

    get f() {
        return this.form.controls;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            tel: ['', [Validators.required, Validators.pattern('[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}')]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            vehicle: [null],
            seats: [2, [Validators.min(1), Validators.max(10)]],
            luggageSize: ['medium'],
            talk: ['', Validators.required],
            smoke: [false],
        });
    }

    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        const user: User = this.form.value;

        this.loading = true;
        this.userService.register(user).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) { // Register succeeded
                    this.alertService.success('Registration successful', {keepAfterRouteChange: true});
                    this.router.navigate(['/']);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

    showSeatsAndLuggages() {
        if (this.f.vehicle.value !== '') {
            if (document.getElementById('div-luggages').classList.contains('d-none')) {
                document.getElementById('div-luggages').classList.remove('d-none');
            }
            if (document.getElementById('div-seats').classList.contains('d-none')) {
                document.getElementById('div-seats').classList.remove('d-none');
            }
        } else {
            if (!document.getElementById('div-luggages').classList.contains('d-none')) {
                document.getElementById('div-luggages').classList.add('d-none');
            }
            if (!document.getElementById('div-seats').classList.contains('d-none')) {
                document.getElementById('div-seats').classList.add('d-none');
            }
        }
    }
}
