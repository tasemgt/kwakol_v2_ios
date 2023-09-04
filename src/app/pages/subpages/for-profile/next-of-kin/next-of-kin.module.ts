import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NextOfKinPageRoutingModule } from './next-of-kin-routing.module';

import { NextOfKinPage } from './next-of-kin.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NextOfKinPageRoutingModule,
    KeypadModule
  ],
  declarations: [NextOfKinPage]
})
export class NextOfKinPageModule {}
