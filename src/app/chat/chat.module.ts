import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { RouterModule,Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrService, ToastrModule } from 'ngx-toastr';



@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      
      {path:'chat',component:ChatboxComponent}
      
    ])
  ],
  declarations: [ChatboxComponent]
})
export class ChatModule { }

