import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CartItem } from 'src/models/cartItem';
import { Product } from 'src/models/product';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  browsingItems: Product[];
  itemsLikes:Product[];
  cart: any;
  savedForLater: CartItem[];
  constructor(private storage: Storage) { }

  getBrowsingHistoric(){
    this.storage.get("browsing").then((historic:Product[])=>{
      if(historic.length!==0 && historic!==null){
        this.browsingItems = historic;
      }
    }).catch(err=>{
      console.log("no browsing data found");
    });
   return this.browsingItems;
  }

  getLiked(){
   
    this.storage.get("liked").then((liked: Product[]) => {
      if (liked !== null || liked.length !== 0) {
        this.itemsLikes = liked
      }
    }).catch(err=>{
      console.log("no like items not found or empty");
    });
    return this.itemsLikes;
  }

  getCartItems(){
    this.storage.get("cart").then((data:any)=>{
      this.cart= data;   
    }).catch(err=>{
      console.log("cart not found or empty");  
    });
    return this.cart;
  }
  getsavedforlater(){
    this.storage.get("savedforlater").then((data:CartItem[])=>{
        this.savedForLater=data;
    }).catch(err=>{
      console.log("saved not found or empty");
    });
   return this.savedForLater;
  }

  addTocart(item_details: CartItem){
    let isAdded: boolean = false;
    
   return this.storage.get("cart").then((data: CartItem[]) => {
      if (data === null || data.length === 0) {
        data = [];
        data.push(item_details)
      } else {
        for (let item of data) {
          if (item.description === item_details.description) {
            item.qty+=1;
            isAdded = true; 
          }
        }
        if (!isAdded) {
          data.push(item_details)
        }
      }
      this.storage.set("cart", data);
      
    }); 
  }

  addInWishList(likeItem: Product){
    let isAdded: boolean = false;
    return this.storage.get("liked").then((liked: Product[]) => {
      if (liked === null || liked.length === 0) {
        liked = [];
        liked.push(likeItem);
      } else {
        for (let items of liked) {
          if (items === likeItem) {
            items = likeItem;
            isAdded = true;
          }
        }
        if (!isAdded) {
          liked.push(likeItem);
        }
      }
      this.storage.set("liked", liked);
    });
  }
}
