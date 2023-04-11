import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { Output, EventEmitter } from '@angular/core';
import { decodeToken, getToken } from '../authFunctions';
declare const $ : any;
@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {

  dropdownSelected : string="1-CS";
  dataSource : any;
  dtOptions: any = {};
  data : any;
  optionSelected : string="";
  branchMapping : any = {
    "CS" : "computer-science",
    "IT" : "information-technology",
    "ETNT" : "electrical-and-telecommunication",
     "ME" : "mechanical",
     "EE" : "electrical",
     "CE" : "civil",
     "MIE" : "mining",
  }
  @Output() newItemEvent = new EventEmitter<any>();
  user: any;
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router) { 
   
  }
  fetchStudentsDetails(){
    let value = this.optionSelected;
    let array = value.split('-');
    let semester = array[0];
    let branch = this.branchMapping[array[1]];
    
    this.dataSource = this.data.filter((instance : any) => instance.semester === semester && instance.branch === branch);
    console.log(this.dataSource);
  }
  update(i){
    console.log(this.dataSource[i]);
    this.newItemEvent.emit(this.dataSource[i]);
    this.router.navigateByUrl('students#addStudent');
  }
  async refresh(){
    if(this.optionSelected===""){
      this.toastr.error('Select the option from the dropdown','Error', environment.alertProperties);
    }else{
      this.data = (await this.attendenceBackendService.findStudents() as any).data;
        this.data = this.data.filter((student:any) => student.teacherAccessEmail.includes(this.user.email)===true);
        console.log(this.data);
      this.fetchStudentsDetails();
    }
  }
  delete(i){
    this.attendenceBackendService.deleteStudent(this.dataSource[i]._id).then(async(response:any) => {
      if(response.result==="success"){
        this.toastr.success('Student has been deleted to the database','Success', environment.alertProperties);
      }else{
        this.toastr.error(response.message,'Failure', environment.alertProperties)
      }
      
    })
  }
  ngOnInit(): void {
   
    (async() => {
      let token = getToken();
      this.user = decodeToken(token);
      
      this.user = this.user._doc;
      console.log(this.user);
      this.dtOptions = environment.dtOptions;
      try{
        this.data = (await this.attendenceBackendService.findStudents() as any).data;
        console.log(this.data);
        this.data = this.data.filter((student:any) => student.teacherAccessEmail.includes(this.user.email)===true);
        console.log(this.data);
      }catch(error:any){
        console.log(error)
        if(error.status===401){
          this.router.navigate(['/login']);
        }
      }
  
    })();
  }

}
