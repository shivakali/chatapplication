import { Component, OnInit , ViewContainerRef, ViewChild, ElementRef} from '@angular/core';
import { AppServiceService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import {ChatMessage} from './chat';

import { ToastrService } from 'ngx-toastr';
 
import { RouterModule, Routes, Router} from '@angular/router';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  providers: [SocketService]
})
export class ChatboxComponent implements OnInit {

  @ViewChild('scrollMe', { read: ElementRef })

  public scrollMe: ElementRef;

  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;


  public previousChatList: any = [];
  public messageText: any; 
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;
  public scrollToChatTop:boolean= false;

  constructor(

    public AppService: AppServiceService,
    public SocketService: SocketService,
    public router: Router,
    private toastr:ToastrService
    
  ) {

    this.receiverId = Cookie.get('receiverId');

    this.receiverName = Cookie.get('receiverName');


   }


  ngOnInit() {

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfofromLocalStorage;


    this.receiverId = Cookie.get("receiverId");

    this.receiverName =  Cookie.get('receiverName');    

    console.log(this.receiverId,this.receiverName)

    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=''){
      this.userSelectedToChat(this.receiverId,this.receiverName)
    }

   // this.checkStatus();  //auth token presence

    this.verifyUserConfirmation();   //verify user event

    this.getOnlineUserList();
    this.getMessageFromAUser();    

  }  // end of init

 

  /* public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus */



  public verifyUserConfirmation: any = () => {

    this.SocketService.verifyUser()
      .subscribe((data) => {

        this.disconnectedSocket = false;

        this.SocketService.setUser(this.authToken);  //token emit
        //this.getOnlineUserList()

      });
    }  //end of verifyUserConfirmation



    public getOnlineUserList :any =()=>{

      this.SocketService.onlineUserList()
        .subscribe((userList) => {
  
          this.userList = [];
  
          for (let x in userList) {
  
            let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };
  
            this.userList.push(temp);          
  
          }
          
          console.log(this.userList);
  
        }); 

}    // end online-user-list


public sendMessageUsingKeypress: any = (event) => {

  if (event.keyCode === 13) { // 13 is keycode of enter.

    this.sendMessage();

  }

} // end sendMessageUsingKeypress




public sendMessage: any = () => {

  if(this.messageText){                        //check in html page

    let chatMsgObject:ChatMessage = {
      senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
      senderId: this.userInfo.userId,
      receiverName: Cookie.get('receiverName'),
      receiverId: Cookie.get('receiverId'),
      message: this.messageText,                      //check message text
      createdOn: new Date()
    } // end chatMsgObject
    console.log(chatMsgObject);
    
    this.SocketService.SendChatMessage(chatMsgObject)  //emit
    this.pushToChatWindow(chatMsgObject)
    

  }
  else{
    this.toastr.warning('text message can not be empty')

  }

} // end sendMessage



public pushToChatWindow : any =(data)=>{

  this.messageText="";
  this.messageList.push(data);

  this.scrollToChatTop = false;


}// end push to chat window



public getMessageFromAUser :any =(data)=>{

    this.SocketService.chatByUserId(this.userInfo.userId)
    .subscribe((data)=>{
     

      (this.receiverId==data.senderId)?this.messageList.push(data):'';

      this.toastr.success(`${data.senderName} says : ${data.message}`)

      this.scrollToChatTop=false;

    });//end subscribe

}
// end get message from a user 



public userSelectedToChat: any = (id, name) => {           //where this is called

  console.log("setting user as active") 

  // setting that user to chatting true   
  this.userList.map((user)=>{
      if(user.userId==id){
        user.chatting=true;
      }
      else{
        user.chatting = false;
      }
  })

  Cookie.set('receiverId', id);

  Cookie.set('receiverName', name);


  this.receiverName = name;

  this.receiverId = id;

  this.messageList = [];

  this.pageValue = 0;

  let chatDetails = {
    userId: this.userInfo.userId,
    senderId: id
  }


  this.SocketService.markChatAsSeen(chatDetails);   //emit

  this.getPreviousChatWithAUser();

} // end userselectedtochat function



public getPreviousChatWithAUser :any = ()=>{                        //where this is called
  let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
  
  this.SocketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
  .subscribe((apiResponse) => {

    console.log(apiResponse);

    if (apiResponse.status == 200) {

      this.messageList = apiResponse.data.concat(previousData);

    } else {

      this.messageList = previousData;
      this.toastr.warning('No Messages available')

      

    }

    this.loadingPreviousChat = false;

  }, (err) => {

    this.toastr.error('some error occured')


  });

}// end get previous chat with any user


public loadEarlierPageOfChat: any = () => {                                  //where this is called

  this.loadingPreviousChat = true;

  this.pageValue++;
  this.scrollToChatTop = true;

  this.getPreviousChatWithAUser() 

} // end loadPreviousChat




  public logout: any = () => {                                               //where this is called

  this.AppService.logout()
    .subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called") 
        
        Cookie.delete('authtoken');
        Cookie.delete('authToken');

        Cookie.delete('receiverId');
        Cookie.delete('receiverid');

        Cookie.delete('meetingid');

        Cookie.delete('receiverName');
        Cookie.delete('receivername');

        this.SocketService.exitSocket()

        this.router.navigate(['/']);

      } else {
        this.toastr.error(apiResponse.message)

      } // end condition

    }, (err) => {
      this.toastr.error('some error occured')


    });

} // end logout 


public showUsername =(name:string) =>{

  this.toastr.success("you are chatting with"+name)

}




}   // end of class
