import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '_node_modules/@ionic/angular';

import { LockModalPageRoutingModule } from './lock-modal-routing.module';

import { LockModalPage } from './lock-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LockModalPageRoutingModule
  ],
  declarations: [LockModalPage]
})
export class LockModalPageModule {}
