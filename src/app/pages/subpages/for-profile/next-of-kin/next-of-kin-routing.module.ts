import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NextOfKinPage } from './next-of-kin.page';

const routes: Routes = [
  {
    path: '',
    component: NextOfKinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NextOfKinPageRoutingModule {}
