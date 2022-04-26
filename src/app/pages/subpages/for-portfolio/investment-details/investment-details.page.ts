import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { historyIcons } from 'src/app/models/constants';
import { HistoryService } from 'src/app/services/history.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.page.html',
  styleUrls: ['./investment-details.page.scss'],
})
export class InvestmentDetailsPage implements OnInit {

  public fromPage: string;
  public sub;
  public subscriber;

  public selectedTab;
  public prevTab;

  public histories: any[];

  public tabs = [
    {name: 'History', active: true},
    {name: 'Statistics', active: false},
    {name: 'About', active: false}
  ]

  constructor(
    private router: Router,
    public util: UtilService,
    public historyService: HistoryService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.sub = this.router.getCurrentNavigation().extras.state.sub;
      this.subscriber = this.router.getCurrentNavigation().extras.state.subscriber;
    }
  }

  ngOnInit() {
    console.log('>>>>> ', this.subscriber);
    this.selectedTab = this.tabs[0];
    this.prevTab = this.tabs[0];

    this.getSubHistories(this.sub.subscription_id);
  }

  public switchTab(tab: any){
    this.prevTab.active = false;
    tab.active = true;
    this.selectedTab = tab;
    // console.log(tab);
    this.prevTab = tab;
  }

  public async getSubHistories(subId){
    try {
      const resp = await this.historyService.getSubscriptionHistories(subId);
      if(resp.code === '100'){
        this.histories = resp.data.history.data;
        // console.log(this.histories);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public goToPage(page:string){
    const subscriber = this.subscriber;
    this.router.navigateByUrl(page, {state: {url: this.router.url, subscriber}});
  }

  public getIconForType(type: string){
    return historyIcons[type];
  }

  public addInvBalances(inv){
    return Number(inv.balance) + Number(inv.profit_balance);
  }
}
