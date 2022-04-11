import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffiliateLinkPage } from './affiliate-link.page';

const routes: Routes = [
  {
    path: '',
    component: AffiliateLinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliateLinkPageRoutingModule {}
