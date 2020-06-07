import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {HomeComponent} from './home/home.component';
import {AlertComponent} from './alert/alert.component';
import {SearchTripComponent} from './trip/search/search.component';
import {CreateTripComponent} from './trip/create/create.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BookTripComponent} from './trip/book/book.component';
import { MyTripsComponent } from './mytrips/mytrips.component';
import { MyReservationsComponent } from './myreservations/myreservations.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        AlertComponent,
        HomeComponent,
        SearchTripComponent,
        CreateTripComponent,
        BookTripComponent,
        MyTripsComponent,
        MyReservationsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FontAwesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
