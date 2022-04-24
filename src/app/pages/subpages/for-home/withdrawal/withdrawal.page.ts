import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';
import { DataService } from 'src/app/services/data.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.page.html',
  styleUrls: ['./withdrawal.page.scss'],
})
export class WithdrawalPage implements OnInit {

  private modal: HTMLIonModalElement;

  public subscriber;

  public fromPage:string;
  public amount: string;

  public selectedInvestment: any;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private subService: SubscriptionService,
    private dataService: DataService,
    private util: UtilService,
    private loading: LoadingController) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.subscriber = this.router.getCurrentNavigation().extras.state.subscriber;
    }
  }

  ngOnInit() {
    this.dataService.clearCBI(); //Clears all stored currency, bank, and investment info
    this.selectedInvestment = this.dataService.getInvestment() || {name: 'Select Investment Account'};
  }

  public async requestWithdrawal(){
    if(!this.amount) return this.util.showToast('Please input withdrawal amount', 2000, 'danger');
    if(!this.selectedInvestment.selected) return this.util.showToast('Please select investment account', 2000, 'danger');

    const payload = {
      subscription_id : this.selectedInvestment.id,
      amount: this.amount.replace(/,/g, ""),
    }
    console.log(payload);
    this.util.presentAlertConfirm('Confirm withdrawal', `Are you sure you want to withdraw $${this.amount} from ${this.selectedInvestment.name}?`, async() =>{
      this.util.presentLoading();
      try {
        const resp = await this.subService.doWithdraw(payload);
        this.loading.dismiss();
        if(resp.code === '100'){
          this.subService.getBalanceSubject().next(true);
          this.util.presentAlertModal('withdrawConfirm');
        }
      } catch (error) {
        console.log(error);
        this.loading.dismiss();
        this.util.showToast(error.error.errors.amount[0], 3000, 'danger');
      }
    }, 'Cancel', 'I\'m Sure');
  }

  public onTapSelect(type: string){
    this.presentModal(type);
  }

  async presentModal(type: string) {
    const formSelects = {
      investments: this.subscriber.subscription
    }
    this.modal = await this.modalCtrl.create({
      component: BottomDrawerPage,
      breakpoints: [0, 0.2, 0.4, 0.7, 0.9],
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropBreakpoint: 0.2,
      backdropDismiss: true,
      swipeToClose: true,
      keyboardClose: true,
      cssClass: 'kwakol-modal-bottom-drawer',
      componentProps: { type, formSelects}
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    console.log(data);
    if(!data) return;
    else if(data.data.type === 'investment'){
      this.selectedInvestment = data.data.data;
    }
  }

  public refreshModel(): void{
    if(this.amount){
      this.amount = this.util.numberWithCommas(this.amount);
    }
  }

}
