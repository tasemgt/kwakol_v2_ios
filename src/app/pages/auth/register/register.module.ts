import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from 'node_modules/@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { AutoTabDirective } from 'src/app/directives/autoTabDirective';
import { MatNativeDateModule } from 'node_modules/@angular/material/core';
import { MatDatepickerModule } from 'node_modules/@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // MatCardModule
  ],
  declarations: [
    RegisterPage,
    AutoTabDirective
  ]
})
export class RegisterPageModule {}
