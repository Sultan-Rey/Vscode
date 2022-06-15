import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Storage} from '@ionic/storage';
import { Observable } from 'rxjs';
import { Brands } from 'src/models/brands';
import { Categories } from 'src/models/category';
import {  Product } from 'src/models/product';
import { FirestoreDataService } from '../firestore-data.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {

  data: string='';
  browsing: Product[];
  likesItems: Product[];
  items: Observable<Product[]>;
  categs: Observable<Categories[]>;
  brands: Observable<Brands[]>;
  constructor(private storage: Storage, private fData: FirestoreDataService, private route: ActivatedRoute, 
              private router: Router, private lStorage: LocalStorageService) 
  {   }

  ngOnInit() {

    this.browsing = this.lStorage.getBrowsingHistoric();
    this.likesItems = this.lStorage.getLiked();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.direction;
        switch(this.data){
          case 'Buy by categories': this.categs = this.fData.getCategories();
          break;
          case 'Recent Views': this.items = this.fData.getProducts();
          break;
          case 'Wish List': this.items = this.fData.getProducts();
          break;
          case 'Today Deals': this.items = this.fData.getbyPromotion('Today Deals');
          break;
          case 'By Tomorrow': this.items = this.fData.getbyPromotion('By Tomorrow');
          break;
          case 'brand': this.brands = this.fData.getBrands();
          break;
        }
      }
    });
  }

  updateCheck(product: Product, checkCase: string){
    let check:boolean = false;
    try{
      if(checkCase == 'Wish List' && this.likesItems.length!==0){
        for(let item of this.likesItems){
          if(item.description == product.description){
            check = true;
          }
        }
      }
      else if(checkCase == 'Recent Views' && this.browsing.length!==0){
        for(let item of this.browsing){
          if(item.description == product.description){
            check = true;
          }
        }
      }
    }catch(err){
      console.log("empty data"+err);
    }
   
    return check;
  }

  linkTo(param: string, optional:string){
    const navigationExtras: NavigationExtras = {
      state: {
        item: param,
        option: optional
      }
    };
    this.router.navigate(['/categories'], navigationExtras);
  }
  
  goTo(item: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        product: item
      }
    };
    this.router.navigate(['/product'], navigationExtras);
  }
  
}


