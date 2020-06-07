import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {first} from 'rxjs/operators';
import {AlertService, UserService} from '@app/services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.userService.getSessionUser() !== null) {
            this.router.navigate(['/']);
        }
        this.form = this.formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    // convenience getter for easy access to form fields
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

        this.loading = true;
        this.userService.login(this.f.email.value, this.f.password.value).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) { // login succeeded
                    this.alertService.success('Login successful', {keepAfterRouteChange: true});
                    this.router.navigate([this.returnUrl]);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }
}
