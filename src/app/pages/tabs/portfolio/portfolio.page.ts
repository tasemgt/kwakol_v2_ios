import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { investmentIcons } from 'src/app/models/constants';
import { AuthService } from 'src/app/services/auth.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: 'portfolio.page.html',
  styleUrls: ['portfolio.page.scss']
})
export class PortfolioPage implements OnInit{

  public portfolio;
  public invAccounts;

  constructor(
    private router: Router,
    private portfolioService: PortfolioService,
    private auth: AuthService,
    private subService: SubscriptionService,
    public util: UtilService,
    public loading: LoadingController) {}

  ngOnInit(): void {
    this.auth.getAuthStateSubject().subscribe((state) =>{
      if(state){
        this.getPortfolio();
      }
    });
  }

  ionViewWillEnter(){
    this.getPortfolioQuiet();
  }
  
  private async getPortfolio(){
    try {
      const resp = await this.portfolioService.getPortfolio();
      if(resp.code === '100'){
        this.portfolio = resp.data.portfolio;
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async getInvestmentAccounts(){
    this.util.presentLoading('Please wait...');
    try {
      const resp = await this.subService.getInvestmentAccounts();
      this.loading.dismiss();
      if(resp.code === '100'){
        this.invAccounts = resp.data.subscriptions;
        this.router.navigateByUrl('/new-account', {state: {url:this.router.url, accounts: this.invAccounts}});
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
    }
  }

  public goToInvestmentDetails(sub){
    this.router.navigateByUrl('/investment-details', {state: {url:this.router.url, sub, subscriber: this.portfolio.subscriber}});
  }

  // public async getInvestementAccountsQuiet(){
  //   const resp = await this.subService.getInvestmentAccounts();
  //   if(resp.code === '100'){
  //     this.invAccounts = resp.data.subscriptions;
  //   }
  // }

  private async getPortfolioQuiet(){
    const resp = await this.portfolioService.getPortfolio();
    if(resp.code === '100'){
      this.portfolio = resp.data.portfolio;
    }
  }

  public goToNewAccount(){
    this.getInvestmentAccounts();
  }

  public addInvBalances(inv){
    let sum: Number, rounded: string;
    sum = Number(inv.balance) + Number(inv.profit_balance);
    rounded = sum.toFixed(2);
    return rounded;
  }

  public getIconForInvName(inv: string){
    return investmentIcons[inv.toLowerCase()];
  }

  public doRefresh(event): void{
    this.getPortfolioQuiet();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
