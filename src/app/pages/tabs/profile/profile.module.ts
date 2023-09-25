import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '_node_modules/@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';
import { AutoTabDirective } from 'src/app/directives/autoTabDirective';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    KeypadModule
  ],
  declarations: [
    ProfilePage,
    AutoTabDirective
  ]
})
export class ProfilePageModule {}
