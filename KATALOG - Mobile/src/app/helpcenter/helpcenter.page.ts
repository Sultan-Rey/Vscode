import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Message } from 'src/models/message';
import { Order } from 'src/models/order';
import { isNullOrUndefined } from 'util';
import { FirestoreDataService } from '../firestore-data.service';

@Component({
  selector: 'app-helpcenter',
  templateUrl: './helpcenter.page.html',
  styleUrls: ['./helpcenter.page.scss'],
})
export class HelpcenterPage implements OnInit {
  textMesage: string;
  connected: boolean;
  msg: Message;
  order: Observable<DocumentData[]>;
  orderInfo: Order;
  msgDataFlux: Observable<DocumentData[]>;
  messageCollection: AngularFirestoreCollection<Message>;
  message: Message[];
  updateMessage: Message[]
  userId: any;
  kindnessIntroSpeech = '';
  kindnessEndSpeech = '';
  dialogFlow = {
    introduction: ['hello! im kindness the IA, and Im here to help you. Please tell me what matter!', 'Hi, Im Kindness How can i make you happy!','Haloa, please select an option and I\'ll help you'],
    box1: false,
    box2: false,
    box3: false,
    box4: false,
    box3Option: false,
    transfer: false,
    happyMood: ['You Welcome!!', 'Apreciate see you!','That my lovely job','Please continue shopping for your favorites items'],
    sorryMood: ['Sorry that, i won\'t help i\'ll do better next time', 'Disapointed, maybe you want to talk with a real person ?', 'My Fault, let me know if you want me transfer your issue to another person']
  }
  constructor(private afAuth: AngularFireAuth, private ngfirestore: AngularFirestore, private fdataService: FirestoreDataService) { 
    this.afAuth.authState.subscribe(auth=>{
      if(!auth){
        this.connected = false;
      }else{
        this.msg = {} as Message;
        this.orderInfo = {} as Order;
        this.userId = auth.uid;
        //this.deleteMessage(this.userId);
        this.getMessages(this.userId);
        this.connected = true;
      }
    })
    this.kindnessIntroSpeech = this.dialogFlow.introduction[Math.floor(Math.random()*2)]
  }

  ngOnInit() {
   
  }


  scenario(context: string){
    if(context=='ORDER'){
      if(!this.dialogFlow.box2 && !this.dialogFlow.box3){
        this.dialogFlow.box1 = true;
        this.order = this.fdataService.getFirestoreOrder();
      }
      
    }
    if(context == 'ORDERINFO'){
      this.dialogFlow.box2 = true;
    }
    if(context == 'MORE_HELP'){
      this.kindnessEndSpeech = this.dialogFlow.sorryMood[Math.floor(Math.random()*3)];
      this.dialogFlow.box3Option = true;
      this.dialogFlow.box3 = true;
    }
    if(context == 'END'){
      this.kindnessEndSpeech = this.dialogFlow.happyMood[Math.floor(Math.random()*3)];
      this.dialogFlow.box3Option = false;
      this.dialogFlow.box3 = true;
    }
    if(context == 'BETTER'){
      this.dialogFlow.box4 = true;
    }
    if(context == 'TALK'){
      
      this.msg.author = this.userId;
        this.msg.content = 'Order Issue';
        this.msg.date_msg = new Date(Date.now());
        this.msg.object = "HELP_CENTER";
        this.msg.destination = "ADMIN";
        this.ngfirestore.collection('message').doc('ADMIN').collection('update').add(this.msg).then(()=>{
          this.textMesage = "";
          this.dialogFlow.transfer = true;
        })
    }
    if(context == 'OTHER'){
      if(!this.dialogFlow.box1){
        this.kindnessEndSpeech = '';
        this.dialogFlow.box3Option = true;
        this.dialogFlow.box3 = true;
      }
      
    }
    
  }

  orderInformation(info: Order){
   this.orderInfo = info;
    this.scenario('ORDERINFO');

  }
  
  sendMessage(textMessage: string){
    if(this.dialogFlow.transfer){
      if(textMessage!=""){
        this.msg.author = this.userId;
        this.msg.content = textMessage;
        this.msg.date_msg = new Date(Date.now());
        this.msg.object = "HELP_CENTER";
        this.msg.destination = "ADMIN";
        this.ngfirestore.collection('message').doc(this.userId).collection('help').add(this.msg).then(()=>{
          this.textMesage = "";
        })
      }
    }else{
      this.textMesage = "";
    }
   
  }

  getMessages(property: any){
    this.message = new Array();
    this.messageCollection = this.ngfirestore.collection('message');
    this.msgDataFlux = this.messageCollection.doc(property).collection('help', ref=> ref.orderBy('date_msg')).valueChanges();
   
    this.msgDataFlux.subscribe(observer=>{
      this.message = [];
      observer.forEach(e => {
      
        this.message.push({
              author: e.author,
              content: e.content,
              date_msg: e.dte_msg,
              object: e.object,
              destination: e.destination
        });

    });
    });
    
  }

  deleteMessage(property: any){
    this.ngfirestore
    .collection('message').doc(property).collection('help')
    .get()
    .toPromise()
    .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  });
   
  }
  getDate(date:any){
    let dating: Date= new Date(date.seconds*1000 + date.nanoseconds);
      return dating.toDateString() ;
    }
}
