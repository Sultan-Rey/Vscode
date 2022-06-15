import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedviewsModule } from '../sharedviews/sharedviews.module';
import { IonicModule } from '@ionic/angular';

import { HistoricPageRoutingModule } from './historic-routing.module';

import { HistoricPage } from './historic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedviewsModule,
    HistoricPageRoutingModule
  ],
  declarations: [HistoricPage]
})
export class HistoricPageModule {}
