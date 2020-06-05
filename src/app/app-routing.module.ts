import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from '@app/profile/profile.component';
import {CreateTripComponent} from '@app/trip/create/create.component';
import {SearchTripComponent} from '@app/trip/search/search.component';
import {BookTripComponent} from '@app/trip/book/book.component';


const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'trip/create', component: CreateTripComponent},
    {path: 'trip/search', component: SearchTripComponent},
    {path: 'trip/book/:id', component: BookTripComponent}
    // { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        onSameUrlNavigation: 'reload'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
