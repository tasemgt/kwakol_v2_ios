import { IonicModule } from 'node_modules/@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModuleModule } from 'src/app/shared-module.module';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';
import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    SharedModuleModule,
    KeypadModule,
    // QRCodeModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
