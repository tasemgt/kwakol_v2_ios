import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBankPage } from './add-bank.page';

const routes: Routes = [
  {
    path: '',
    component: AddBankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBankPageRoutingModule {}
