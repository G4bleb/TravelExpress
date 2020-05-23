import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, UserService} from '@app/services';
import {first} from 'rxjs/operators';
import {User} from '@app/entities';

@Component({
    selector: 'app-preferences',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
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

    ngOnInit(): void {
        const currentUser: User = JSON.parse(localStorage.getItem('user'));
        this.form = this.formBuilder.group({
            mail: ['', [Validators.email, Validators.required]],
            tel: ['', [Validators.required, Validators.pattern('/^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/im')]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            vehicle: [''],
            seats: ['', [Validators.min(1), Validators.max(10)]],
            luggageSize: ['', Validators.nullValidator],
            talk: ['', Validators.required],
            smoke: [''],
        });

        this.form.controls.mail.setValue(currentUser.mail);
        this.form.controls.tel.setValue(currentUser.tel);
        this.form.controls.firstName.setValue(currentUser.firstName);
        this.form.controls.lastName.setValue(currentUser.lastName);
        this.form.controls.vehicle.setValue(currentUser.vehicle);
        this.form.controls.seats.setValue(currentUser.seats);
        this.form.controls.luggageSize.setValue(currentUser.luggageSize);
        this.form.controls.talk.setValue(currentUser.talk);
        this.form.controls.smoke.setValue(currentUser.smoke);

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

        const user: User = this.form.value;
        const currentUser: User = JSON.parse(localStorage.getItem('user'));

        if (currentUser.password !== user.password) {
            this.form.controls.password.setErrors({incorrect: true});
            return;
        } else {
            this.form.controls.password.setErrors(null);
        }

        this.loading = true;
        this.userService.editPreferences(user).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// update succeeded
                    this.alertService.success('Update successful', {keepAfterRouteChange: true});
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
