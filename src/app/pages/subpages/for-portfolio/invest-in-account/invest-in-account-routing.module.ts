import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestInAccountPage } from './invest-in-account.page';

const routes: Routes = [
  {
    path: '',
    component: InvestInAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestInAccountPageRoutingModule {}
