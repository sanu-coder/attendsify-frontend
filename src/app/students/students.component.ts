import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StringLike } from '@firebase/util';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';
// ng g c comp-name
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  studentRegistrationForm : FormGroup;
  email2 : any;
  emails : string[];
  value:any;
  studentId:string;
  formRules = {
    nonEmpty: '^[A-Za-z]+$',
    usernameMin: 5,
    passwordMin: 6,
    passwordPattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}',
    emailPattern : '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
  };
  updateData : boolean = false;
  formSubmitted : boolean = false;
  errorMessages:any;
  user: any;
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router ) { 
    this.email2 = "";
this.emails=[];
    this.errorMessages = {
      fullname: {
        required: 'Full name is required'
      },
      email: {
        required: 'Email is required',
        pattern: 'Invalid email address',
      },
      gender : {
        required: 'Gender is required'
      },
      mobileNumber : {
        required : 'Mobile Number is required',
        length : 'Invalid Mobile Number'
      },
      dob : {
        required: 'Date of Birth is required'
      },
      rollno : {
        required: 'Roll Number is required'
      },
      specialization : {
        required: 'Specialization is required'
      },
    };
    this.value=0;
    this.studentRegistrationForm = this.fb.group({
      fullname : ['',[Validators.required]],
      email:['',[Validators.required,Validators.email,Validators.pattern(this.formRules.emailPattern)]],
      gender : ['female',Validators.required],
      branch : ['computer-science', Validators.required],
      semester : ['1', Validators.required],
      dob : ['', Validators.required],
      rollno : ['', Validators.required],
      specialization : ['btech', Validators.required],
      mobileNumber : ['',[ Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      teacherAccessEmail : [[]],
    });
  }
  bindValue(event){
    console.log(event);
    this.updateData = true;
    this.studentId = event._id;
    this.emails = event.teacherAccessEmail.filter((email:any) => email != this.user.email);
    this.studentRegistrationForm.patchValue({
      fullname : event.fullname,
      email:event.email,
      gender : event.gender,
      branch : event.branch,
      semester : event.semester,
      dob : event.dob,
      rollno : event.rollno,
      specialization : event.specialization,
      mobileNumber : event.mobileNumber,
      teacherAccessEmail : event.teacherAccessEmail,
    })
  }
  update(){
    this.formSubmitted = true;
    console.log(this.studentRegistrationForm);
    if(this.studentRegistrationForm.invalid){
      return;
    }
    let json = this.studentRegistrationForm.value;
    this.emails.push(this.user.email);
    json.teacherAccessEmail = this.emails;
    this.emails = [];
    console.log(json);
    this.attendenceBackendService.updateStudent(this.studentId, json).then((response:any) => {
      console.log(response);
      if(response.result==="success"){
        this.toastr.success('Student has been updated to the database','Success', environment.alertProperties);
      }else{
        this.toastr.error(response.message,'Failure', environment.alertProperties)
      }
    })
  }
  emailAccess(){
    console.log(this.email2)
    console.log(this.emails.findIndex((email:any) => email===this.email2))
    if(this.emails.findIndex((email:any) => email===this.email2)==-1){
      this.attendenceBackendService.findTeacher({email : this.email2}).then((response:any)=>{
        if(response.result==="failure"){
          this.toastr.error('Account not Exists', 'Oops!',{timeOut : 1000});
        }else{
          this.emails.push(this.email2);
          this.toastr.success('Teacher added', 'Success!',{timeOut : 1000});
        }
      })
      

    }else{
      this.toastr.error('Email Already added', 'Oops!',{timeOut : 1000});
    }
    
  }
  submitStudentRegistrationForm(){
    // push the teacher email who is actually adding.

    // code.
    this.studentRegistrationForm.patchValue({teacherAccessEmail : this.emails});
    this.formSubmitted = true;
    console.log(this.studentRegistrationForm);
    if(this.studentRegistrationForm.invalid){
      return;
    }
    // this.studentRegistrationForm.value.teacherAccessEmail.push(this.user._id);
    let json = this.studentRegistrationForm.value;
    json.teacherAccessEmail.push(this.user.email);
    let dob = json.dob;
    let date = dob.split('-');
    let yy = date[0];
    let mm = date[1];
    let dd = date[2];


    const password = `${dd}${mm}${yy}`;
    json['password'] = password;
    json['role'] = 'student';
    console.log(json);

    this.attendenceBackendService.registerStudent(json).then(async(response:any) => {
      console.log(response);
      if(response.result==="success"){
        await this.toastr.success('Student added','Success', environment.alertProperties);
      }else{
        await this.toastr.error(response.message,'Failure',environment.alertProperties);
      }
    })
  }
  resetStudentRegistrationForm(){
    this.formSubmitted=false;
    this.studentRegistrationForm.reset();
  }
  removeEmailAccess(i:number){
    this.emails.splice(i,1);
  }
  get s(){
    return this.studentRegistrationForm.controls;
  }
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
  ngOnInit(): void {
    let token = getToken();
    this.user = decodeToken(token);
   
    this.user = this.user._doc;
    
    console.log(this.user);
  }

}
