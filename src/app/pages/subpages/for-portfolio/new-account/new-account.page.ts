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
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.accounts = this.router.getCurrentNavigation().extras.state.accounts;
    }
  }

  ngOnInit() {
  }

  public addNewAccount(account){
    this.router.navigateByUrl('/add-new-account', {state: { url: this.router.url, account}});
  }

  public getInvestmentIconFromName(accountName: string){
    return investmentIcons[accountName.toLowerCase()];
  }
}
