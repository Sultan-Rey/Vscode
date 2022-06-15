import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Product} from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData, DocumentReference} from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { Order } from 'src/models/order';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/models/user';
import { Message } from 'src/models/message';
import { HomeDesign } from 'src/models/homeDesign';
import { Storage } from '@ionic/storage';
import { Categories } from 'src/models/category';
import { Brands } from 'src/models/brands';
import { Slides } from 'src/models/slides';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {
 
  productCollection: AngularFirestoreCollection<Product>;
  categoriesCollection: AngularFirestoreCollection<Categories>;
  brandsCollection: AngularFirestoreCollection<Brands>;
  slidesDocument: AngularFirestoreDocument<Slides>;
  ordersCollection: AngularFirestoreCollection<Order>;
  usersCollection: AngularFirestoreCollection<User>;
  msgCollection: AngularFirestoreCollection<Message>;
  homeCollection: AngularFirestoreCollection<HomeDesign>;
  message: Observable<DocumentData[]>;
  product: Observable<Product[]>;
  category: Observable<Categories[]>
  brand: Observable<Brands[]>
  user: Observable<User[]>;
  slides: Observable<Slides>;
  homeDesign: Observable<HomeDesign[]>;
  orderData: Observable<Order[]>;
  msg: Message[];
  items: Product[];
  app_user: User[];
  items_ordered: Order[];
  userId: string='';
  connected: boolean;
  constructor( private afs: AngularFirestore, private afAuth: AngularFireAuth, private storage: Storage) { }




  getAuthState(){
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
      } else {
        this.connected = true;
      }
    });
    return this.connected;
  }
  
  getConnexionState(){
    return globalThis.navigator.onLine;
  }

  getMainSlides(){
    this.slidesDocument = this.afs.collection('homepane').doc('d0pWnLNzch6ACeFKJmrj');
    this.slides = this.slidesDocument.valueChanges();
    return this.slides; 
  }

  getCategories(){
    this.categoriesCollection = this.afs.collection('categories', q=>q.orderBy("categoryName","asc").limit(4));
    this.category = this.categoriesCollection.valueChanges();
    return this.category; 
  }
  getAllcategories(){
    this.categoriesCollection = this.afs.collection('categories', q=>q.orderBy("categoryName"));
    this.category = this.categoriesCollection.valueChanges();
    return this.category; 
  }

  getBrands(){
    this.brandsCollection = this.afs.collection('brands', q=>q.orderBy("date_added","asc").limit(4));
    this.brand = this.brandsCollection.valueChanges();
    return this.brand; 
  }

  getbyPromotion(promo: string){
    this.productCollection = this.afs.collection('product', q=>q.where("display.position","==",promo));
    this.product = this.productCollection.valueChanges();
    return this.product;
  }

   getFirestoreData(){
    this.items = new Array();
    this.productCollection = this.afs.collection('product');
    this.product = this.productCollection.valueChanges();
   
    /*
    * Product subscription for uploading
    */

   this.product.subscribe(observer => {
   
      observer.forEach(e => {
     

        this.items.push({
          code: e.code,
          name: e.name,
          description: e.description,
          brand: e.brand,
          rating: e.rating,
          category: e.category,
          qty: e.qty,
          deliveryDate: e.deliveryDate,
          shipment: e.shipment,
          policy: e.policy,
          shippingFee: e.shippingFee,
          deliveryFee: e.deliveryFee,
          taxFee:e.taxFee,
          about: e.about,
          models: e.models,
          caracteristic: e.caracteristic,
          status: e.status,
          availability: e.availability,
          display: e.display
        });
        
      
          

      });

    }); 

    return this.items;
  }

  getProducts(){
    this.productCollection = this.afs.collection('product',q=>q.orderBy('creation_date','desc'));
    this.product = this.productCollection.valueChanges();
    return this.product;
  }
  getHomeDesign(){
    this.homeCollection = this.afs.collection('homepane', q=>q.orderBy("range","asc"));
    this.homeDesign = this.homeCollection.valueChanges();
    return this.homeDesign;
  }

  filterByCategory(category:string){
    this.productCollection = this.afs.collection('product', q=>q.where("category","==",category).orderBy("creation_date","desc"));
    this.product = this.productCollection.valueChanges();
    return this.product;
  }

  filterByBrand(category:string){
    this.productCollection = this.afs.collection('product', q=>q.where("brand","==",category).orderBy("creation_date","desc"));
    this.product = this.productCollection.valueChanges();
    return this.product;
  }

  filterBySearchQueries(query: string){
    this.productCollection = this.afs.collection('product', q=>q.where("description","==",query).orderBy("creation_date","desc"));
    this.product = this.productCollection.valueChanges();
    return this.product;
  }

 /*  getOrderAsadmin(){
    this.items_ordered = new Array();
    this.ordersCollection = this.afs.collection('orders');
    this.orderData = this.ordersCollection.doc().collection("customer_order").valueChanges();
    this.orderData.subscribe(observer=>{
      
      observer.forEach(e => {
       
        this.items_ordered.push({
              orderId: e.orderId,
              items: e.items,
              date_order: e.date_order,
              order_qty: e.order_qty,
              amount: e.amount,
              shipment: e.shipment
        });

    });
    });
    return this.items_ordered;
  } */
   getFirestoreOrder(){
       
        this.ordersCollection = this.afs.collection('orders',q=>q.where("customerId","==",this.userId));
        this.orderData = this.ordersCollection.valueChanges();
     return this.orderData;

  }
  getOrder(param:string){
       
    this.ordersCollection = this.afs.collection('orders',q=>q.where("customerId","==",param));
    this.orderData = this.ordersCollection.valueChanges();
 return this.orderData;
}

  getUsers(){
    this.usersCollection = this.afs.collection('user');
    this.user = this.usersCollection.valueChanges();
   return this.user;
  }

async getMessage(){
  let boxOwner = (await this.afAuth.currentUser).uid;
  this.msg = new Array();
  this.msgCollection = this.afs.collection('message');
  this.message = this.msgCollection.doc(boxOwner).collection('update').valueChanges();
  this.message.subscribe(observer => {
    observer.forEach(e => {
        this.msg.push({
          author: e.author,
          destination: e.destination,
          object: e.object,
          content: e.content,
          date_msg: e.date_msg
      });

    });

  }); 
  return this.msg;
}

removeProduct(item:any){
  this.productCollection = this.afs.collection('product', q=>q.where("description","==",item.description));
  this.productCollection.get().toPromise().then(querySnapshot=>{
    querySnapshot.forEach(dd=>{
      dd.ref.delete();
    })
  })
}

editProduct(item:any){
 
  this.productCollection = this.afs.collection('product', q=>q.where("description","==",item.description));
 return this.productCollection.get().toPromise().then(querySnapshot=>{
    querySnapshot.forEach(dd=>{
      dd.ref.update(item)
    })
  })
 
}



}
