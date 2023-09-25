import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '_node_modules/@ionic/angular';

import { FeedDetailsPageRoutingModule } from './feed-details-routing.module';

import { FeedDetailsPage } from './feed-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedDetailsPageRoutingModule
  ],
  declarations: [FeedDetailsPage]
})
export class FeedDetailsPageModule {}
