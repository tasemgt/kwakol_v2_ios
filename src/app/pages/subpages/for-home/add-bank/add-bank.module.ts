import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBankPageRoutingModule } from './add-bank-routing.module';

import { AddBankPage } from './add-bank.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBankPageRoutingModule,
    KeypadModule
  ],
  declarations: [AddBankPage]
})
export class AddBankPageModule {}
