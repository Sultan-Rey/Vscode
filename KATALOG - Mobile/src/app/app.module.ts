import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { HttpClientModule} from '@angular/common/http';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { SharedviewsModule } from './sharedviews/sharedviews.module';



export const firebaseConfig = {
  apiKey: 'AIzaSyBabPrVBAjGXeNQk0NlqTlpMFUcFgNuKiw',
  authDomain: 'datafire-681e8.firebaseapp.com',
  databaseURL: 'https://datafire-681e8.firebaseio.com',
  projectId: 'datafire-681e8',
  storageBucket: 'datafire-681e8.appspot.com',
  messagingSenderId: '182727338924'
};


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    FormsModule,
    NgxIonicImageViewerModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedviewsModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
   
  ],
  providers: [
    ImagePicker,
    StatusBar,
    Camera,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
