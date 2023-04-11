import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendenceBackendService } from '../attendence-backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  teacherRegistrationForm : FormGroup;
  url :string = environment.homePageUrl;
  formRules = {
    nonEmpty: '^[A-Za-z]+$',
    usernameMin: 5,
    passwordMin: 6,
    passwordPattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}',
    emailPattern : '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
  };
  formSubmitted : boolean = false;
  errorMessages:any;
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router ) { 

    this.errorMessages = {
      fullname: {
        required: 'Full name is required'
      },
      email: {
        required: 'Email is required',
        pattern: 'Invalid email address',
      },
      password: {
        required: 'Password is required',
        pattern: 'Password must contain: numbers, uppercase and lowercase letters',
        minLength: `Password must be at least ${this.formRules.passwordMin} characters`
      },
      confirmPassword: {
        required: 'Password confirmation is required',
        passwordMismatch: 'Passwords must match'
      },
      mobileNumber : {
        required : 'Mobile Number is required',
        length : 'Invalid Mobile Number'
      }
    };

    this.teacherRegistrationForm = this.fb.group({
      fullname : ['',[Validators.required]],
      email:['',[Validators.required,Validators.email,Validators.pattern(this.formRules.emailPattern)]],
      department : ['computer-science', Validators.required],
      gender : ['female',Validators.required],
      password : ['',[Validators.required,Validators.minLength(this.formRules.passwordMin),Validators.pattern(this.formRules.passwordPattern)]],
      mobileNumber : ['',[ Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      confirmPassword : ['',Validators.required],
    },
    { validators: this.confirmPasswordValidator }
    );
  }
  confirmPasswordValidator(){}
    
  get t(){
    return this.teacherRegistrationForm.controls;
  }
  registerUser(){
    this.formSubmitted = true;
    console.log(this.teacherRegistrationForm);
    if(this.teacherRegistrationForm.invalid){
      return;
    }
    let json = this.teacherRegistrationForm.value;

    json['role'] = 'teacher';
    this.attendenceBackendService.registerUser(json).then(async (response:any)=>{
      console.log(response);
      if(response.token) {
        localStorage.setItem('token', response.token);
      }
      if(response.result=="success" && response.token){
         await this.toastr.success('Welcome!', 'Registered Successfully!',environment.alertProperties);
        this.router.navigate(['classes']);
      }
      else {
        await this.toastr.error('Error!', response.message,environment.alertProperties);
      }
    })
  }
  ngOnInit(): void {
    // this.toastr.success('Welcome!', 'Registered Successfully!');
  }

}
