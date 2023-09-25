import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { InvestInAccountPageRoutingModule } from './invest-in-account-routing.module';

import { InvestInAccountPage } from './invest-in-account.page';
import { SharedModuleModule } from 'src/app/shared-module.module';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestInAccountPageRoutingModule,
    SharedModuleModule,
    KeypadModule
  ],
  declarations: [InvestInAccountPage]
})
export class InvestInAccountPageModule {}
