import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewAccountPageRoutingModule } from './add-new-account-routing.module';

import { AddNewAccountPage } from './add-new-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewAccountPageRoutingModule
  ],
  declarations: [AddNewAccountPage]
})
export class AddNewAccountPageModule {}
