import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { AddNewAccountPageRoutingModule } from './add-new-account-routing.module';

import { AddNewAccountPage } from './add-new-account.page';
import { SharedModuleModule } from 'src/app/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewAccountPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [AddNewAccountPage]
})
export class AddNewAccountPageModule {}
