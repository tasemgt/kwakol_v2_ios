import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { InvestmentDetailsPageRoutingModule } from './investment-details-routing.module';

import { InvestmentDetailsPage } from './investment-details.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModuleModule } from 'src/app/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestmentDetailsPageRoutingModule,
    KeypadModule,
    SharedModuleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    SharedModuleModule
  ],
  declarations: [
    InvestmentDetailsPage,
  ]
})
export class InvestmentDetailsPageModule {}
