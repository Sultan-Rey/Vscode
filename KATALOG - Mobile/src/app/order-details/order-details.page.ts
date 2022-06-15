import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Address } from 'src/models/addresses';
import { Message } from 'src/models/message';
import { Order } from 'src/models/order';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  data: Order;
  shippingAddress: string='';
  orderStatus: 'Not shipped yet';
  userType: string='';
  carrier ={
    name: '',
    tracking: ''
  }
  nodata: boolean=true;
  msg: Message;
  address: Address[];
  constructor(private route: ActivatedRoute, private router: Router, private afirestore: AngularFirestore, 
              private fireAuth: AngularFireAuth, private alertcontroller: AlertController, private storage: Storage) { 
                this.msg = {} as Message;
                this.getAdresses();
              }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.order;
        this.userType =   this.router.getCurrentNavigation().extras.state.type;
        
      }
    });
    if(!isNullOrUndefined(this.data)){
      this.nodata = false; 
    }else{ this.nodata = true;}
  }

  getAdresses(){
  
    this.storage.get("address").then((data:Address[])=>{
        this.address= data;
        
    }).catch(err=>{
      console.log("addresses not found or empty");
    });
   
  }

  async changeAddress(address: string, orderId: string){
    
   
    this.msg.author = (await this.fireAuth.currentUser).uid;
    this.msg.object = "ORDER_UPDATE";
    this.msg.content = address;
    this.msg.destination = "ADMIN";
    this.msg.date_msg = new Date(Date.now());
    this.afirestore.collection("messages").add(this.msg);
    this.afirestore.collection('message').doc("ADMIN_ONE").collection('update').add(this.msg).then(async ()=>{
      const alert = await this.alertcontroller.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        subHeader: 'Subtitle',
        message: 'Shipping address will change to.'+address+' please verify your message box for confirmation',
        buttons: ['Ok']
      });
      await alert.present();
    })
    }

  async cancelOrder(data: Order){
    let userId = (await this.fireAuth.currentUser).uid;
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Cancel Order',
      message: 'Do you really want to cancel order.'+data.orderId,
      buttons: [
        {text:'OK',cssClass: '',handler:(ok)=>{
          this.afirestore.collection("orders").doc(userId)
                          .collection("customer_order").doc(data.orderId)
                          .update({"shipment.status":"CANCELLED" })
                          .then(()=>{
                            this.data.shipment.status = "User is cancelling the order"
                          }).catch((reason)=>{this.msgFaillure(reason)});
         }
        },
        {text:'Cancel', cssClass:'my-custom-class'}
                ]
    });
    await alert.present();
  }

  async refunding(data: Order){
    document.getElementById("spin2").setAttribute("hidden", "false");
    let userId = (await this.fireAuth.currentUser).uid;
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Assign carrier',
      message: 'By starting a refund process you have to return back the purchased item. please contact customer services for support. ',
      buttons: [
        {text:'OK',cssClass: '',handler:(ok)=>{
          this.afirestore.collection("orders").doc(userId)
          .collection("customer_order").doc(data.orderId)
          .update({"shipment.status":"REFUNDS"})
          .then(()=>{
            document.getElementById("spin2").setAttribute("hidden", "true");
            this.data.shipment.status = "Refunds process started"
          }).catch((reason)=>{this.msgFaillure(reason);  document.getElementById("spin2").setAttribute("hidden", "true");});

         }
        },
        {text:'Cancel', cssClass:'my-custom-class'}
      ]
    });
    await alert.present()
  }
  async setCarrier(carrier: any, orderId: string){
    if(carrier.name!=='' && carrier.tracking!=='' && carrier.name!==null && carrier.tracking!==null ){
      document.getElementById("spin").setAttribute("hidden", "false");
      let userId = (await this.fireAuth.currentUser).uid;
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Assign carrier',
      message: 'Once you validate item will be shipped by carrier '+carrier.name,
      buttons: [
        {text:'OK',cssClass: '',handler:(ok)=>{
          this.afirestore.collection("orders").doc(userId)
          .collection("customer_order").doc(orderId)
          .update({"shipment.status":"Shipped", "shipment.carrier":carrier.name, "shipment.tracking":carrier.tracking })
          .then(()=>{
            document.getElementById("spin").setAttribute("hidden", "true");
            this.data.shipment.status = "Shipped"
          }).catch((reason)=>{this.msgFaillure(reason);  document.getElementById("spin").setAttribute("hidden", "true");});

         }
        },
        {text:'Cancel', cssClass:'my-custom-class'}
      ]
    });
    await alert.present();

    }else{
      this.msgFaillure("No tracking number or carrier set");
    }
    
  }

  async msgFaillure(reason: any){
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Assign carrier',
      message: 'Operation failed'+reason,
      buttons: ['OK']
    });
    await alert.present();
  }
}
