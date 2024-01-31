import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryPage } from './history.page';
import { HistoryPageRoutingModule } from './history-routing.module';
import { SharedModuleModule } from 'src/app/shared-module.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HistoryPage }]),
    HistoryPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [
    HistoryPage
  ]
})
export class HistoryPageModule {}
