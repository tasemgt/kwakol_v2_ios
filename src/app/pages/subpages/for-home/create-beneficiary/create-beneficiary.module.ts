import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateBeneficiaryPageRoutingModule } from './create-beneficiary-routing.module';

import { CreateBeneficiaryPage } from './create-beneficiary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateBeneficiaryPageRoutingModule
  ],
  declarations: [CreateBeneficiaryPage]
})
export class CreateBeneficiaryPageModule {}
