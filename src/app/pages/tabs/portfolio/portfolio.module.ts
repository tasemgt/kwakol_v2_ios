import { IonicModule } from '_node_modules/@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioPage } from './portfolio.page';
import { PortfolioPageRoutingModule } from './portfolio-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PortfolioPageRoutingModule
  ],
  declarations: [PortfolioPage]
})
export class PortfolioPageModule {}
