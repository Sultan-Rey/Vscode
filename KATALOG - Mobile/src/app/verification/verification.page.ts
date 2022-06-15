import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Product } from 'src/models/product';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth} from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { User } from 'src/models/user';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  data: Product|'';
  user: User;
  credential = {
    mail: '',
    password: '',
    phone: ''
  };
  
  phone: string;
  state = true;
  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
              private afs: AngularFirestore, public loadingController: LoadingController,
              private storage: Storage, private afAuth: AngularFireAuth, private alertcontroller: AlertController)
               {}

  verificationForm = this.formBuilder.group({
    verifiedcode: ['', [Validators.required, Validators.pattern('^[0-9]{6}(?:-[0-9]{4})?$')]]
  });
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.order;
        this.user = this.router.getCurrentNavigation().extras.state.info;
        this.signin(this.user);

      }
    });
  }

  


 
 async sms_preference(){
    if(this.user.address.phone!=="" && this.user.address.phone!==null){
      const alert = await this.alertcontroller.create({
        cssClass: 'my-custom-class',
            header: 'Alert',
            subHeader: 'Verification',
            message: 'Code has been sent to '+this.user.address.phone,
            buttons: ['Ok']
      });
      await alert.present();
      document.getElementById("sms_code").style.display="block";
      document.getElementById("mail_link").style.display="none;"
    }else{
      const alert = await this.alertcontroller.create({
        cssClass: 'my-custom-class',
            header: 'Alert',
            subHeader: 'Verification',
            message: 'No phone number found, please verify by email. ',
            buttons: ['Ok']
      });
      await alert.present();
    }
    
    

  }
  async signin(
    user: User
  ): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
        user.email.trim(),
        user.password.trim()
      );
      await this.afs
        .doc(`user/${newUserCredential.user.uid}`)
        .set(user).then(async ()=>{this.storage.set("user",user);
        await newUserCredential.user.sendEmailVerification();
      }).catch(err=>{newUserCredential.user.delete();this.msg_networkfailure(); this.storage.remove("user");});
      return newUserCredential;
      
    } catch (error) {
       this.msg_networkfailure();
    }
  }

 async msg_networkfailure(){
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Verification',
      message: 'If your email address is correct please verify your network connection. ',
      buttons: ['Ok']
    }).then((alertview)=>{
       alertview.present();
       alertview.onDidDismiss().then(()=>{})
    }).catch(error=>{ throw error});
  }
  verification(){
    this.afAuth.authState.subscribe(user=>{
      if(user.emailVerified){
        const navigationExtras: NavigationExtras = {
          state: {
            order: this.data
          }
        };
        if (!isNullOrUndefined(this.data)) {
          this.router.navigate(['/place-order'], navigationExtras);
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
    
  }

  redirectTo(){
    if (this.data !== ''){
      const navigationExtras: NavigationExtras = {
        state: {
          product: this.data
        }
      };
      this.router.navigate(['/place-order'], navigationExtras);
    }else{
      this.state = false;
    }
  }

}
