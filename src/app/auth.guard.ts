import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AttendenceBackendService } from './attendence-backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private attendenceBackendService : AttendenceBackendService,private router : Router){

  }
  canActivate(): boolean{
    if(this.attendenceBackendService.isLoginRequired()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
