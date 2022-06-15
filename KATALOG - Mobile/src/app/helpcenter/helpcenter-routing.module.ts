import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpcenterPage } from './helpcenter.page';

const routes: Routes = [
  {
    path: '',
    component: HelpcenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpcenterPageRoutingModule {}
