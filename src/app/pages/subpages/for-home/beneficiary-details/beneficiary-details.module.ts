import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiaryDetailsPageRoutingModule } from './beneficiary-details-routing.module';

import { BeneficiaryDetailsPage } from './beneficiary-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiaryDetailsPageRoutingModule
  ],
  declarations: [BeneficiaryDetailsPage]
})
export class BeneficiaryDetailsPageModule {}
