import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; 
import {Router}  from '@angular/router';
import { AppServiceService } from 'src/app/app.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  public firstName: any;
  public lastName: any;
  public Mobile: any;
  public email: any;
  public password: any;
  public apiKey: any;

  constructor(
   
    public appService: AppServiceService,
    public router: Router,
    private toastr:ToastrService 

  ) { }

  ngOnInit() {
 
  }

public goToSignIn: any = () =>
{
this.router.navigate(['/']);

}

public signupFunction: any =() =>{

  if(!this.firstName){
this.toastr.warning('Enter first name')
} else if(!this.lastName){
this.toastr.warning('Enter last name')
}else if(!this.Mobile) {
  this.toastr.warning('Enter mobile')
}else if(!this.email) {
  this.toastr.warning('Enter email')
}else if(!this.password) {
  this.toastr.warning('Enter password')
}else if(!this.apiKey) {
  this.toastr.warning('Enter api key')
} else {

   let data={

     firstName: this.firstName ,
     Mobile: this.Mobile,
     email: this.email,
     password: this.password,
     apiKey: this.apiKey,

   }
   console.log(data)

   this.appService.signupFunction(data).subscribe(

    (apiResponse) => {

      console.log(apiResponse);

      if (apiResponse.status === 200) {

        this.toastr.success('Signup successful');

        setTimeout(() => {

          this.goToSignIn();

        }, 2000);

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
