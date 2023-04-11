import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';
@Component({
  selector: 'app-give-attendence',
  templateUrl: './give-attendence.component.html',
  styleUrls: ['./give-attendence.component.scss']
})
export class GiveAttendenceComponent implements OnInit {

  buttonClicked : boolean = false;
  studentId : string;

  activateQRScanner(){
    this.buttonClicked = true;
  }
  
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router) { 
  
  } 
  ngOnInit() {
   console.log(environment)
  //  interval(1000).subscribe(()=>{
  //   console.log(environment.randomString);
  //  })
  }

  onValueChanges(event : any) {
    console.log(event);
  }
  changeHandler(event:any){

    console.log(event._value);
    let array = event._value.split('.');
    if(array.length!=6){
      this.toastr.error('Invalid QR Code','Error', environment.alertProperties);
    }
    else if(array[0] != environment.secret){
      this.toastr.error('Invalid QR Code','Error', environment.alertProperties);
    }
    // else if(array[5] != environment.randomString){
    //   console.log("hit-8392");
    //   console.log(environment.randomString);
    //   this.toastr.error('Invalid QR Code','Error', environment.alertProperties);
    // }
    else{
      let teacherId = array[1];
      let subjectId = array[2];
      let subject = array[3];
      let semester = array[4];
      let studentId = decodeToken(getToken())._doc._id;
      console.log(studentId);
      console.log(teacherId );
      console.log(subjectId );
      console.log(subject );
      console.log(semester );
      let json = {studentId,subjectId,teacherId,subject,semester,status : 'present'}
      this.attendenceBackendService.markAttendence(json).then(async(response:any) =>{
        console.log(response);
        if(response.result === "success"){
          this.toastr.success("Your's Attendence is marked",'Success', {timeOut : environment.timer});
        }else{
          this.toastr.error(response.message + ' in our records','Error', {timeOut : environment.timer});
        }
      })
    }
  }


  public handle(action: any, fn: string): void {
    action[fn]().subscribe(console.log, console.error);
  }
}
