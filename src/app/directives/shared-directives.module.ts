import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
import { AutoTabDirective } from './autoTabDirective';

@NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//   ],
  declarations: [
    AutoTabDirective
  ],
  exports: [
    AutoTabDirective
  ]
})
export class SharedDirectivesModule {}