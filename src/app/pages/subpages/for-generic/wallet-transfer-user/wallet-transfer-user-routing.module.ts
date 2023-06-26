import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletTransferUserPage } from './wallet-transfer-user.page';

const routes: Routes = [
  {
    path: '',
    component: WalletTransferUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletTransferUserPageRoutingModule {}
