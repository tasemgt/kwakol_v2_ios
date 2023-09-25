import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { AffiliateLinkPageRoutingModule } from './affiliate-link-routing.module';

import { AffiliateLinkPage } from './affiliate-link.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AffiliateLinkPageRoutingModule
  ],
  declarations: [AffiliateLinkPage]
})
export class AffiliateLinkPageModule {}
