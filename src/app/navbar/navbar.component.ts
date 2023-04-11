import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';
import jwtDecode, {JwtPayload } from 'jwt-decode';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user : any;
  toggle : boolean = false;
  url : string = environment.homePageUrl;
  constructor(private  attendenceBackendService: AttendenceBackendService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    const token = getToken();
    this.user = decodeToken(token);
    this.user = this.user._doc;
    if(!this.user){
      this.router.navigate(['/login']);
      
    }
  }
  async signOut(){
    this.attendenceBackendService.signOut();
    await this.toastr.success('Thank you', 'Successfully Logged Out',environment.alertProperties);
    this.router.navigate(['/login']);
  }
}
