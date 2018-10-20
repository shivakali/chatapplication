import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Router}  from '@angular/router';
import { AppServiceService } from 'src/app/app.service';
import { CookieService } from 'ngx-cookie-service'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public email: any;
  public password: any;
  public apiKey: any;

  constructor(
    public router: Router,
    private toastr:ToastrService ,
    public appService: AppServiceService,
    public cookieService: CookieService
  ) {}

  ngOnInit() {
  }


  public goToSignIn: any = () =>
  {
  this.router.navigate(['/']);
  
  }

  public signupFunction: any =() =>{

    
  if(!this.email) {
    this.toastr.warning('Enter email')
  }else if(!this.password) {
    this.toastr.warning('Enter password')
  }else if(!this.apiKey) {
    this.toastr.warning('Enter api key')
  } else {
  
     let data={
  
       email: this.email,
       password: this.password,
       apiKey: this.apiKey,
  
     }
     console.log(data)
  
     this.appService.signupFunction(data).subscribe(
  
      (apiResponse) => {
  
        
  
        if (apiResponse.status === 200) {
          console.log(apiResponse);
          
          this.cookieService.set('authtoken', apiResponse.data.authToken);
            
          this.cookieService.set('receiverId', apiResponse.data.userDetails.userId);
         
          this.cookieService.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
        
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
         
          this.router.navigate(['/chat']);
  
        } else {
  
          this.toastr.error(apiResponse.message);
  
        }
  
      }, 
  
      (err) => {
  
        this.toastr.error('some error occured');
  
      }
  
  
     )
  
  }
  
  
  
  
  }




}
