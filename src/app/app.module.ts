import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule,HTTP_INTERCEPTORS } from  '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentsComponent } from './students/students.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing-module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { NavbarComponent } from './navbar/navbar.component';
import { DataTablesModule } from "angular-datatables";
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ClassesComponent } from './classes/classes.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';
import { TakeAttendenceComponent } from './take-attendence/take-attendence.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { GiveAttendenceComponent } from './give-attendence/give-attendence.component';
import { AttendenceRecordComponent } from './attendence-record/attendence-record.component';
import { ProfileComponent } from './profile/profile.component';
import { Navbar1Component } from './navbar1/navbar1.component';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ManageAttendenceComponent } from './manage-attendence/manage-attendence.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';

const firebaseConfig = {
  apiKey: "AIzaSyBPBZGGS_hL1tgZy0MmssCEgYjQ9eyeTMk",
  authDomain: "attendence-58ab5.firebaseapp.com",
  projectId: "attendence-58ab5",
  storageBucket: "attendence-58ab5.appspot.com",
  messagingSenderId: "490046926191",
  appId: "1:490046926191:web:ee73d2185241282aa30c9a",
  measurementId: "G-6RCMPS3R8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    StudentsComponent,
    HomeComponent,
    NavbarComponent,
    ManageStudentsComponent,
    ClassesComponent,
    ManageClassesComponent,
    TakeAttendenceComponent,
    GiveAttendenceComponent,
    AttendenceRecordComponent,
    ProfileComponent,
    Navbar1Component,
    SubscriptionComponent,
    ManageAttendenceComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    DataTablesModule,
    FormsModule,
    QRCodeModule,
   NgxScannerQrcodeModule,
    BarcodeScannerLivestreamModule,
    NgChartsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '577009206571-i4efp8uu2v1558kj6t5nvjpdjbcbqmtn.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    AuthGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : TokenInterceptorService,
      multi : true
    },
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
