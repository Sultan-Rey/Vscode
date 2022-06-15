import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { SharedviewsModule } from '../sharedviews/sharedviews.module';
import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedviewsModule,
    AccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
