import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { Storage } from '@ionic/storage';
import { Product } from '../../../models/product';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Displays } from 'src/models/display';
import { isNullOrUndefined } from 'util';
import { FirestoreDataService } from '../../firestore-data.service';
import { IonImg } from '@ionic/angular';
import { Order, Shipment } from 'src/models/order';
import { CartItem } from 'src/models/cartItem';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { promise } from 'protractor';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})

export class ProductPage implements OnInit {

  @ViewChild('image', { static: false }) imageRef: IonImg;

  data: Product;
  details: CartItem;
  dynamicPrice = 0;
  dynamicQty = 0;
  dynamicPictures = [];
  initialColor = '';
  initialSize = '';
  orderQty = 1;
  searchQuery = '';
  constructor(private route: ActivatedRoute, private router: Router, 
     private firestoreData: FirestoreDataService, private storage: Storage) {
    
  }

  ngOnInit() {
   
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.product;
        this.dynamicPrice = this.data.caracteristic[0].price;
        this.dynamicQty = this.data.caracteristic[0].qty;
        this.dynamicPictures = this.data.models[0].pictures;
        this.initialColor = this.data.models[0].id;
        this.initialSize = this.data.size[0];
      }
    });
    this.browsingHistoric(this.data);
  }

  picturesLoading(color: string){
    this.data.models.forEach(model=>{
      if(model.id==color){
        this.dynamicPictures = model.pictures;
      }
    })
    
  }

  priceLoading(color: string, size: string){
    this.data.caracteristic.forEach(c=>{
      if(c.color==this.initialColor && c.size == this.initialSize){
        this.dynamicPrice = c.price;
      }
    })
  }

  setColor(selectedColor: string)
{ 
  for(let model of this.data.models){
    document.getElementById(model.id).style.border="none";
  }
  this.initialColor = selectedColor;
  document.getElementById(selectedColor).style.border="4px solid black";
  document.getElementById(selectedColor).style.borderRadius="50%";
  this.priceLoading(this.initialColor, this.initialSize);
  this.picturesLoading(this.initialColor);
}  

  setSize(selectedSize: string)
  {
    for(let size of this.data.size){
      document.getElementById(size).setAttribute('color','medium');
    }
    this.initialSize = selectedSize
    document.getElementById(selectedSize).setAttribute('color','tertiary');
    this.priceLoading(this.initialColor, this.initialSize);
  }

  adjustqty(pressed: string) {
    if (pressed === 'minus') {
      if (this.orderQty !== 1) {
        this.orderQty--;
      } else {

      }
    }
    if (pressed === 'plus') {
      this.orderQty++;
    }
  }


  addToCart(item: Product) {
    let isAdded: boolean = false;
    
    this.storage.get("cart").then((data: CartItem[]) => {
      if (data === null || data.length === 0) {
        data = [];
        data.push(this.setItem(item));
      } else {
        for (let item of data) {
          if (item.picture === this.dynamicPictures[0]) {
            item.qty = this.orderQty;
            isAdded = true;
          }
        }
        if (!isAdded) {
          data.push(this.setItem(item));
        }
      }
      this.storage.set("cart", data);
      this.router.navigate(['/cart']);
    }); 

  }

  setItem(item_details: Product){
    this.details = {} as CartItem;
    this.details.name = item_details.name;
    this.details.brand =  item_details.brand;
    this.details.description = item_details.description;
    this.details.category =  item_details.category;
    this.details.qty =  this.orderQty;
    this.details.size =  this.initialSize;
    this.details.color =  this.initialColor;
    this.details.shippingFee =  item_details.shippingFee;
    this.details.deliveryFee =  item_details.deliveryFee;
    this.details.taxFee =  item_details.taxFee;
    this.details.deliveryDate =  item_details.deliveryDate;
    this.details.picture = this.dynamicPictures[0];
    this.details.price = this.dynamicPrice;
    return this.details;
  }

  prepareOrder(item: Product) {
    let shipment = {} as Shipment;
    shipment.goods_departure = item.shipment;
    shipment.shipping_destination = '';
    shipment.status = 'Not shipped yet';
    shipment.carrier = '';
    shipment.trackingnumber = '';
   
    let prepareOrder: Order = {
      customerId: new Date(Date.now())+"-"+"theUsername",
      orderId: this.crypto(),
      items: [this.setItem(item)],
      date_order: new Date(Date.now()),
      order_qty: this.orderQty,
      amount: this.orderQty * this.dynamicPrice,
      shipment: shipment,
    }
    return prepareOrder;
  }

  crypto() {
    let date = Date.now();
    let productname = this.data.name.substring(0, 2).toUpperCase();
    let _character = ['F', 'A', 'S', 'H', 'I', 'O', 'N', 'T', 'R', 'B', 'E', 'U', 'Y'];
    let sequence: number = Math.floor(Math.random() * 100);
    let index: number = Math.floor(Math.random() * 12);
    let encryption: string = _character[index] + _character[index + 1] + sequence + productname + "-" + date;
    return encryption;
  }

  willLoadImage() {
    this.getLiked();
    document.getElementById('loading').removeAttribute('hidden');
  }
  loadImage(image:string) {
    document.getElementById('loading').setAttribute('hidden','true');
  }
  errorLoad() {
    this.imageRef.src = '<your_default_img>';
  }

  

  authorized(args: Product) {

    if (this.firestoreData.getAuthState() === true){
   const navigationExtras: NavigationExtras = {
     state: {
       order: this.prepareOrder(args)
     }
   };
   this.router.navigate(['/place-order'], navigationExtras);
    }else{
    const navigationExtras: NavigationExtras = {
      state: {
        order: this.prepareOrder(args),
      }
    };
    this.router.navigate(['/login'], navigationExtras);
     }
 } 


  search(){
    if(this.searchQuery!=='' || this.searchQuery!==null){
      const navigationExtras: NavigationExtras = {
        state: {
          query: this.searchQuery
        }
      };
     
      this.router.navigate(['/searchquery'], navigationExtras);
    }
   
  }
 

