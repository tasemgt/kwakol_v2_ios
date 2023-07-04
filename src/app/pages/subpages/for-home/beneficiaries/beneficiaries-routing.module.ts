import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiariesPage } from './beneficiaries.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiariesPageRoutingModule {}
