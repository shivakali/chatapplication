import { Injectable } from '@angular/core';


import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';   //http client to make request
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';        //import observable related code  
import { CookieService } from 'ngx-cookie-service'; 

import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
//import { toPromise } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private url = 'https://chatapi.edwisor.com';

  constructor(public http:HttpClient)
   { }

 public signupFunction(data) : Observable<any>{

    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobile',data.mobile)
    .set('email',data.email)
    .set('password',data.password)
    .set('apikey',data.apikey);

  return this.http.post(`${this.url}/api/v1/users/signup`, params);

 }


 public signinFunction(data) : Observable<any>{

  const params = new HttpParams()
  
  .set('email',data.email)
  .set('password',data.password)
  .set('apikey',data.apikey);

return this.http.post(`${this.url}/api/v1/users/login`, params);

}

public getUserInfofromLocalStorage = () =>{

return JSON.parse(localStorage.getItem('userInfo'));
}

public setUserInfoInLocalStorage = (data) =>{

  localStorage.setItem('userInfo', JSON.stringify(data));
}























}



