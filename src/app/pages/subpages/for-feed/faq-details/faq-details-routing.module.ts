import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaqDetailsPage } from './faq-details.page';

const routes: Routes = [
  {
    path: '',
    component: FaqDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqDetailsPageRoutingModule {}
