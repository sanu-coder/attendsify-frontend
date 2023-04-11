import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';

@Component({
  selector: 'app-manage-attendence',
  templateUrl: './manage-attendence.component.html',
  styleUrls: ['./manage-attendence.component.scss']
})
export class ManageAttendenceComponent implements OnInit {
  @Input() qrCodeString = '';
  currentRecords : any;
  students : any;
  semester : any;
  teacherId : string;
  subject : string;
  subjectId : string;
  dtOptions: { pageLength: number; pagingType: string; processing: boolean; lengthMenu: number[]; dom: string; buttons: string[]; };
  classes: any;
  subject1:string="";
  user: any;
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router) { }

  // this.qrCodeString = environment.secret + '.' + this.user._id + '.' + this.subject + '.' + this.classes[index].subject + '.' + this.classes[index].semester + '.' + this.genRandonString(15);
  markAbsent(){



    console.log("hit");
    if(!this.qrCodeString){
      this.toastr.error('Please select subject name to generate QR code','Error',environment.alertProperties);
      return;
    }
    let array = this.qrCodeString.split('.');
    let teacherId = array[1];
    let subjectId = array[2];
    let subject = array[3];
    let semester = array[4];
    // progressBar
    console.log(this.currentRecords);
    for(let student of this.students){
      console.log(student)

      let idx = this.classes.findIndex((class_:any) => class_._id === subjectId)
      console.log(this.classes[idx]);
      console.log(semester);
      let index = this.currentRecords.findIndex((record:any) => student._id === record.studentId);
      
      
      // if record not found
      if(index === -1 && student.semester === semester && student.branch === this.classes[idx].branch ){
        // mark as absent
        let json = {
          studentId : student._id,
          teacherId,
          subjectId,
          subject,
          semester,
          status : 'absent'
        };
        console.log(json);
        this.attendenceBackendService.markAttendence(json).then((response : any) => {
          console.log(response);
          

        })
      } 
    }
    this.toastr.success('Other students are marked as absent','Success',environment.alertProperties);
  }
  refresh(){
      let array = this.qrCodeString.split('.');
      let teacherId = array[1];
      let subjectId = array[2];
      let subject = array[3];
      let semester = array[4];

      this.attendenceBackendService.markedAttendenceList({teacherId,subjectId,subject,semester}).then(async(response : any) => {
        console.log(response);
        this.currentRecords = response.data;
        for(let record of this.currentRecords){
          let index = this.students.findIndex((student:any) => student._id === record.studentId );
          record['studentDetails'] = this.students[index];
          record['studentDetails']['password'] = "";
        }
        console.log(this.currentRecords)
      })
  }
  refresh1(){
    let idx = this.classes.findIndex((class_:any) => class_._id ===this.subject1);
    let {subject,semester} = this.classes[idx];
    let subjectId = this.classes[idx]._id;
    let teacherId = this.user._id;
    console.log(subject);
    console.log(subjectId);
    console.log(semester);

    this.attendenceBackendService.markedAttendenceList({teacherId,subjectId,subject,semester}).then(async(response:any) => {
      console.log(response);
      this.currentRecords = response.data;
      for(let record of this.currentRecords){
        let index = this.students.findIndex((student:any) => student._id === record.studentId );
        record['studentDetails'] = this.students[index];
        record['studentDetails']['password'] = "";
      }
    })

  }
  ngOnInit(): void {
    (async() => {
      this.dtOptions = environment.dtOptions;

      let token = getToken();
      let user = decodeToken(token);
      this.user = user._doc;
      this.students = ( await this.attendenceBackendService.findStudents() as any).data;
      console.log(this.students);
      this.classes = (await this.attendenceBackendService.getClasses() as any).data;


      // let array = this.qrCodeString.split('.');
      // let teacherId = array[1];
      // let subjectId = array[2];
      // let subject = array[3];
      // let semester = array[4];
      // this.semester = semester;
      // console.log(this.semester)
      // this.subjectId = subjectId;
      // this.teacherId = teacherId;
      // this.attendenceBackendService.markedAttendenceList({teacherId,subjectId,subject,semester}).then(async(response : any) => {
      //   console.log(response);
      //   this.currentRecords = response.data;
      //   console.log(this.currentRecords);

       
      //   for(let record of this.currentRecords){
      //     let index = this.students.findIndex((student:any) => student._id === record.studentId)
      //     record['studentDetails'] = this.students[index];
      //     record['studentDetails']['password'] = "";
      //   }
      //   console.log(this.currentRecords)
      // })
    })();
  }

}
