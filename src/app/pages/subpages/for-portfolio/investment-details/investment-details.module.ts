import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestmentDetailsPageRoutingModule } from './investment-details-routing.module';

import { InvestmentDetailsPage } from './investment-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestmentDetailsPageRoutingModule
  ],
  declarations: [InvestmentDetailsPage]
})
export class InvestmentDetailsPageModule {}
