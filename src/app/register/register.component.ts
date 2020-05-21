import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {first} from 'rxjs/operators';

import {User} from '../entities';
import {UserService, AlertService} from '../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
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
      mail: ['', [Validators.email, Validators.required]],
      tel: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      vehicle: ['', Validators.nullValidator],
      seats: ['', [Validators.min(1), Validators.max(10)]],
      baggage: ['', Validators.nullValidator],
      talk: ['', Validators.required],
      smoke: ['', Validators.required],
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

    let user: User = this.form.value;

    this.loading = true;
    this.userService.addUser(user)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', {keepAfterRouteChange: true});
          this.router.navigate(['../login'], {relativeTo: this.route});
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
