import { Component, OnInit } from '@angular/core';
import { AlertService, TripService, UserService, ReservationService } from '@app/services';
import { Trip, User, Reservation } from '@app/entities';

@Component({
  selector: 'app-mytrips',
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.css']
})
export class MyTripsComponent implements OnInit {
  trips: Array<Trip>;
  tripsReservations: Array<Array<Reservation>>

  constructor(
    private tripService: TripService,
    private userService: UserService,
    private alertService: AlertService,
    private reservationService: ReservationService,
  ) { }

  ngOnInit(): void {
    this.tripsReservations = [];
    //Get the user's trips
    this.tripService.getCurrentUserTrips().subscribe(
      data => {
        if (data !== undefined) {// get succeeded
          this.trips = data;
          this.trips.forEach(trip => {
            trip.toDate = new Date(trip.toDate);
            trip.fromDate = new Date(trip.fromDate);
          });
        }
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  //get reservations on a specific trip, (pointed by its index in the this.trips array)
  seeReservations(tripIndex: number): void{
    this.reservationService.getTripReservations(this.trips[tripIndex]._id).subscribe(
      data => {
        if (data !== undefined) {// search succeeded
          data.forEach(res => {
            this.userService.get(res.user as string).subscribe(
              user => {
                if (user !== undefined) {// GET succeeded
                  res.user = user as User;
                }
              }
            );
          });
          this.tripsReservations[tripIndex] = data; 
          console.log(this.tripsReservations);
        }
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  get tripsSize() {
    return this.trips === undefined ? 0 : this.trips.length;
  }

}
