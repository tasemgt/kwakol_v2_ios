import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorySummaryPage } from './history-summary.page';

const routes: Routes = [
  {
    path: '',
    component: HistorySummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorySummaryPageRoutingModule {}
