import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';


function _window(): any {
  // return the global native browser window object
  return window;
}


@Injectable({
  providedIn: 'root'
})

export class AttendenceBackendService {

  constructor( private http : HttpClient) { }
  getApiUrl(){
    return environment.apiUrl;
  }
  // Teacher 
  registerUser(data : any){
    console.log(data);
    return this.http.post(this.getApiUrl() + '/teacher/register',data).toPromise();
  }
  loginUser(data : any){
    console.log(data);
    return this.http.post(this.getApiUrl() + '/teacher/signin',data).toPromise();
  }
  isLoginRequired(){
    if(localStorage.getItem('token')){
      return true;
    }
    return false;
  }
  getToken(){
    return localStorage.getItem('token');
  }
  googleSignIn(data : any){
    return this.http.post(this.getApiUrl() + '/teacher/signinWithGmail',data).toPromise();
  }
  findTeacher(email : any){
    return this.http.post(this.getApiUrl() + '/teacher/signinWithGmail',email).toPromise();
  }
  updateTeacherProfile(id:string, data:any){
    return this.http.put(this.getApiUrl()+`/teacher/teacher-update/${id}`, data).toPromise();
  }
  deleteTeacherProfile(id:string){
    return this.http.delete(this.getApiUrl()+`/teacher/delete-teacher-profile/${id}`).toPromise();
  }
  

  // Student 
  registerStudent(data : any){
    return this.http.post(this.getApiUrl() + '/student/register', data).toPromise();
  }
  findStudents(){
    return  this.http.get(this.getApiUrl() + '/student/students').toPromise();
   
  }
  loginAsStudent(data : any){
    return this.http.post(this.getApiUrl()+'/student/search-student',data).toPromise();
  }
  updateStudent(id : string, data : any){
    console.log("hit");
    return this.http.put(this.getApiUrl() + `/student/students/${id}`, data).toPromise();
  }
  deleteStudent(id : string){
    return this.http.delete(this.getApiUrl() + `/student/students/${id}`).toPromise();
  }

  // class

  addClass(data:any){
    return this.http.post(this.getApiUrl()+'/class', data).toPromise();
  }
  getClasses(){
    return this.http.get(this.getApiUrl()+'/classes').toPromise();
  }
  updateClass(id : string, data : any){
    return this.http.put(this.getApiUrl()+`/classes/${id}`, data).toPromise();
  }
  deleteClass(id : string){
    return this.http.delete(this.getApiUrl()+`/classes/${id}`).toPromise();
  }

// attendence
  markAttendence(data:any){
    console.log("hit");
    console.log(data);
    return this.http.post(this.getApiUrl()+'/mark-attendence',data).toPromise();
  }
  markedAttendenceList(data:any){
    console.log(data);
    return this.http.post(this.getApiUrl()+'/current-marked-attendence',data).toPromise();
  }

  fetchAttendenceRecords(data : any){
    return this.http.post(this.getApiUrl()+'/attendence-records',data).toPromise();
  }
  signOut(){
    return localStorage.removeItem('token');
  }


  createOrder(data : any){
    return this.http.post(this.getApiUrl()+'/create-order',data).toPromise();
  }
  get nativeWindow(): any {
    return _window();
}
}
