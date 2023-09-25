import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '_node_modules/@ionic/angular';

import { CreateBeneficiaryPageRoutingModule } from './create-beneficiary-routing.module';

import { CreateBeneficiaryPage } from './create-beneficiary.page';
import { MatDatepickerModule } from '_node_modules/@angular/material/datepicker';
import { MatNativeDateModule } from '_node_modules/@angular/material/core';
import { MatCardModule } from '_node_modules/@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateBeneficiaryPageRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  declarations: [CreateBeneficiaryPage]
})
export class CreateBeneficiaryPageModule {}
