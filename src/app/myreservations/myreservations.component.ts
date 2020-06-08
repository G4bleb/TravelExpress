import { Component, OnInit } from '@angular/core';
import { AlertService, TripService, UserService, ReservationService } from '@app/services';
import { Trip, User, Reservation } from '@app/entities';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-myreservations',
  templateUrl: './myreservations.component.html',
  styleUrls: ['./myreservations.component.css']
})
export class MyReservationsComponent implements OnInit {
  reservations: Array<Reservation>;

  constructor(
    private tripService: TripService,
    private userService: UserService,
    private alertService: AlertService,
    private reservationService: ReservationService,
  ) { }

  ngOnInit(): void {
    this.reservationService.getCurrentUserReservations().subscribe(
      data => {
        if (data !== undefined) {// search succeeded
          this.reservations = data;

          this.reservations.forEach(res => {//For each reservation
            console.log(res);

            this.tripService.getTrip(res.trip as string).subscribe(data => {//Get the trip associated to the reservation
              data.toDate = new Date(data.toDate);
              data.fromDate = new Date(data.fromDate);
              res.trip = data;

              this.userService.get(res.trip.user as string).subscribe(//Get the user associated to the trip
                user => {
                  console.log(user);
                  (res.trip as Trip).user = user;
                });
            });
          });
          console.log(this.reservations);
        }
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  get reservationsSize() {
    return this.reservations === undefined ? 0 : this.reservations.length;
  }

}
