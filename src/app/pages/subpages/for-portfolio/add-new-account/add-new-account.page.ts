import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Beneficiary } from 'src/app/models/user';
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
  public account;
  public fromPage: string;
  public balance: string;

  public beneficiary: Beneficiary;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    public util: UtilService,
    private loading: LoadingController,
    private subService: SubscriptionService,
    private dataService: DataService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.account = state.account;
      this.beneficiary = state.beneficiary;
      this.balance = state.balance;
    }
  }

  ngOnInit() {
    console.log(this.account);
  }

  public goToInvestInAccount() {
    console.log(this.account);
    this.router.navigateByUrl('/invest-in-account', {
      state: {
        url: this.router.url,
        account: this.account,
        beneficiary: this.beneficiary,
        balance: this.balance,
      },
    });
  }

  // public async continue(){
  //   if(!this.selectedCurrency.selected) return this.util.showToast('Please select a currency', 2000, 'danger');
  //   if(!this.amount) return this.util.showToast('Please input deposit amount', 2000, 'danger');
  //   if(!this.selectedBank.selected) return this.util.showToast('Please select a bank', 2000, 'danger');
  //   if(!this.receipt) return this.util.showToast('Please attach a proof receipt', 2000, 'danger');

  //   const formData = new FormData();

  //   const amount = this.amount.replace(/,/g, "");

  //   formData.append('currency_id', this.selectedCurrency.id); formData.append('bank_id', this.selectedBank.id);
  //   formData.append('amount', amount); formData.append('proof_of_payment', this.receipt);
  //   formData.append('subscription_id', this.account.id);
  //   console.log(Array.from(formData.entries()));

  //   try {
  //     this.util.presentLoading();
  //     const resp = await this.subService.doNewSubscription(formData);
  //     console.log(resp);
  //     if(resp.code === '100'){
  //       this.loading.dismiss();
  //       this.subService.getBalanceSubject().next(true);
  //       this.util.showToast('Account created successfully', 3000, 'success');
  //       this.navCtrl.setDirection('back');
  //       this.router.navigateByUrl(this.fromPage);
  //       // this.util.presentAlertModal('depositConfirm');
  //     }
  //   } catch (error) {
  //     this.loading.dismiss();
  //     console.log(error);
  //     error.status === 0 ? this.util.showToast('Please check your network connection...', 3000, 'danger') : '';
  //   }

  // }
}
