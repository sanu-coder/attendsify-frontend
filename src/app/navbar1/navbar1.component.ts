import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { event } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';

@Component({
  selector: 'app-navbar1',
  templateUrl: './navbar1.component.html',
  styleUrls: ['./navbar1.component.scss']
})
export class Navbar1Component implements OnInit {

  user : any;
  toggle_ : boolean = false;
  constructor(private  attendenceBackendService: AttendenceBackendService, private router: Router,private toastr: ToastrService,private el: ElementRef) { }

  ngOnInit(): void {
    const token = getToken();
    this.user = decodeToken(token);
    this.user = this.user._doc;
  }
  toggle(){
    let myTag = document.getElementsByTagName('body');
    console.log(document.body.classList.contains('sidebar-icon-only'))
    // console.log(window.innerWidth);
    
      if(document.body.classList.contains('sidebar-icon-only')==true){
        document.body.classList.remove('sidebar-icon-only');
      }else{
        document.body.classList.add('sidebar-icon-only');
        console.log(document.body.classList);
      }
  }
  toggle34(){

    if(document.getElementById('sidebar').classList.contains('active')==true){
      document.getElementById('sidebar').classList.remove('active');
    }else{
      document.getElementById('sidebar').classList.add('active');
      console.log(document.getElementById('sidebar').classList)
    }
  }
  async signOut(){
    this.attendenceBackendService.signOut();
    await this.toastr.success('Thank you', 'Successfully Logged Out',environment.alertProperties);
    this.router.navigate(['/login']);
  }

}
