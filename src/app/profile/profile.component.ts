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

    currentUser: User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.currentUser = this.userService.getSessionUser();
        this.form = this.formBuilder.group({
            email: ['', [Validators.email]],
            tel: ['', [Validators.pattern('[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}')]],
            password: ['', Validators.minLength(6)],
            firstName: ['', Validators.minLength(2)],
            lastName: ['', Validators.minLength(2)],
            vehicle: [null],
            seats: [2, [Validators.min(1), Validators.max(10)]],
            luggageSize: ['medium'],
            talk: [''],
            smoke: [false],
        });

        this.f.email.setValue(this.currentUser.email);
        this.f.tel.setValue(this.currentUser.tel);
        this.f.firstName.setValue(this.currentUser.firstName);
        this.f.lastName.setValue(this.currentUser.lastName);
        this.f.vehicle.setValue(this.currentUser.vehicle);
        this.f.seats.setValue(this.currentUser.seats);
        this.f.luggageSize.setValue(this.currentUser.luggageSize);
        this.f.talk.setValue(this.currentUser.talk);
        this.f.smoke.setValue(this.currentUser.smoke);

        if (this.f.vehicle.value !== '') {
            document.getElementById('div-seats').classList.remove('d-none');
            document.getElementById('div-luggages').classList.remove('d-none');
        }

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

        // We do not have the current user's password
        // if (this.currentUser.password !== this.form.controls.password.value) {
        //     this.form.controls.password.setErrors({incorrect: true});
        //     return;
        // } else {
        //     this.form.controls.password.setErrors(null);
        // }

        const user: User = {} as User;
        {
            let modified = false;

            Object.keys(this.form.controls).forEach((name) => {
                const currentControl = this.form.controls[name];

                if (currentControl.dirty && currentControl.value !== this.currentUser[name]) {
                    console.log(name);
                    // Si le mot de passe est vide on ne le modifie pas (la validator ne fonctionne pas sur la chaîne vide)
                    if (name === 'password' && currentControl.value === '') {
                        // this.form.controls.password.setErrors({minlength: true});
                    } else {
                        modified = true;
                        user[name] = currentControl.value;
                    }
                }
            });

            if (!modified) {
                return;
            }
        }


        this.loading = true;
        this.userService.editProfile(user, this.currentUser.token).pipe(first()).subscribe(
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
