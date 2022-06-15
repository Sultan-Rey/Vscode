import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PageFooterComponent } from '../page-footer/page-footer.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PageFooterComponent,PageHeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [PageFooterComponent, PageHeaderComponent]
})
export class SharedviewsModule { }
