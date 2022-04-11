import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedDetailsPage } from './feed-details.page';

const routes: Routes = [
  {
    path: '',
    component: FeedDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedDetailsPageRoutingModule {}
