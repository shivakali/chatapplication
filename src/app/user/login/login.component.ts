  import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Router}  from '@angular/router';
import { AppServiceService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


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
    // public cookieService: CookieService
  ) {}

  ngOnInit() {
  }


  public goToSignUp: any = () =>
  {
  this.router.navigate(['/signup']);
  
  }

  public signinFunction: any =() =>{

    
  if(!this.email) {
    this.toastr.warning('Enter email')
  }else if(!this.password) {
    this.toastr.warning('Enter password')
  }else 
   {
  
     let data={
  
       email: this.email,
       password: this.password,
       apiKey: this.apiKey,
  
     }
     console.log(data)
  
     this.appService.signinFunction(data).subscribe(
  
      (apiResponse) => {
  
        
  
        if (apiResponse.status === 200) {
          console.log(apiResponse);
          
           Cookie.set('authtoken', apiResponse.data.authToken);
            
           Cookie.set('receiverId', apiResponse.data.userDetails.userId);
         
           Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
        
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
