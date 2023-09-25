import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { CreateBeneficiaryPageRoutingModule } from './create-beneficiary-routing.module';

import { CreateBeneficiaryPage } from './create-beneficiary.page';
import { MatDatepickerModule } from 'node_modules/@angular/material/datepicker';
import { MatNativeDateModule } from 'node_modules/@angular/material/core';
import { MatCardModule } from 'node_modules/@angular/material/card';

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
