import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CartItem } from 'src/models/cartItem';
import { Product } from 'src/models/product';
import { FirestoreDataService } from '../firestore-data.service';
import{Storage} from '@ionic/storage';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-searchquery',
  templateUrl: './searchquery.page.html',
  styleUrls: ['./searchquery.page.scss'],
})
export class SearchqueryPage implements OnInit {
  query:string = '';
  items:Product[]=[];
  details: CartItem;
  constructor(private route: ActivatedRoute, private router: Router, private firestoreData: FirestoreDataService,
              private lstorage: LocalStorageService, private toastcontroller: ToastController) {
    
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.query = this.router.getCurrentNavigation().extras.state.query;
        if(this.query!==''&& this.query!==null){
          
        }
      }
    });
    
  }

  search(){
    if(this.query!==''){
      this.items = this.firestoreData.getFirestoreData().filter((product)=>product.name.toUpperCase().includes(this.query.toUpperCase()) || product.description.toUpperCase().includes(this.query.toUpperCase())); 
    }
    else{
      
    }
  }

  goTo(item: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        product: item
      }
    };
    this.router.navigate(['/product'], navigationExtras);
  }

  setItem(item_details: Product){
    this.details = {} as CartItem;
    this.details.name = item_details.name;
    this.details.brand =  item_details.brand;
    this.details.description = item_details.description;
    this.details.category =  item_details.category;
    this.details.qty =  1;
    this.details.size =  item_details.size[0];
    this.details.color =  item_details.models[0].id;
    this.details.shippingFee =  item_details.shippingFee;
    this.details.deliveryFee =  item_details.deliveryFee;
    this.details.taxFee =  item_details.taxFee;
    this.details.deliveryDate =  item_details.deliveryDate;
    this.details.picture = item_details.models[0].pictures[0];
    this.details.price = item_details.caracteristic[0].price;
    return this.details;
  }

   addToCart(item_details: Product) {
    this.lstorage.addTocart(this.setItem(item_details)).then(async ()=>{
      const toast = await this.toastcontroller.create({
        header : "Add To Cart",
        message: "Item added to your cart",
        duration: 2000
      });
      await toast.present();
    });
    
  }

 



}
