import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '_node_modules/@ionic/angular';

import { AccountDetailsPageRoutingModule } from './account-details-routing.module';

import { AccountDetailsPage } from './account-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountDetailsPageRoutingModule
  ],
  declarations: [AccountDetailsPage]
})
export class AccountDetailsPageModule {}
