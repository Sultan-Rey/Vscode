import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from 'src/models/user';
import { isNullOrUndefined } from 'util';
import { Product } from 'src/models/product';
import { NavigationExtras, Router } from '@angular/router';
import { Order } from 'src/models/order';
import { FirestoreDataService } from '../firestore-data.service';
import { Observable } from 'rxjs';
import { CartItem } from 'src/models/cartItem';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  browsing: Product[]=[];
  likeItem: Product[]=[];
  cartItem: CartItem[]=[];
  orders$: Observable<Order[]>;
  connected: boolean=false;
  isOnline: boolean = false;
  welcomeWord: string ='';
  user: User; 
  userId: string;
  passwordForm = this.formBuilder.group({
    old: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
    new: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]]
  });

  public errorMessages = {
    password: [
      { type: 'required', message: 'Password is fully required' },
      { type: 'pattern', message: 'Password must be at least 8 characters with digits and uppercase' }
    ]
  }

  constructor(private formBuilder: FormBuilder, private fireauth: AngularFireAuth, private router: Router, 
    private afstore: AngularFirestore, private fireService: FirestoreDataService, private loadingcontroller: LoadingController, private storage: Storage) 
  {  
    this.isOnline = this.fireService.getConnexionState();
    this.getBrowsingHistoric();
    this.getLikeItems();
    this.getCartItems();
    this.getUid();
    
    this.fireauth.authState.subscribe(auth => {
    if (!auth){
      this.connected = false;
      this.welcomeWord = 'Manage your account';
    }else {
      this.connected = true;
      this.getUser(auth.uid);
    }
  }); 

 
}
  ngOnInit() {
    
  }
  async submit() {
    let correctpass:boolean=false;
    let userId= (await this.fireauth.currentUser).uid;
    this.afstore.collection('user').doc(userId).get().subscribe(obs=>{
      if(this.passwordForm.value.old == obs.get('password')){
        correctpass = true;
      }
      
    });
    if(correctpass){
      this.fireauth.currentUser.then((user)=>{ 
        user.updatePassword(this.passwordForm.value.new);}).then(async ()=>{
          const loading = await this.loadingcontroller.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
            duration: 2000
          }).then((loaded)=>{
            loaded.present();
            loaded.onDidDismiss().then((dismiss)=>{
              this.passwordForm.value.new=null;
              this.passwordForm.value.old=null;
              console.log(dismiss);
              });
          });
        });
    }else{
      this.passwordForm.value.new=null;
              this.passwordForm.value.old=null;
    }
    }
   
  signout(){
    this.fireauth.signOut().then(()=>{this.storage.remove("user");});
  }
 
  getOldPassword() {
    return this.passwordForm.get('old');
  }
  getNewPassword() {
    return this.passwordForm.get('new');
  }

  getUser(userUID: any){
    
    this.afstore.collection("user").doc(userUID).get().subscribe(user=>{
              this.user = new User(user.data());
              this.welcomeWord = 'Welcome '+this.user.name;
            });
            
          
  }


  getUid(){
    this.storage.get("user").then((uid:string)=>{
      this.userId = uid;
      this.orders$ = this.fireService.getOrder(this.userId);
    });
  }

  getBrowsingHistoric(){
    this.storage.get("browsing").then((historic:Product[])=>{
        if(historic.length!==0 && historic!==null){
          this.browsing = historic;
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

  getCartItems(){
    this.storage.get("cart").then((cart:CartItem[])=>{
      if(cart.length!==0 && cart!==null){
        this.cartItem = cart;
      }
      
    }).catch(err=>{
      console.log("no like items data found");
    });
   return this.likeItem;
  }


  navigateTo(route: string){
      const navigationExtras: NavigationExtras = {
        state: {
          direction: route
        }
      };
      this.router.navigate(['/historic'], navigationExtras);
    }
   
    }
