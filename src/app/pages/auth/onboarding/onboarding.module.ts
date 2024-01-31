import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { OnboardingPageRoutingModule } from './onboarding-routing.module';

import { OnboardingPage } from './onboarding.page';
import { LoginPinPageModule } from '../login-pin/login-pin.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnboardingPageRoutingModule,
    LoginPinPageModule
  ],
  declarations: [OnboardingPage]
})
export class OnboardingPageModule {}
