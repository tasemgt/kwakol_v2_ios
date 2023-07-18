import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateBeneficiaryPage } from './create-beneficiary.page';

const routes: Routes = [
  {
    path: '',
    component: CreateBeneficiaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateBeneficiaryPageRoutingModule {}
