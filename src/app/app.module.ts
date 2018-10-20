import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; 
import { CookieService } from 'ngx-cookie-service'; 


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    ChatModule,
    UserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
    {path:'login',component:LoginComponent,pathMatch:'full'},
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'*',component:LoginComponent},
    {path:'**',component:LoginComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
