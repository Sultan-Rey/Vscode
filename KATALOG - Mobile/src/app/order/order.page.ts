import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order';
import { User } from 'src/models/user';
import { isNullOrUndefined } from 'util';
import { FirestoreDataService } from '../firestore-data.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  data: string;
  orders$: Observable<DocumentData[]>;
  user: User;
  userType: string='';
  connected: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private afAuth: AngularFireAuth, 
    private fdservice: FirestoreDataService, private storage: Storage) { 
      this.afAuth.authState.subscribe(auth => {
        if (!auth.emailVerified) {
          this.connected = false;
        } else {
          this.getallOrder();
        }
      });
      
  
        
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.refundstatus;
             }
    });

  }

  getallOrder(){
    this.afAuth.currentUser.then((user)=>{
      if(user.emailVerified){
        //this.orders$ = this.fdservice.getOrder(user.uid.toString());
        // Delete or comment the code below after initiate your Firebase DB
        this.orders$ = this.fdservice.getOrder("4kdhuCpzzsY2fzFy754h24QHR4t2");
      }
    })
    
  }

  getDate(date:any){
    let dating: Date= new Date(date.seconds*1000 + date.nanoseconds);
      return dating.toDateString() ;
    }

    details(order:Order){
      const navigationExtras:NavigationExtras = {
        state:{ order: order, type: this.userType}
      }
      this.router.navigate(['/order-details'], navigationExtras);
    }
  
}
