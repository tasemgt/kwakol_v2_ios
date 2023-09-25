import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { BeneficiariesPageRoutingModule } from './beneficiaries-routing.module';

import { BeneficiariesPage } from './beneficiaries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiariesPageRoutingModule
  ],
  declarations: [BeneficiariesPage]
})
export class BeneficiariesPageModule {}
