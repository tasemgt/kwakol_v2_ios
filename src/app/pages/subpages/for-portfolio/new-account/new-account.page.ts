import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { investmentIcons, investmentIconsBanner } from 'src/app/models/constants';
import { Beneficiary } from 'src/app/models/user';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.page.html',
  styleUrls: ['./new-account.page.scss'],
})
export class NewAccountPage implements OnInit {

  public fromPage: string;
  public accounts;

  public beneficiary: Beneficiary;

  constructor(private router: Router, public util: UtilService) {
    if(this.router.getCurrentNavigation().extras.state){
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.accounts = state.accounts;
      this.beneficiary = state.beneficiary;
    }
  }

  ngOnInit() {
  }

  public addNewAccount(account){
    this.router.navigateByUrl('/add-new-account', {state: { url: this.router.url, account,  beneficiary: this.beneficiary }});
  }

  public getInvestmentBannerFromName(accountName: string){
    return investmentIconsBanner[accountName.toLowerCase()];
  }
  // public getInvestmentIconFromName(accountName: string){
  //   return investmentIcons[accountName.toLowerCase()];
  // }
}
