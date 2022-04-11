import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorySummaryPageRoutingModule } from './history-summary-routing.module';

import { HistorySummaryPage } from './history-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorySummaryPageRoutingModule
  ],
  declarations: [HistorySummaryPage]
})
export class HistorySummaryPageModule {}
