import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AttendenceRecordComponent } from './attendence-record/attendence-record.component';
import { AuthGuard } from './auth.guard';
import { ClassesComponent } from './classes/classes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GiveAttendenceComponent } from './give-attendence/give-attendence.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { StudentsComponent } from './students/students.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { TakeAttendenceComponent } from './take-attendence/take-attendence.component';

const routes: Routes = [
    { path : '' , redirectTo : 'login', pathMatch : 'full'},
    {path : 'home', component : HomeComponent},
    {path : 'dashboard', component : DashboardComponent, canActivate : [AuthGuard]},
    {path : 'students', component : StudentsComponent, canActivate : [AuthGuard]},
    {path : 'classes', component : ClassesComponent, canActivate : [AuthGuard]},
    {path : 'register', component : RegisterComponent},
    {path : 'take-attendence', component : TakeAttendenceComponent, canActivate: [AuthGuard]},
    {path : 'give-attendence', component : GiveAttendenceComponent, canActivate: [AuthGuard]},
    {path : 'attendence-records', component : AttendenceRecordComponent, canActivate: [AuthGuard]},
    {path : 'login', component : LoginComponent},
    {path : 'profile', component : ProfileComponent, canActivate : [AuthGuard]},
    {path : 'premium', component : SubscriptionComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }