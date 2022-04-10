import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewAccountPage } from './add-new-account.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewAccountPageRoutingModule {}
