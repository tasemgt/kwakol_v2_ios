import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiaryDetailsPage } from './beneficiary-details.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiaryDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiaryDetailsPageRoutingModule {}
