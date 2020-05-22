import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {PreferencesComponent} from '@app/preferences/preferences.component';
import {CreateTripComponent} from '@app/trip/create/create.component';
import {SearchTripComponent} from '@app/trip/search/search.component';


const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent},
    {path: 'preferences', component: PreferencesComponent},
    {path: 'trip/create', component: CreateTripComponent},
    {path: 'trip/search', component: SearchTripComponent}
    // { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
