import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KycPageRoutingModule } from './kyc-routing.module';

import { KycPage } from './kyc.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';
import { AutoTabDirective } from 'src/app/directives/autoTabDirective';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KycPageRoutingModule,
    KeypadModule
  ],
  declarations: [
    KycPage,
    AutoTabDirective
  ]
})
export class KycPageModule {}
