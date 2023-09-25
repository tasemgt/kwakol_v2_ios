import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { LoginPinPageRoutingModule } from './login-pin-routing.module';

import { LoginPinPage } from './login-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPinPageRoutingModule
  ],
  declarations: [LoginPinPage]
})
export class LoginPinPageModule {}
