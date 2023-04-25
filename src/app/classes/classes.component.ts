import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';


@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {

  addClassForm : FormGroup = this.fb.group({
    branch : ['computer-science', Validators.required],
    semester : ['7', Validators.required],
    subject : ['', Validators.required]
  })
  updateData : boolean = false;
  errorMessages : any;
  formSubmitted : boolean = false;
  classId : string;
  user:any;
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router ) { 
    this.errorMessages = {
      subject: {
        required: 'Subject is required'
      }
    };

  }
  update(){
    this.formSubmitted = true;
    console.log(this.addClassForm);
    if(this.addClassForm.invalid){
      return;
    }
    this.attendenceBackendService.updateClass(this.classId, this.addClassForm.value).then((response:any) => {
      console.log(response);
      if(response.result==="success"){
        this.toastr.success('Class has been updated to the database','Success', {timeOut : 2000, progressBar : true,closeButton:true});
      }else{
        this.toastr.error(response.message,'Failure', environment.alertProperties)
      }
    })
  }
  bindValue(event : any){
    console.log(event);
    this.updateData = true;
    this.classId = event._id;
    this.addClassForm.patchValue({
      branch : event.branch,
      semester : event.semester,
      subject : event.subject,
    })
    
  }
  submit(){
    this.formSubmitted = true;

    console.log(this.addClassForm);
    if(this.addClassForm.invalid){
      return;
    }
    let json = {...this.addClassForm.value, addedBy: this.user._id};
    this.attendenceBackendService.addClass(json).then((response:any) => {
      console.log(response);
      if(response.result==="success"){
        this.toastr.success('Class has been Added to the database','Success', environment.alertProperties);
      }else{
        this.toastr.error(response.message,'Failure', environment.alertProperties)
      }
    })
  }
get t(){
  return this.addClassForm.controls;
}
async signOut(){
  this.attendenceBackendService.signOut();
  await this.toastr.success('Thank you', 'Successfully Logged Out',environment.alertProperties);
  this.router.navigate(['/login']);
}

  ngOnInit(): void {
    let token = getToken();
    this.user = decodeToken(token);
    
    this.user = this.user._doc;
    console.log(this.user);
  }

}
