import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LockModalPage } from './lock-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LockModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LockModalPageRoutingModule {}
