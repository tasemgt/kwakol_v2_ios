import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeypadComponent } from './keypad.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeypadComponent
  ],
  exports: [
    KeypadComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KeypadModule {}
