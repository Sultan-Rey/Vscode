import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/models/product';
import { Order, Shipment } from 'src/models/order';
import { Address } from 'src/models/addresses';
import { Storage} from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/models/user';
import { CartItem } from 'src/models/cartItem';



@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.page.html',
  styleUrls: ['./place-order.page.scss'],
})
export class PlaceOrderPage implements OnInit {

    cost:string= btoa("600");
   id: string=btoa("12345");
   collapse: boolean;
   paymentRequest!: google.payments.api.PaymentDataRequest;
  data: Order;
  products: CartItem[];
  addresses: Address[];
  shippingAddress: string='';
  defaultaddress: Address;
  selectAddress: string='';
  productqty = 0;
  amountOrder: number = 0
  paymentMethod: string;
  orderCost: string;
  deliverydate: Date;
  tracknum: string;
  method: string;
  shippingfee = 0.00;
  taxfee = 0.00;
  deliveryfee = 0.00;
  promotion = 0.00;
  totalfee = 0.00;
  constructor(private http: HttpClient, private pickerCtrl: PickerController, private route: ActivatedRoute,
     private loadingcontroller: LoadingController,private storage: Storage, private alertcontroller: AlertController,
      private router: Router, private afirestore: AngularFirestore, private fireAuth: AngularFireAuth,
      ) {
    this.products=[];
    this.defaultaddress = {} as Address;
    this.getAdresses();
       }

  ngOnInit() {
    this.collapse = true;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.order;
      }
    });
    
    if(!isNullOrUndefined(this.data)){
      this.products = this.data.items;
      this.productqty = this.data.order_qty;
      this.amountOrder=this.data.amount; 
     this.data.items.map(product=>{this.shippingfee+=product.shippingFee;});
     this.data.items.map(product=>{this.deliveryfee+=product.deliveryFee;});
     this.data.items.map(product=>{this.taxfee+=product.taxFee;});
     this.data.items.map(product=>{this.deliverydate=this.calculateDeliveryDate(product.deliveryDate);})
      }
      
   

      this.paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedCardNetworks:[ "MASTERCARD", "VISA"],
              allowedAuthMethods: ['PAN_ONLY','CRYPTOGRAM_3DS']
            },
            tokenizationSpecification:{
              type:'PAYMENT_GATEWAY',
              parameters:{
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId'
              }
            },
          }
          
        ],
        merchantInfo:{
          merchantId: '12345678901234567890',
          merchantName: 'Example Merchant'
        },
        transactionInfo:{
          countryCode: 'US',
          currencyCode: 'USD',
          totalPriceLabel: 'TOTAL ALL TAXES INCLUDES',
          totalPriceStatus: 'FINAL',
      // set to cart total
          totalPrice: this.totalfee.toFixed(2)
        },
        shippingAddressRequired: true,
        shippingAddressParameters:{
          allowedCountryCodes: ["US","CA","HT"],
          phoneNumberRequired: true,
        },
        
      };

    }
 

    async onLoadPaymentData(event: Event){
      const paymentData = (event as CustomEvent<google.payments.api.PaymentData>).detail;
      console.log(paymentData);
    }

    calculCost(shippingfee: number,taxfee:number,deliveryfee:number,promotion:number, amount:number){
      return this.totalfee = amount+shippingfee+deliveryfee+taxfee-promotion;
    }

  shipaddressChange(){
    this.collapse = !this.collapse;
  }

  getAdresses(){
    
    this.storage.get("address").then((data:Address[])=>{
        this.addresses= data;
        for(let address of data){
          if(address.default){
            this.defaultaddress = address;
          }
        }
        if(!isNullOrUndefined(this.defaultaddress.address1) && isUndefined(this.defaultaddress.address2)){
          this.shippingAddress = this.defaultaddress.address1;
        }else if(!isNullOrUndefined(this.defaultaddress.address2) && isUndefined(this.defaultaddress.address1)){
          this.shippingAddress = this.defaultaddress.address2;
        }else if(!isNullOrUndefined(this.defaultaddress.address1) && !isNullOrUndefined(this.defaultaddress.address2)){
          this.shippingAddress = this.defaultaddress.address1;
        }else{this.shippingAddress="No default address set yet";}
    }).catch(err=>{
      console.log("addresses not found or empty");
    });
   
  }

  async setAsDefault(addressid: string){
    let setagreed: boolean = false;
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Shipping address change',
      message: 'Set address as default.',
      buttons: [
        {text:'OK',cssClass: '',handler:(ok)=>{ this.setDefault(addressid)}},
        {text:'Cancel', cssClass:'my-custom-class'}
      ]
    });
    await alert.present();
   
  }

  setDefault(address: string){
    let set:boolean=false;
   this.storage.get("address").then((data: Address[]) => {
    
   for (let item of data) {
         if (item.id === address) {
             item.default = true;
             set=true;
         }
     }

     if(set){ 
       for (let item of data) {
         if (item.id !== address) {
             item.default = false;
         }
     }
     this.setLoading(data); 
     }
     
   }).catch(err=>{alert(err)});
  }

  async setLoading(newaddress: Address[]){
    const loading = await this.loadingcontroller.create({
     cssClass: 'my-custom-class',
     message: 'Please wait...',
     duration: 2000
    }).then((control)=>{
      control.present();
      control.onWillDismiss().then((load)=>{
        this.addresses= newaddress;
        this.storage.set("address",newaddress).then(()=>{
          this.getAdresses();
        });
        
       });
    })
  }

  
  
  onSubmit(postData:any){
    const SERVER_URL = "https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware/Checkout/{UVdZeU0yMVlYMVpOUlhjOSBlbDlLUzBsU1kxbFpNVXQ0VUdSNU1UbFlRbXR0VVQwOQ==}";
    const formData = new FormData();
    formData.append("amount",btoa("600"));
    formData.append("orderId", btoa("123456"));
    console.log(formData);
    this.http.post<any>(SERVER_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );

  }

   place_order(items_cost: number){
    let items_ordered: Order={} as Order;
    this.data.shipment.shipping_destination = this.shippingAddress;
    items_ordered = this.data;
    items_ordered.amount =  items_cost;
    
    this.storage.get('user').then(async (userLogged:User)=>{
      if(!isNullOrUndefined(userLogged)){

        if(!userLogged.connection){

        }else{


          await this.loadingcontroller.create({
            cssClass: 'my-custom-class',
            message: 'processing your order...',
            duration: 2000
          }).then(async (loaded)=>{
            loaded.present();
            this.afirestore.collection("orders").doc((await this.fireAuth.currentUser).uid)
                            .collection("customer_order").doc(items_ordered.orderId)
                            .set(items_ordered).then(()=>{
                                loaded.dismiss();
                                this.sendToConfirm(items_ordered);
                            }).catch((reason)=>{ loaded.dismiss(reason, "failed");});
            loaded.onDidDismiss().then((obj)=>{
              if(obj.role == "failed"){
                this.msgOrderFailed();
              }
            });
          });
         
        } //if user is authentified


      }
     

    });
  }  
   
 async msgOrderFailed(){
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Network Faillure',
      message: 'Current order process failed.',
      buttons: ['Ok']
    });
    await alert.present();
  }
  
  calculateDeliveryDate(date: any){
    let deadline = new Date(Date.now());
    if(new Date(date.seconds*1000 + date.nanoseconds)>= deadline){
      deadline = date;
    }
    return deadline;
  }

  sendToConfirm(orderToconfirm: Order){
    const navigationExtras: NavigationExtras = {
      state: {
        order: orderToconfirm
        
      }
    };
    this.router.navigate(['/confirm'], navigationExtras);
  }

}
