import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, TripService} from '@app/services';
import {Trip} from '@app/entities';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.css']
})
export class BookTripComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    trip: Trip;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private tripService: TripService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        
        const id: string = this.route.snapshot.paramMap.get('id');
        console.log(`Getting trip w/ id : ${id}`);

        if(id === undefined){
            this.alertService.error("Failed to parse trip id from route");
            this.router.navigate([this.returnUrl]);
        }else{
            // this.getTripDetail(id) //TODO
        }
    }

    getTripDetail(id:string) {
        
        this.tripService.getTrip(id).pipe(first()).subscribe(
            data => {
                this.loading = false;
                if (data !== undefined) {// GET succeeded

                    // this.alertService.info(`Found ${this.trips.length} trip(s)`);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }
}
