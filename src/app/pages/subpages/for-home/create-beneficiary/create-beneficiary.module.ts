import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateBeneficiaryPageRoutingModule } from './create-beneficiary-routing.module';

import { CreateBeneficiaryPage } from './create-beneficiary.page';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

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
