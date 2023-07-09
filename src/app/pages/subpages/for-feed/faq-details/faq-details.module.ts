import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqDetailsPageRoutingModule } from './faq-details-routing.module';

import { FaqDetailsPage } from './faq-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqDetailsPageRoutingModule
  ],
  declarations: [FaqDetailsPage]
})
export class FaqDetailsPageModule {}
