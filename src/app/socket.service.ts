import { Injectable } from '@angular/core';
import { SocketIoModule, SocketIoConfig,} from 'ngx-socket-io';

import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';   //http client to make request
import {HttpHeaders,HttpParams} from  '@angular/common/http'; 
import { Observable } from 'rxjs';        //import observable related code  
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import * as io from 'socket.io-client';

import { Cookie } from 'ng2-cookies/ng2-cookies'; 
import { ObserveOnOperator } from 'rxjs/internal/operators/observeOn';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


@Injectable({
  providedIn: 'root'
})

export class SocketService {

  private url = 'https://chatapi.edwisor.com';
  private socket;


  constructor(public http:HttpClient) { 
    this.socket = io(this.url); //connection is created
    
  }

  //events to be listened

public verifyUser = () =>{
//components interact only with observables since componensts interact only with observ.
return Observable.create((observer) => {

this.socket.on('verifyUser',(data) =>{

   observer.next(data);    

});   //end socket

});  //end observable

  }   //end verify user


  public onlineUserList = () =>{

    return Observable.create((observer) => {
    
    this.socket.on('online-user-list',(userList) =>{
    
       observer.next(userList);    
    
    });   //end socket
    
    });  //end observable
    
      }   //end online user list


      public disconnectedSocket = () =>{               //  check             in apis

        return Observable.create((observer) => {
        
        this.socket.on('disconnect',() =>{
        
           observer.next();    
        
        });   //end socket
        
        });  //end observable
        
          }   //end disconnect


          public chatByUserId = (userId) => {

            return Observable.create((observer) => {
              
              this.socket.on(userId, (data) => {
        
                observer.next(data);
        
              }); // end Socket
        
            }); // end Observable
        
          } // end chatByUserId       



          public getChat(senderId, receiverId, skip): Observable<any> {

            return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
              .do(data => console.log('Data Received'))
              .catch(this.handleError);
        
          }
          
  




//EVENTS TO BE EMITTED

public setUser = (authToken) =>{

  this.socket.emit('set-user', authToken)          //sending auth token , check from where it is coming

}  //end setuser


public SendChatMessage = (chatMsgObject) => {         //check how chatmsobject is coming in html

  this.socket.emit('chat-msg', chatMsgObject);

} // end getChatMessage


public exitSocket = () =>{


  this.socket.disconnect();


}// end exit socket


public markChatAsSeen = (userDetails) => {

  this.socket.emit('mark-chat-as-seen', userDetails);         // user details, check from where

} // end markChatAsSeen





private handleError(err: HttpErrorResponse){

  let errorMessage = '';

if(err.error instanceof Error) {

errorMessage = `an error occured :${err.error.message}`;

} else {

  errorMessage = `server returned code :${err.status}, error message is:${err.error.message}`;
  
}  //

  console.error(errorMessage);
 
  return Observable.throw(errorMessage)

} //end handle error func



} //end class socket service
