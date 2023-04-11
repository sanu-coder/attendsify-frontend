import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import {  decodeToken, getToken } from '../authFunctions';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-attendence-record',
  templateUrl: './attendence-record.component.html',
  styleUrls: ['./attendence-record.component.scss']
})
export class AttendenceRecordComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  selected: any;
  user : any;
  subject : string="";
  classes : any;
  start :string;
  students : any;
  mappedStudents : any = {};
  end : string;
  newRecords : any[] = [];
  noOfDays : number;
  chartData : any = [];
  labels : any = [];
  dtOptions: { pageLength: number; pagingType: string; processing: boolean; lengthMenu: number[]; dom: string; buttons: string[]; };
  dataSource: any;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];
  public barChartData: ChartData<'bar'> = {
    labels: [ ],
    datasets: [
      { data: [ ], label: 'Attendence' }
    ]
  };
  constructor(private attendenceBackendService  : AttendenceBackendService) { }

   checkTwoDates  (Date_1 : String, Date_2 : String, Date_to_check : String) {

    
    let D_1 = Date_1.split("-");
    let D_2 = Date_2.split("-");
    let D_3 = Date_to_check.split("-");
     // YY-MM-DD form
    var d1 = new Date(parseInt(D_1[0]), parseInt(D_1[1]) - 1, parseInt(D_1[2]));
    var d2 = new Date(parseInt(D_2[0]), parseInt(D_2[1]) - 1, parseInt(D_2[2]));

    // DD-MM-YY form
    var d3 = new Date(parseInt(D_3[2]), parseInt(D_3[1]) - 1, parseInt(D_3[0]));
    console.log(d1);
    console.log(d2);
    console.log(d3);
    if (d3 > d1 && d3 < d2) {
        
        return true;
    } else {
        return false;
    }
}
  util(){
    let obj = {};
    this.newRecords = [];

    for(let data of this.dataSource){

      if(this.checkTwoDates(this.start,this.end, data.date)==true){
        console.log("hit-----")
        obj[data.date] = true;
      }
    }
  
    let attendenceDates =  Object.keys(obj);
    console.log(attendenceDates);
    this.noOfDays = Object.keys(obj).length;
    if(this.noOfDays!=0){
      let idx = this.classes.findIndex((class1:any) => class1._id ===this.subject);

      if(idx!=-1){
        let semester = this.classes[idx].semester;
        let branch = this.classes[idx].branch;
        console.log(semester);
        let students = this.students.filter((student:any) => student.semester === semester && student.branch === branch);
  
        console.log(students);
  
  
        // check their details in attendence records and if not consider them as absent.


        for(let student of students){
          console.log(student.fullname)
          let items = this.dataSource.filter((data:any) => student._id === data.studentId && data.status === 'present' && attendenceDates.includes(data.date));
          console.log(items);
          let obj1 = student;
  
          obj1['percentage'] = items.length>0 ? (items.length*100)/this.noOfDays : 0;
        
          this.chartData.push(obj1['percentage']);
          this.newRecords.push(obj1);
          this.labels.push(student.fullname.split(' ')[0]);
        }
  
        console.log(this.newRecords);
        this.dataSource = this.newRecords;
        console.log(this.chartData);
        console.log(this.labels)
        this.barChartData.datasets[0].data = this.chartData;
        this.barChartData.labels = this.labels;
      }
    }
    
  }
  change(event : any){
    console.log(event);
    let date_start = new Date(event.start.$d);
    let year = date_start.toLocaleString("default", { year: "numeric" });
    let month = date_start.toLocaleString("default", { month: "2-digit" });
    let day = date_start.toLocaleString("default", { day: "2-digit" });

    this.start = `${year}-${month}-${day}`;

    console.log(this.start);

    let date_end =  new Date(event.end.$d);
    year = date_end.toLocaleString("default", { year: "numeric" });
    month = date_end.toLocaleString("default", { month: "2-digit" });
    day = date_end.toLocaleString("default", { day: "2-digit" });

    this.end = `${year}-${month}-${day}`;

    console.log(this.end);
  }

  searchStudents(){
    console.log(this.subject);
    let json = {
      subjectId : this.subject,
      start : this.start,
      end : this.end
    }
    this.attendenceBackendService.fetchAttendenceRecords(json).then((response : any) => {
      console.log(response);
      this.dataSource = response.data;
      this.util();
    })
  }
  ngOnInit(): void {
    (async() => {
      this.dtOptions =environment.dtOptions;
      this.students = (await this.attendenceBackendService.findStudents() as any).data;
      for(let student of this.students){
        this.mappedStudents[student._id] = student.fullname;
      }
      console.log(this.students);
      console.log(this.mappedStudents);
      this.classes = (await this.attendenceBackendService.getClasses() as any).data;
      console.log(this.classes);
      const token = getToken();
      this.user = decodeToken(token);
      this.user = this.user._doc;
      console.log(this.user._id);

      this.classes = this.classes.filter((class1:any) => class1.addedBy === this.user._id);
    })();
  }
  

 /*
  % = no. of days attended / total attendence *100;
  total-attendence = manage-attendence table
  no. of days attendended for each student = 
  total attendence
  */

}
