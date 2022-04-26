import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestmentDetailsPageRoutingModule } from './investment-details-routing.module';
import { InvestmentDetailsPage } from './investment-details.page';
import { SharedModuleModule } from 'src/app/shared-module.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestmentDetailsPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [InvestmentDetailsPage]
})
export class InvestmentDetailsPageModule {}
