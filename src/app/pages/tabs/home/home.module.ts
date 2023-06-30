import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModuleModule } from 'src/app/shared-module.module';
import { KeypadModule } from 'src/app/components/keypad/keypad.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    SharedModuleModule,
    KeypadModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
