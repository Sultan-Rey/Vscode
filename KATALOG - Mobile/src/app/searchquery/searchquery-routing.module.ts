import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchqueryPage } from './searchquery.page';

const routes: Routes = [
  {
    path: '',
    component: SearchqueryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchqueryPageRoutingModule {}
