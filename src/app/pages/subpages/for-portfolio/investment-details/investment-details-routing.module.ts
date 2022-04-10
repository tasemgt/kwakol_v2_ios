import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestmentDetailsPage } from './investment-details.page';

const routes: Routes = [
  {
    path: '',
    component: InvestmentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentDetailsPageRoutingModule {}
