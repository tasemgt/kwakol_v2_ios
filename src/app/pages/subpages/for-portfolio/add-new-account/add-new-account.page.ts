import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Beneficiary } from 'src/app/models/user';
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
}
