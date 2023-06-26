import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletTransferUserPageRoutingModule } from './wallet-transfer-user-routing.module';

import { WalletTransferUserPage } from './wallet-transfer-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletTransferUserPageRoutingModule
  ],
  declarations: [WalletTransferUserPage]
})
export class WalletTransferUserPageModule {}
