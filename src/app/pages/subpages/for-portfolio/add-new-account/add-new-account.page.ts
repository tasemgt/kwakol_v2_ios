import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';
import { DataService } from 'src/app/services/data.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.page.html',
  styleUrls: ['./add-new-account.page.scss'],
})
export class AddNewAccountPage implements OnInit {

  private modal: HTMLIonModalElement;
  public toastShown = false;

  public account;

  public amount: string;
  public depositData;

  public selectedBank: any;
  public selectedInvestment: any;
  public selectedCurrency: any;

  public fileName = 'No file chosen';
  private receipt: File;

  public fromPage: string;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private util: UtilService,
    private loading: LoadingController,
    private subService: SubscriptionService,
    private dataService: DataService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.account = this.router.getCurrentNavigation().extras.state.account;
    }
  }

  ngOnInit() {
    this.getDepoitPageData();
    this.selectedBank = this.dataService.getBank() || {bankName: 'Select Bank'};
    this.selectedCurrency = this.dataService.getCurrency() || {name: 'CUR'};
  }

  public continue(){
  }

  public onTapSelect(type: string){
    if(type === 'bank' && !this.selectedCurrency.selected){
      this.util.showToast('Please select a currency first.', 2000, 'danger');
      return;
    }
    this.presentModal(type);
  }

  async presentModal(type: string) {
    const formSelects = {
      currencies: this.depositData.deposit
    }
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
      componentProps: { type, formSelects }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    if(!data) return;
    if(data.data.type === 'bank'){
      this.selectedBank = data.data.data;
    }
    else if(data.data.type === 'currency'){
      this.selectedBank = {bankName: 'Select Bank'};
      this.selectedCurrency = data.data.data;
    }
  }

  private async getDepoitPageData(){
    !this.toastShown ? this.util.presentLoading2('Preparing...'): '';
    try {
      const resp = await this.subService.getDepositData();
      this.loading.dismiss();
      resp.code === '100' ? this.depositData = resp.data : console.log(resp);
    } catch (error) {
      console.log(error);
      if(error.status === 0){
       !this.toastShown ? this.util.showToast('Please check your network connection', 4000, 'danger') : '';
        this.toastShown = true;
        setTimeout(() => this.getDepoitPageData(), 5000);
      }
    }
  }

}
