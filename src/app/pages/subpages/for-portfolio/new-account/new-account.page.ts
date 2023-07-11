import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { investmentIcons } from 'src/app/models/constants';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.page.html',
  styleUrls: ['./new-account.page.scss'],
})
export class NewAccountPage implements OnInit {

  public fromPage: string;
  public accounts;

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.accounts = state.accounts;
    }
  }

  ngOnInit() {
  }

  public addNewAccount(account){
    console.log(account);
    this.router.navigateByUrl('/add-new-account', {state: { url: this.router.url, account}});
  }

  // public getInvestmentIconFromName(accountName: string){
  //   return investmentIcons[accountName.toLowerCase()];
  // }
}
