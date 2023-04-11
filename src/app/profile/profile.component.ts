import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, deleteToken, getToken, saveTokenToLocalStorage } from '../authFunctions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user:any;
  userUpdation : any;
  imageUrl : string;
  readOnly :  boolean = true;
  classes : any;
  constructor(private  attendenceBackendService: AttendenceBackendService, private router: Router,private toastr: ToastrService) { }
  edit(){
    this.readOnly = false;
  }
  update(){
    (this.user.role[0] as String).toUpperCase();
    let json = {
      fullname: this.user.fullname,
      email: this.user.email,
      gender: this.user.gender,
      mobileNumber: this.user.mobileNumber,
      role: this.user.role,
      department: this.user.department,
    };
    this.attendenceBackendService.updateTeacherProfile(this.user._id, json).then(async(response:any) => {
      console.log(response);
      saveTokenToLocalStorage(response.token)
      if(response.result==="success"){
        this.toastr.success('Your Profile has been updated','Success', environment.alertProperties);
      }else{
        this.toastr.error(response.message,'Failure', environment.alertProperties)
      }
    })
    this.readOnly = true;

  }

  delete(){
    // this.attendenceBackendService.deleteTeacherProfile(this.user._id).then(async (response:any)=>{
    //   console.log(response);
      
    //   if(response.result==="success"){
    //     deleteToken();
    //     await this.toastr.success('Your Profile has been deleted','Success', environment.alertProperties);
    //     this.router.navigate(['login']);
    //   }else{
    //     this.toastr.error(response.message,'Failure', environment.alertProperties)
    //   }
    // })
  }
  ngOnInit(): void {
    let token = getToken();
    this.user = decodeToken(token);
    
    this.user = this.user._doc;
    console.log(this.user);
    (async()=> {
      this.classes = (await this.attendenceBackendService.getClasses() as any).data;
      console.log(this.classes);
    })();

    if(this.user.gender=='female'){
      this.imageUrl = 'https://cdn.icon-icons.com/icons2/1879/PNG/512/iconfinder-11-avatar-2754576_120520.png';
    }
    else{
      this.imageUrl = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg';
    }
    if(!this.user){
      this.router.navigate(['/login']);
    }
  }

}
