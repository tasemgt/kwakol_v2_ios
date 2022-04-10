import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.page.html',
  styleUrls: ['./add-new-account.page.scss'],
})
export class AddNewAccountPage implements OnInit {

  private modal: HTMLIonModalElement;

  public selectedBank: any;
  public selectedCurrency: any;
  public fromPage: string;
  public amount: string;

  constructor(
    private modalCtrl: ModalController,
    private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
    this.selectedBank = {name: 'Select Bank'};
    this.selectedCurrency = {name: '$ USD'};
  }

  public continue(){
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
    else if(data.data.type === 'currency'){
      this.selectedCurrency = data.data.data;
    }
  }

}
