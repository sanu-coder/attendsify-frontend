import { Injectable, Injector } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendenceBackendService } from './attendence-backend.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector : Injector) { }
  intercept(req:any, next: any) {
    console.log("hit");
    const token  = this.injector.get(AttendenceBackendService).getToken();
    let tokenizedReq = req.clone({
      setHeaders : {
        Authorization : `Bearer ${token}`
      }
    });
    console.log(tokenizedReq)
    return next.handle(tokenizedReq);
  }
}
