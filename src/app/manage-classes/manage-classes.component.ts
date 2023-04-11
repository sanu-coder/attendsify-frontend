import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttendenceBackendService } from '../attendence-backend.service';
import { Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { decodeToken, getToken } from '../authFunctions';
@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit {

  classes : any;
  dtOptions: { pageLength: number; pagingType: string; processing: boolean; lengthMenu: number[]; dom: string; buttons: string[]; };
  user: any;
  constructor(private attendenceBackendService : AttendenceBackendService, private fb : FormBuilder,private toastr: ToastrService, private router: Router) { }
  @Output() newItemEvent = new EventEmitter<any>();


  update(i){
    console.log(this.classes[i]);
    this.newItemEvent.emit(this.classes[i]);
    this.router.navigateByUrl('classes#addClass');

  }
  delete(i){
    this.attendenceBackendService.deleteClass(this.classes[i]._id).then(async(response:any) => {
      if(response.result==="success"){
        await this.refresh();
        this.toastr.success('Class has been deleted to the database','Success', environment.alertProperties);
      }else{
        this.toastr.error(response.message,'Failure', environment.alertProperties)
      }
    })
  }
  async refresh(){
    this.classes = (await this.attendenceBackendService.getClasses() as any).data;
  }
  ngOnInit(): void {

    (async()=>{
      let token = getToken();
    this.user = decodeToken(token);
    
    this.user = this.user._doc;
    console.log(this.user);
      this.dtOptions = environment.dtOptions;
      try{
        this.classes = (await this.attendenceBackendService.getClasses() as any).data;
        console.log(this.classes);
        this.classes = this.classes.filter((item:any) => item.addedBy === this.user._id);
        console.log(this.classes)
      }catch(error:any){
        if(error.status===401){
          this.router.navigate(['/login']);
        }
      }
    })();
  }

}
