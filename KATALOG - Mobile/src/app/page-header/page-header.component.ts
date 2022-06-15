import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage} from '@ionic/storage';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {

  location: string;
  query='';
  logUid = 'Login';
  constructor(private router: Router, private navCtrl: NavController, private storage: Storage) { 
    this.location = this.router.url;
    this.getUid();
  }

  ngOnInit() {}

  routeTo(route:string){
    //console.log('mi casa'+route)
      this.navCtrl.navigateForward(route);
  }

  logOrNot(){
    if(this.logUid!=='Login'){
      this.navCtrl.navigateForward('/account');
    }else{
      this.navCtrl.navigateForward('/login');
    }
    
  }

  getUid(){
    this.storage.get("user").then((uid:string)=>{
      if(uid !== '' && uid!==null){
        this.logUid = 'Hi, dear !';
      }
    });
  }

  search(event){
    if(this.query!=='' && this.query!==null){
      if(event.key=='Enter' || event.type == 'click'){
        const navigationExtras: NavigationExtras = {
          state: {
            query: this.query
          }
        };
       
        this.router.navigate(['/searchquery'], navigationExtras);
      }
    }
   
  }

}
