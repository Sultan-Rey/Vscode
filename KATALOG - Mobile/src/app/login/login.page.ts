import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { AngularFireAuth} from '@angular/fire/auth';
import { Order } from 'src/models/order';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage} from '@ionic/storage';
import { ControlContainer } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/models/user';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User;
  dataUser = {
    mail: '',
    password: ''
  };
  data: Order|'';
  returnway: '/home';
  constructor(private route: ActivatedRoute, private router: Router, private storage: Storage,
              private afAuth: AngularFireAuth, private loadingcontroller: LoadingController,
              private alertcontroller: AlertController, private afirestore: AngularFirestore) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.order;
        this.returnway = this.router.getCurrentNavigation().extras.state.route;
      }
    });
  }

  async login(data: any){
    
       await this.loadingcontroller.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: 5000
       }).then( async (control)=>{
         control.present();
         
         this.afAuth.signInWithEmailAndPassword(data.mail.trim(), data.password.trim()).then(async () => {
          this.dataUser = {mail: '',password: ''};
            
            if((await this.afAuth.currentUser).emailVerified){
              this.storage.set("user", (await this.afAuth.currentUser).uid.toString())
              const navigationExtras: NavigationExtras = {
                state: {
                  order: this.data
                }
              };
              control.dismiss();
              if(!isNullOrUndefined(this.data)){
                this.router.navigate(['/place-order'], navigationExtras);
              }else{ 
                this.router.navigate(['/home']);
            }
            
          }
          
          }).catch(rejection=>{control.dismiss(rejection, "alert");});
      
         control.onWillDismiss().then(async (load)=>{
          if(load.role =="alert"){
            const alert = await this.alertcontroller.create({
              cssClass: 'my-custom-class',
              header: 'Alert',
              subHeader: 'Network Error',
              message: 'Login failed'+load.data,
              buttons: ['Ok']
            });
            await alert.present();
          }
           
          });//loading dismissed()
       });
  }

  toSignUp(){
    const navigationExtras: NavigationExtras = {
      state: {
        order: this.data
      }
    };
    this.router.navigate(['/signup'], navigationExtras);
  }
}
