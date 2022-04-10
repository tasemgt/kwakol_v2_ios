import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.page.html',
  styleUrls: ['./withdrawal.page.scss'],
})
export class WithdrawalPage implements OnInit {

  private modal: HTMLIonModalElement;

  public fromPage:string;
  public amount: string;

  public selectedInvestment: any;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private util: UtilService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
    this.selectedInvestment = {name: 'Select Investment Account'};
  }

  public requestWithdrawal(){
    this.util.presentAlertModal('withdrawConfirm');
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
    console.log(data);
    if(!data) return;
    else if(data.data.type === 'investment'){
      this.selectedInvestment = data.data.data;
    }
  }

}
