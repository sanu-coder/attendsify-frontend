import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';
import { interval } from 'rxjs';
@Component({
  selector: 'app-take-attendence',
  templateUrl: './take-attendence.component.html',
  styleUrls: ['./take-attendence.component.scss']
})
export class TakeAttendenceComponent implements OnInit {

  qrCodeString : string = "";
  subject:string = "";
  classes : any;
  user:any;
  random : string = environment.randomString;
  constructor(private attendenceBackendService : AttendenceBackendService) { }
   genRandonString(length : number) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charLength = chars.length;
    var result = '';
    for ( var i = 0; i < length; i++ ) {
       result += chars.charAt(Math.floor(Math.random() * charLength));
    }

    // console.log(result);
    return result;
  }

  generateQRCode(){
    let index = this.classes.findIndex((clas0s: any) => clas0s._id === this.subject);

    this.qrCodeString = environment.secret + '.' + this.user._id + '.' + this.subject + '.' + this.classes[index].subject + '.' + this.classes[index].semester + '.' + environment.randomString;
    console.log(this.user._id)
    console.log(environment.secret)
  }

  
  ngOnInit(): void {
    (async() => {
      environment.randomString = this.genRandonString(15);
      console.log(environment.randomString);
      if(this.qrCodeString){
        let arr = this.qrCodeString.split('.');
        arr[5] = environment.randomString;
        this.qrCodeString = arr.join('.');
      }
     interval(60000).subscribe(() => {
      environment.randomString = this.genRandonString(15);
      if(this.qrCodeString){
        let arr = this.qrCodeString.split('.');
        arr[5] = environment.randomString;
        this.qrCodeString = arr.join('.');
      }
      
      console.log(environment.randomString);
     })
     
      this.classes = (await this.attendenceBackendService.getClasses() as any).data;
      console.log(this.classes);
      const token = getToken();
      this.user = decodeToken(token);
      this.user = this.user._doc;
      console.log(this.user._id);
    })();
  }


}
