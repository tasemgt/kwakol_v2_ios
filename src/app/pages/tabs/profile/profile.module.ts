import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';
import { AutoTabDirective } from 'src/app/directives/autoTabDirective';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    KeypadModule,
    SharedDirectivesModule,
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
