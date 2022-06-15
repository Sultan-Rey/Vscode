import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss'],
})
export class PageFooterComponent implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  routeTo(route:string){
    if(route!=='home'){
      this.navCtrl.navigateForward('/'+route);
    }else{
      this.navCtrl.navigateBack('/'+route);
    }
    
  }

}
