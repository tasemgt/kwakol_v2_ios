import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {

  private modal: HTMLIonModalElement;

  public fromPage: string;
  public amount: string;

  public selectedBank: any;
  public selectedInvestment: any;

  constructor(
    private router: Router,
    private util: UtilService,
    private modalCtrl: ModalController) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
    this.selectedBank = {name: 'Select Bank'};
    this.selectedInvestment = {name: 'Select Investment Account'};
  }

  public confirm(){
    this.util.presentAlertModal('depositConfirm');
  }

  public onTapSelect(type: string){
    this.presentModal(type);
  }

  async presentModal(type: string) {
    this.modal = await this.modalCtrl.create({
      component: BottomDrawerPage,
      breakpoints: [0, 0.2, 0.4],
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropBreakpoint: 0.2,
      backdropDismiss: true,
      swipeToClose: true,
      keyboardClose: true,
      cssClass: 'kwakol-modal-bottom-drawer',
      componentProps: { type }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    if(!data) return;
    if(data.data.type === 'bank'){
      this.selectedBank = data.data.data;
    }
    else if(data.data.type === 'investment'){
      this.selectedInvestment = data.data.data;
    }
  }
}