/*   loadImage(image:string) {
    if(this.color!=='' && this.sizing!=''){
      document.getElementById(this.color).style.border="4px dotted #5260ff";
      document.getElementById(this.sizing).style.border="4px dotted #5260ff";
    }
    
    
    this.image = image;
   
  }
  
  errorLoad() {
    this.imageRef.src = '<your_default_img>';
  }

  

  adjustqty(pressed: string) {
    if (pressed === 'minus') {
      if (this.orderQty !== 1) {
        this.orderQty--;
      } else {

      }
    }
    if (pressed === 'plus') {
      this.orderQty++;
    }
  }

  crypto() {
    let date = Date.now();
    let productname = this.data.name.substring(0, 2).toUpperCase();
    let _character = ['F', 'A', 'S', 'H', 'I', 'O', 'N', 'T', 'R', 'B', 'E', 'U', 'Y'];
    let sequence: number = Math.floor(Math.random() * 100);
    let index: number = Math.floor(Math.random() * 12);
    let encryption: string = _character[index] + _character[index + 1] + sequence + productname + "-" + date;
    return encryption;
  }

  addToCart(item_details: Product) {
    let isAdded: boolean = false;
    item_details.features = [];
    item_details.features.push(this.selectedFeature);
    this.storage.get("cart").then((data: CartItem[]) => {
      if (data === null || data.length === 0) {
        data = [];
        data.push({
          product: item_details,
          item_qty: this.orderQty
         
        });
      } else {
        for (let item of data) {
          if (item.product.ref === item_details.ref) {
            item.item_qty = this.orderQty;
            
            isAdded = true;
          }
        }
        if (!isAdded) {
          data.push({
            product: item_details,
            item_qty: this.orderQty,
           
          });
        }
      }
      this.storage.set("cart", data);
      this.router.navigate(['/cart']);
    }); 
   

  }

  prepareOrder() {
    let myItem = {} as Product;
    let shipment = {} as Shipment;
    let method = {} as Paymethod;
    let products: Product[] = [];
    myItem = this.data;
    myItem.orderedqty = this.orderQty;
    myItem.ref = this.image;
    myItem.qty = this.orderQty;
    myItem.features = [];
    myItem.features.push(this.selectedFeature);
    shipment.goods_departure = myItem.shipment;
    method.method = "";
    products.push(myItem);
    let prepareOrder: Order = {
      orderId: this.crypto(),
      product: products,
      date_order: new Date(Date.now()),
      order_qty: this.orderQty,
      amount: this.orderQty * this.selectedFeature.price,
      shipment: shipment,
      payment: method
    }
    // console.log(prepareOrder);
    return prepareOrder;
  }

  authorized() {

     if (this.connected === true){
    const navigationExtras: NavigationExtras = {
      state: {
        order: this.prepareOrder()
      }
    };
    this.router.navigate(['/place-order'], navigationExtras);
     }else{
     const navigationExtras: NavigationExtras = {
       state: {
         order: this.prepareOrder(),
         returnway: '/place-order'
       }
     };
     this.router.navigate(['/login'], navigationExtras);
      }
  } */

  browsingHistoric(reference: Product) {
    
    if (!isNullOrUndefined(reference)) {
      let isAdded: boolean = false;
      this.storage.get("browsing").then((historic: Product[]) => {
        if (historic === null || historic.length === 0) {
          historic = [];
          historic.push(reference);
        } else {
          for (let _string of historic) {
            if (_string.description === reference.description) {
              _string = reference;
              isAdded = true;
            }
          }
          if (!isAdded) {
            historic.push(reference);
          }
        }
        this.storage.set("browsing", historic);
      });
    }


  }

  getLiked(){
    this.storage.get("likeItems").then((liked: Product[]) => {
      if (liked !== null || liked.length !== 0) {
        liked.forEach(element => {
          if(element.models[0].pictures[0] == this.data.models[0].pictures[0]){
            document.getElementById('heart').setAttribute('color','danger');
          }
        });
      }
    }).catch(err=>{
      console.log("no like items not found or empty");
    });
  }

  liked(reference: Product) {
    let isAdded: boolean = false;
    this.storage.get("likeItems").then((liked: Product[]) => {
      if (liked === null || liked.length === 0) {
        liked = [];
        liked.push(reference);
      } else {
        for (let _string of liked) {
          if (_string === reference) {
            _string = reference;
            isAdded = true;
          }
        }
        if (!isAdded) {
          liked.push(reference);
        }
      }
      this.storage.set("likeItems", liked).then(()=> document.getElementById('heart').setAttribute('color','danger'));
    });
  }
}







