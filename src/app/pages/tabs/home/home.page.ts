import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { historyIcons, investmentBGColors, investmentIcons } from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{

  @ViewChild('InfoModalDiv') infoModalDiv: ElementRef;

  public balanceIcon: string;
  public showBalance: boolean;

  public user: User;
  public home: any;
  public homeHistories: any[];
  public homeBalance: string;

  public toastShown = false;

  public childPage;

  public activeSegment: string;

  public percent = 75;


  public showInfoModal: boolean;
  public infoModalData: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: AuthService,
    public util: UtilService,
    public uiService: UiService,
    private loading: LoadingController,
    private renderer: Renderer2,
    private subService: SubscriptionService,
    private homeService: HomeService) {}

  ngOnInit(): void {

    this.activeSegment = 'wallet';
    this.showInfoModal = false;
    this.infoModalData = {};

    this.auth.getAuthStateSubject().subscribe(async (state) =>{
      if(state){
        this.getUser();
        this.getHome();
      }
      const top = await this.loading.getTop();
      if(top){
        this.loading.dismiss();
        this.goToPage(this.childPage);
      }
    });
    this.subService.getBalanceSubject().subscribe((state) =>{
      if(state){
        this.getHome();
      }
    });
  }

  ionViewWillEnter(){
    this.getHomeQuietly();
    this.getTimeOfDay();

    this.balanceIcon = 'eye-open';
    this.showBalance = false;
  }

  public async getUser() {
    this.user = this.dataService.getData(2);
  }

  public getIconForType(type: string){
    return historyIcons[type];
  }


  public getIconForInvName(inv: string){
    return investmentIcons[inv.toLowerCase()];
  }

  public getColorForInvName(inv: string){
    return investmentBGColors[inv.toLowerCase()];
  }

  public segmentChanged(event){
    console.log(event.target.value);
    this.activeSegment = event.target.value;
  }

  public async getHome(){
    try {
      const resp = await this.homeService.getHome();
      if(resp.code === '100'){
        this.home = resp.data.home;
        this.homeHistories = this.home.user_details.transactions;
        this.homeBalance = this.util.numberWithCommas(resp.data.home.total_fund);
        // const top = await this.loading.getTop();
        // if(top){ 
        //   this.loading.dismiss();
        //   this.goToPage(this.childPage);
        // }
        console.log(this.home);
      }
    } catch (error) {
      console.log(error);
      if(error.status === 0){
       !this.toastShown ? this.util.showToast('Please check your network connection', 4000, 'danger') : '';
        this.toastShown = true;
        setTimeout(() => this.getHome(), 10000);
      }
    }
  }

  public goToPage(page: string){
    this.childPage = page;
    if(!this.home){
      // this.util.presentLoading('Please wait...');
      return;
    }
    const subscriber = this.home.user_details.subscriber;
    this.router.navigateByUrl(page, {state: {url: this.router.url, subscriber}});
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

  public goToHistorySummary(hist){
    console.log(hist);
    if(hist.type === 'profit'){
      this.router.navigateByUrl('/history-summary', {state:{url: this.router.url, hist}});
      return;
    }
  }

  public goToInvestmentDeets(sub){
    this.router.navigateByUrl('/investment-details', {state : {url: this.router.url, sub}});
  }

  public doRefresh(event): void{
    this.getHomeQuietly();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public hideShowBalance() {
    console.log('Clicked........');
    this.balanceIcon = this.balanceIcon === 'eye-open' ? 'eye-close' : 'eye-open';
    this.showBalance = !this.showBalance;
  }

  public openInfoModal(type, data){
    switch(type){
      case 'deposit':
        this.infoModalData.icon = 'trans-deposit.svg';
        this.infoModalData.title = 'Deposit';
        this.infoModalData.content = [
          { item: 'Account Name', value: 'Akim John'}
        ];
        this.infoModalData.amount = '560';
        this.infoModalData.date = '16 Feb 2023 - 9:03am';
    }

    setTimeout(() => {
      this.uiService.getAuthStateSubject().next(true);
      this.showInfoModal = true;
    }, 200);
  }

  public closeInfoModal(){
    const infoModalDiv = this.infoModalDiv.nativeElement;
    this.renderer.removeClass(infoModalDiv, 'animate__slideInUp');
    this.renderer.addClass(infoModalDiv, 'animate__slideOutDown');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showInfoModal = false), 100);
  }

  private async getHomeQuietly(){
    const resp = await this.homeService.getHome();
      if(resp.code === '100'){
        this.home = resp.data.home;
        this.homeHistories = this.home.user_details.transactions;
        this.homeBalance = this.util.numberWithCommas(this.home.total_fund);
      }
  }

  private async getInvestmentAccounts(){
    this.util.presentLoading('Please wait...');
    try {
      const resp = await this.subService.getInvestmentAccounts();
      this.loading.dismiss();
      if(resp.code === '100'){
        const invAccounts = resp.data.subscriptions;
        this.router.navigateByUrl('/new-account', {state: {url:this.router.url, accounts: invAccounts}});
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
    }
  }

  public getTimeOfDay(){
    return this.util.greetMessage();
  }
}
