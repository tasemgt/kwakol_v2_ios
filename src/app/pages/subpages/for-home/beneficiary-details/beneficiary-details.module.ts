import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiaryDetailsPageRoutingModule } from './beneficiary-details-routing.module';

import { BeneficiaryDetailsPage } from './beneficiary-details.page';
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
    KeypadModule,
    SharedModuleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    BeneficiaryDetailsPageRoutingModule
  ],
  declarations: [
    BeneficiaryDetailsPage,
  ]
})
export class BeneficiaryDetailsPageModule {}
