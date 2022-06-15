import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/models/product';
import { Storage} from '@ionic/storage';
import { Order, Shipment } from 'src/models/order';
import { isNullOrUndefined } from 'util';
import { CartItem } from 'src/models/cartItem';
import { FirestoreDataService } from '../firestore-data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  element='';
  item: Product;
  browsing: Product[]=[];
  cart: CartItem[] = [];
  saved: CartItem[]=[];
  isOnline: boolean = false;
  noItem: boolean;
  nosaved: boolean;
  orderQty:number = 0;
  totalcost:number = 0.00;
  
  constructor(private toastconroller: ToastController,private router: Router, private fstoreService: FirestoreDataService, private storage: Storage) {
    this.getsavedforlater();this.getCartItems();
    this.getBrowsingHistoric();
  }

  ngOnInit() {
   this.noItem = false;
   this.nosaved = false;
  }
 
  
  checkForCartUpdate(){
    let arr2 = this.fstoreService.getFirestoreData();
    const res1 = arr2.filter((item1) => !this.cart.find(item2 => item1.description === item2.description )) 
console.log(res1)
console.log(arr2);
    
  }

  getCartItems(){
    this.totalcost = 0.00;
    this.storage.get("cart").then((data:CartItem[])=>{
      this.cart= data;
       
    }).catch(err=>{
      console.log("cart not found or empty");
      
    }); 
  }
  getsavedforlater(){
    this.storage.get("savedforlater").then((data:CartItem[])=>{
        this.saved=data;
        this.nosaved = false;
    }).catch(err=>{
      console.log("saved not found or empty");
      this.nosaved = true;
    });
   
  }

  getBrowsingHistoric(){
    this.storage.get("browsing").then((historic:Product[])=>{
        if(historic.length!==0 && historic!==null){
          
          for(let product of this.fstoreService.getFirestoreData()){
            for(let item of historic){
              if(product.name==item.name && product.description==item.description){
                this.browsing.push(product);                
              }
            }
            
          }
        }
    }).catch(err=>{
      console.log("no browsing data found");
    });
   return this.browsing.reverse;
  }

  

  adjustqty(pressed: string, item: CartItem)
  {
    if(pressed === 'minus'){
      if(item.qty !== 1){
       item.qty--;
       
      }else{

      } 
    }
    if(pressed === 'plus'){
      item.qty++;
    }
    this.storage.set('cart', this.cart);
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.qty, 0);
  }

  savedForLater(item: CartItem){
    let deleted: boolean = false;
    let tosaved: CartItem;
   for(let cartItem of this.cart){
     if(cartItem === item){
       this.cart.splice(this.cart.indexOf(item),1);
        tosaved = cartItem;
       deleted = true
           }
   }
   if(deleted){
     let alreadySaved = false;
    this.storage.set("cart",this.cart);
    this.storage.get('savedforlater').then((saved: CartItem[])=>{
      if(saved == null || saved.length==0){
        saved = [];
        saved.push(tosaved);
      }else 
        {
          for(let saveItem of saved){
            if(saveItem == tosaved){
              saveItem.qty = tosaved.qty
              alreadySaved = true;

            }
          }
          if(!alreadySaved){
            saved.push(tosaved);
          }
        }
        this.storage.set("savedforlater",saved);
    })
   }
   this.getsavedforlater();
  }

  remove(item:CartItem){
    let deleted:boolean=false;
    for(let cartItem of this.cart){
      if(cartItem === item){
        this.cart.splice(this.cart.indexOf(cartItem),1);
        deleted = true
            }
    }
    if(deleted){
      this.storage.set("cart",this.cart);
      //this.getCartItems();
    }
  }

  moveToCart(item:CartItem){
    let move:boolean=false;
          for(let saved of this.saved){
            if(saved === item){
              this.saved.splice(this.saved.indexOf(item),1);
              this.cart.push(saved);
              move=true;
            }
          }
          if(move){
            this.storage.set("savedforlater",this.saved);
            this.storage.set("cart",this.cart);
            //this.getCartItems();
          }
    
  }
  crypto(){
    let date =  Date.now();
    let id: string = "CA"+Math.floor(Math.random()*1000)+"-"+date;
    return id;
  }
  checkout(cartItems: any){
    let shipment = {} as Shipment;
    if(this.totalcost>0.00){
    shipment.goods_departure = 'Packaging with KATALOG team service';
    shipment.shipping_destination = '';
    shipment.status = 'Not shipped yet';
    shipment.carrier = '';
    shipment.trackingnumber = '';
    let prepareOrder: Order = {
      customerId: 'code',
      orderId: this.crypto(),
      items: cartItems,
      date_order: new Date(Date.now()),
      order_qty: this.orderQty,
      amount: this.getTotal(),
      shipment: shipment,
    }
      const navigationExtras: NavigationExtras = {
        state: {
          order: prepareOrder
        }
      };
      this.router.navigate(['/place-order'], navigationExtras);
      
    }

  }

  goTo(item: any): void {
    this.item = {} as Product;
    let isfound = false;
    for(let product of this.fstoreService.getFirestoreData()){
      if(product.name==item.name && product.description==item.description){
        this.item = product;
        isfound = true;
      }
    }
   
    if(isfound){
      const navigationExtras: NavigationExtras = {
        state: {
          product: item
        }
      };
      this.router.navigate(['/product'], navigationExtras);
    }else{
      this.rejection()
    }
    
  }

  checkQty(item: any){
    let stockQty = 10;
    for(let product of this.fstoreService.getFirestoreData()){
      if(product.name==item.name && product.description==item.description){
        stockQty = product.qty;
      }
    }
    return stockQty;
  }

  async rejection(){
    let toast = await this.toastconroller.create({
      message: 'Sorry! product is no longer available',
      duration: 3000
    });
   await  toast.present();
  }

  filter(){
    if(this.element!==''){
      this.cart.filter((item)=>item.name.includes(this.element));
    }
    
  }

}
