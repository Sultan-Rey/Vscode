import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchqueryPageRoutingModule } from './searchquery-routing.module';

import { SearchqueryPage } from './searchquery.page';
import { SharedviewsModule } from '../sharedviews/sharedviews.module';

@NgModule({
  imports: [
    CommonModule,
    SharedviewsModule,
    FormsModule,
    IonicModule,
    SearchqueryPageRoutingModule
  ],
  declarations: [SearchqueryPage]
})
export class SearchqueryPageModule {}
