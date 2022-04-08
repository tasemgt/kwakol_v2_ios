import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertModalPageRoutingModule } from './alert-modal-routing.module';

import { AlertModalPage } from './alert-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertModalPageRoutingModule
  ],
  declarations: [AlertModalPage]
})
export class AlertModalPageModule {}
