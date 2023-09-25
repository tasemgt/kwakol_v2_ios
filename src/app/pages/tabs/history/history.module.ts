import { IonicModule } from 'node_modules/@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryPage } from './history.page';
import { HistoryPageRoutingModule } from './history-routing.module';
import { SharedModuleModule } from 'src/app/shared-module.module';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';

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
    HistoryPage,
    CapitalizePipe
  ]
})
export class HistoryPageModule {}
