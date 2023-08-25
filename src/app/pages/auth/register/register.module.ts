import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { AutoTabDirective } from 'src/app/directives/autoTabDirective';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
