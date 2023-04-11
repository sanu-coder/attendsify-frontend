import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { decodeToken, getToken } from '../../../src/app/authFunctions';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
// AuthSer
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  loginType : string='teacher';
  formSubmitted : boolean = false;
  formRules = {
    passwordMin: 6,
    passwordPattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}',
    emailPattern : '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
  };
  errorMessages : any;
  user: any;
  url :string = environment.homePageUrl;
  constructor(private attendenceBackendService : AttendenceBackendService, 
    private fb : FormBuilder,private toastr: ToastrService, 
    private router: Router, 
    private socialAuthService : SocialAuthService ) 
    {
    this.errorMessages = {
    
      email: {
        required: 'Email is required',
        pattern: 'Invalid email address',
      },
      password: {
        required: 'Password is required',
        pattern: 'Password must contain numbers, uppercase and lowercase letters',
        minLength: `Password must be at least ${this.formRules.passwordMin} characters`
      }
    };
    
    this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email,Validators.pattern(this.formRules.emailPattern)]],
      password : ['',[Validators.required]]
    }) 
  }
  get t(){
    return this.loginForm.controls;
  }
  loginFormSubmit(){
    this.formSubmitted = true;
    console.log(this.loginForm);
    if(this.loginForm.invalid){
      return;
    }
    let formValue = {...this.loginForm.value, role : this.loginType};
    
    if(this.loginType === 'teacher'){
      this.attendenceBackendService.loginUser(formValue).then(async (response : any)=>{
        const {token} = response;
        console.log(response);
        localStorage.setItem('token', token);
        if(response.result==="success"){
          await this.toastr.success('Welcome!', 'Login Successfull!',environment.alertProperties);
          this.router.navigate(['classes']);
        }else{
          await this.toastr.error('',response.message,environment.alertProperties);
        }
      });
    }
    else{
      this.attendenceBackendService.loginAsStudent(formValue).then(async(response : any) => {
        const {token} = response;
        console.log(response);
        localStorage.setItem('token', token);
        if(response.result==="success"){
          await this.toastr.success('Welcome!', 'Login Successfull!',environment.alertProperties);
          this.router.navigate(['give-attendence']);
        }else{
          await this.toastr.error('',response.message,environment.alertProperties);
        }
      })
    }
    

  }
  handleChange(event : any){
    this.loginType = event.target.defaultValue;
    console.log(this.loginType);
  }
  loginWithGoogle(): void {
    console.log("hit");
    let googleLoginOptions = {
      scope: 'profile email'
    };
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
  }
  ngOnInit(): void {
    (async()=>{
      const token = getToken();
      if(token){
        this.user = decodeToken(token);
        this.user = this.user._doc;
        if(this.user.role === 'teacher'){
          this.router.navigate(['/students']);
        }else{
          this.router.navigate(['/give-attendence']);
        }
      }
    })();
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
      const {idToken} = user;
      if(idToken){
        this.attendenceBackendService.googleSignIn({email : user.email}).then(async (response : any)=>{
          const {token} = response;
          localStorage.setItem('token', token);
          if(response.result=="success"){
            await this.toastr.success('Welcome!', 'Login Successfull!',{timeOut : 1000});
            this.router.navigate(['/dashboard']);
          }else{
            await this.toastr.error('',response.message,{timeOut : 1000});
          }
        })
      }
      
    });
  }

}
