import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ProductPage } from './product.page';
import { SharedviewsModule } from 'src/app/sharedviews/sharedviews.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedviewsModule,
    ProductPageRoutingModule,
    NgxIonicImageViewerModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
