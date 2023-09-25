import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { BeneficiaryDetailsPageRoutingModule } from './beneficiary-details-routing.module';

import { BeneficiaryDetailsPage } from './beneficiary-details.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';
import { MatCardModule } from 'node_modules/@angular/material/card';
import { MatNativeDateModule } from 'node_modules/@angular/material/core';
import { MatDatepickerModule } from 'node_modules/@angular/material/datepicker';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeypadModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    BeneficiaryDetailsPageRoutingModule
  ],
  declarations: [
    BeneficiaryDetailsPage,
    CapitalizePipe
  ]
})
export class BeneficiaryDetailsPageModule {}
