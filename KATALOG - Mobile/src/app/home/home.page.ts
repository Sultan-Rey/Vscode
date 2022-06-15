import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage} from '@ionic/storage';
import { Product} from '../../models/product';
import { Observable} from 'rxjs';
import { FirestoreDataService } from '../firestore-data.service';
import * as firebase from 'firebase';
import { HomeDesign } from 'src/models/homeDesign';
import { CartItem } from 'src/models/cartItem';
import { IonImg, NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Categories } from 'src/models/category';
import { Brands } from 'src/models/brands';
import { Slides } from 'src/models/slides';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //Document collections
  @ViewChild('image', { static: false }) imageRef: IonImg;

  items: Product[];
  connected: boolean;
  product$: Observable<Product[]>;
  test$: Observable<Product[]>;
  categories$: Observable<Categories[]>
  brands$: Observable<Brands[]>
  slides$: Observable<Slides>;
  doc: any;
  homepane$: Observable<HomeDesign[]>;
  //--------------------------
  brands = [];
  slides = [];
  categories =[];
  navigation = [];
  images = [];
  browsing: Product[]=[];
  likeItem: Product[]=[];
  savedItem: CartItem[]=[];
  saveLater: CartItem[]=[];
  // main slider
  sliderOpts = {
    autoplay: true,
    initialSlide: 0,
    speed: 1000
  };

  slidersOpts = {
    loop: true,
    slidesPerView: 2,
  };
  
  numberOfMessage = 0;

  //highlight icon in the header
  slidersheading = {
    loop: true,
    slidesPerView: 5,
  };
  
  constructor(private router: Router, private firestoreData: FirestoreDataService, private db: AngularFirestore,
              private storage: Storage, private navCtrl: NavController) {
                this.connected = this.firestoreData.getConnexionState();
                this.navigation = ["categories", "Wish List", "Recent Views","Today Deals","By Tomorrow", "Kindness", "Policy", "profil"];
                this.product$ = this.firestoreData.getProducts();
                this.homepane$ = this.firestoreData.getHomeDesign();
                this.categories$ = this.firestoreData.getCategories();
                this.brands$ = this.firestoreData.getBrands();
                this.slides$ = this.firestoreData.getMainSlides();
               
  }


  reload(){
    globalThis.location.reload();
  }
  imgDidLoad(){
    document.getElementById('img').style.display = "none";
  }
  
  submitquery(contact: string, question:string){
    if(question!=='' && contact!==''){
      contact='';
      question = '';
    }
  }

  calculateDiscount(price: number, percentage: any, endTime: any){
   let  retail: number = price/100 * percentage;
   let discount: number = price - retail;
   this.comptor(endTime);
   return discount;
  }

  comptor(timing: any){
    // Set the date we're counting down to
//var countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();
var countDownDate = new Date(timing).getTime();
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  /* document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s "; */
  document.getElementById("HR").innerHTML = hours+"&nbsp;hr ";
  document.getElementById("MN").innerHTML = minutes + "&nbsp;&nbsp;m "
  document.getElementById("SEC").innerHTML= seconds + "&nbsp;&nbsp;s "

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);

  }



  getBrowsingHistoric(){
    this.storage.get("browsing").then((historic:Product[])=>{
        if(historic.length >4 && historic!==null){
          this.browsing = [historic[0],historic[1],historic[historic.length-1],historic[2]]
        }
    }).catch(err=>{
      console.log("no browsing data found");
    });
   return this.browsing;
  }

  getLikeItems(){
    this.storage.get("likeItem").then((liked:Product[])=>{
      if(liked.length!==0 && liked!==null){
        this.likeItem = liked;
      }
      
    }).catch(err=>{
      console.log("no like items data found");
    });
   return this.likeItem;
  }

  getSavedItems(){
    this.storage.get("savedforlater").then((saved:CartItem[])=>{
        if(saved.length!==0 && saved!==null){
          for(let savedItem of saved){
            this.savedItem.push(savedItem);
          }
        }
    }).catch(err=>{
      console.log("no saved items data found");
    });
   return this.savedItem;
  }

/*
* Drop to link with data transfer
*/

  navigateTo(route: string){
    if(route!=='Kindness' && route!=='Policy' && route!=='Profil'){
      const navigationExtras: NavigationExtras = {
        state: {
          direction: route
        }
      };
      this.router.navigate(['/historic'], navigationExtras);
    }else if(route=='Kindness' ){
      this.navCtrl.navigateForward('/helpcenter');
    }
    else if(route=='Policy' ){
      this.navCtrl.navigateForward('/policy');
    }
    else if(route=='Profil' ){
      this.navCtrl.navigateForward('/account');
    }
    
    
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



