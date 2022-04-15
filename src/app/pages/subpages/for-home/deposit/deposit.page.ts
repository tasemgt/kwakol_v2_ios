import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';
import { DataService } from 'src/app/services/data.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';


// declare global {
//   interface FormData {
//     entries(): Iterator<[USVString, USVString | Blob]>;
//   }
// }

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit, OnDestroy{

  private modal: HTMLIonModalElement;

  public toastShown = false;

  public subscriber;

  public fromPage: string;
  public amount: string;
  public depositData;

  public selectedBank: any;
  public selectedInvestment: any;
  public selectedCurrency: any;

  public fileName = 'No file chosen';
  private receipt: File;
  

  constructor(
    private router: Router,
    private util: UtilService,
    private loading: LoadingController,
    private dataService: DataService,
    private subService: SubscriptionService,
    private modalCtrl: ModalController) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.subscriber = this.router.getCurrentNavigation().extras.state.subscriber;
    }
  }

  ngOnInit() {
    console.log(this.subscriber);
    this.getDepoitPageData();
    this.selectedBank = this.dataService.getBank() || {bankName: 'Select Bank'};
    this.selectedInvestment = this.dataService.getInvestment() || {name: 'Select Investment Account'};
    this.selectedCurrency = this.dataService.getCurrency() || {name: 'CUR'};
  }

  public async confirm(){
    if(!this.selectedCurrency.selected) return this.util.showToast('Please select a currency', 2000, 'danger');
    if(!this.amount) return this.util.showToast('Please input deposit amount', 2000, 'danger');
    if(!this.selectedInvestment.selected) return this.util.showToast('Please select investment account', 2000, 'danger');
    if(!this.selectedBank.selected) return this.util.showToast('Please select a bank', 2000, 'danger');
    if(!this.receipt) return this.util.showToast('Please attach a proof receipt', 2000, 'danger');

    const formData = new FormData();

    formData.append('currency_id', this.selectedCurrency.id); formData.append('bank_id', this.selectedBank.id);
    formData.append('subscription_id', this.selectedInvestment.id); formData.append('amount', this.amount);
    formData.append('proof_of_payment', this.receipt);
    console.log(Array.from(formData.entries()));
    try {
      this.util.presentLoading();
      const resp = await this.subService.doDeposit(formData);
      console.log(resp);
      if(resp.code === '100'){
        this.loading.dismiss();
        this.subService.getBalanceSubject().next(true);
        this.util.presentAlertModal('depositConfirm');
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
      error.status === 0 ? this.util.showToast('Please check your network connection...', 3000, 'danger') : '';
    }
  }

  // public confirm(){
  //   const payload = this.createFormData();
  //   if(!payload) return;
  //   this.util.presentAlertModal('depositConfirm');
  // }

  public onTapSelect(type: string){
    if(type === 'bank' && !this.selectedCurrency.selected){
      this.util.showToast('Please select a currency first.', 2000, 'danger');
      return;
    }
    this.presentModal(type);
  }

  public onFileChange(fileChangeEvent){
    this.receipt = fileChangeEvent.target.files[0];
    this.fileName = this.receipt.name.slice(0,35);
    console.log(this.receipt);
  }

  private async presentModal(type: string) {
    const formSelects = {
      investments: this.subscriber.subscription,
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
    else if(data.data.type === 'investment'){
      this.selectedInvestment = data.data.data;
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

  ngOnDestroy(): void {
    // this.dataService.
  }
}
