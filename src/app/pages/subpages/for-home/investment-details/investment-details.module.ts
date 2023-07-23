import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestmentDetailsPageRoutingModule } from './investment-details-routing.module';

import { InvestmentDetailsPage } from './investment-details.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestmentDetailsPageRoutingModule,
    KeypadModule
  ],
  declarations: [InvestmentDetailsPage]
})
export class InvestmentDetailsPageModule {}
