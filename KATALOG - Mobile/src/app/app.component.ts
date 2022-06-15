import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#031432');
      this.splashScreen.hide();

    });
  }

  
  navigateTo(category: string){
    const navigationExtras: NavigationExtras = {
      state: {
        product: category
      }
    };
    this.router.navigate(['/historic'], navigationExtras);
  }

  
}
