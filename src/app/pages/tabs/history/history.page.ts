import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { historyIcons } from 'src/app/models/constants';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HistoryService } from 'src/app/services/history.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';
import { BottomDrawerPage } from '../../modals/bottom-drawer/bottom-drawer.page';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
})
export class HistoryPage implements OnInit {
  public prevFilter;
  public selectedFilter;
  public histories;

  // public invHists = [];
  // public walletHists = [];

  public investmentHistories = [];
  public walletHistories = [];

  public listSpinner: boolean;

  public _filters = [
    { name: 'Show All', icon: 'all', class: 'all', size: '4', selected: true },
    {
      name: 'Profit',
      icon: 'profit2',
      class: 'profit',
      size: '3',
      selected: false,
    },
    {
      name: 'Pending',
      icon: 'pending',
      class: 'pending',
      size: '4',
      selected: false,
    },
    {
      name: 'Bonus',
      icon: 'bonus2',
      class: 'bonus',
      size: '3',
      selected: false,
    },
    {
      name: 'Withdrawal',
      icon: 'withdrawal2',
      class: 'withdrawal',
      size: '4',
      selected: false,
    },
    {
      name: 'Deposit',
      icon: 'deposit2',
      class: 'deposit',
      size: '4',
      selected: false,
    },
  ];

  public filters = [];

  //Segment states
  public childPage;
  public activeSegment: string;

  private modal: HTMLIonModalElement;
  constructor(
    public util: UtilService,
    private uiService: UiService,
    private modalCtrl: ModalController,
    private router: Router,
    private auth: AuthService,
    private subService: SubscriptionService,
    private historyService: HistoryService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.filters = [...this._filters];
    this.activeSegment = 'wallet';
    this.filters = this.filters.filter((f) => f.name.toLowerCase() !== 'profit');
    this.dataService.clearCBI(); //Clears all stored currency, bank, and investment info
    this.selectedFilter = this.filters[0];
    this.prevFilter = this.selectedFilter;

    this.auth.getAuthStateSubject().subscribe((state) => {
      if (state) {
        this.getHistories('');
      }
    });
    this.subService.getBalanceSubject().subscribe((state) => {
      if (state) {
        // this.getHistories('');
      }
    });
    this.historyService.getActiveSegmentSubject().subscribe((state) => {
      if (state) {
        // this.activeSegment = state.activeSegment;
      }
    });
  }

  ionViewWillEnter() {
    // this.getHistoriesQuiet();
  }

  public doRefresh(event): void {
    this.getHistoriesQuiet();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public segmentChanged(event) {
    this.filters = [...this._filters];
    console.log(event.target.value);
    this.activeSegment = event.target.value;
    if(this.activeSegment === 'wallet'){
      this.filters = this.filters.filter((f) => f.name.toLowerCase() !== 'profit');
    }
    else{
      this.filters = this.filters.filter((f) => f.name.toLowerCase() !== 'bonus');
    }
  }

  public onTapFilter(filter) {
    if (filter.name === this.selectedFilter.name) {
      return;
    }
    this.histories = null;
    this.prevFilter = this.selectedFilter;
    filter.selected = true;
    this.selectedFilter = filter;
    this.prevFilter.selected = false;

    const f = { ...filter };
    f.name = f.name.toLowerCase();
    f.name === 'show all' ? this.getHistories('') : this.getHistories(f.name);
  }

  // public onTapFilter(filter){
  //   this.walletHistories = this.walletHists;
  //   this.investmentHistories = this.invHists;
  //   if(filter.name === this.selectedFilter.name){
  //     return;
  //   }
  //   // this.walletHistories = null;
  //   // this.investmentHistories = null;
  //   this.prevFilter = this.selectedFilter;
  //   filter.selected = true;
  //   this.selectedFilter = filter;
  //   this.prevFilter.selected = false;

  //   const f = {...filter};
  //   f.name = f.name.toLowerCase();
  //   // if(f.name === 'all'){
  //   //   this.walletHistories = this.walletHists;
  //   //   this.investmentHistories = this.invHists;
  //   // }

  //   // this.walletHistories = this.walletHistories.filter((wH) => wH.type.toLowerCase() === f.name );

  // }

  public openHistorySummary(hist) {
    console.log(hist);
    if (hist.type === 'profit') {
      this.router.navigateByUrl('/history-summary', {
        state: { url: this.router.url, hist },
      });
      return;
    }
  }

  public async getHistories(filter: string) {
    this.listSpinner = true;
    try {
      const [resp1, resp2] = await Promise.all([
        this.historyService.getWalletHistoriesV2(filter),
        this.historyService.getInvestmentHistoriesV2(filter),
      ]);

      this.listSpinner = false;

      console.log(resp1);
      console.log(resp2);

      this.walletHistories = this.objectsToArray(resp1.data);
      this.investmentHistories = this.objectsToArray(resp2.data.investment_history.data);

      // if (resp1.code == '100' && resp2.code == '100') {
      //   // this.histories = resp.data.history.data;
      //   console.log(resp1);
      //   console.log(resp2);
      // }
    } catch (error) {
      console.log(error);
    }
  }

  public async getHistoriesQuiet() {
    const [resp1, resp2] = await Promise.all([
      this.historyService.getWalletHistoriesV2(''),
      this.historyService.getInvestmentHistoriesV2(''),
    ]);
    this.walletHistories = this.objectsToArray(resp1.data);
      this.investmentHistories = this.objectsToArray(resp2.data.investment_history.data);
    // if (resp.code === '100') {
    //   this.histories = resp.data.history.data;
    //   console.log(this.histories);
    // }
  }

  public getIconForType(type: string) {
    return historyIcons[type];
  }

  public objectsToArray(obj) {
    const arr = [];
    Object.keys(obj).forEach((key) => {
      arr.push(obj[key]);
    });
    console.log(arr);
    return arr;
  }

  public openInfoModal(type, data) {
    this.uiService
      .getInfoStateSubject()
      .next({ active: true, data: { type, data } });
  }

  public openDepositModal(){
    this.historyService.getDoHomeActionSubject().next({action: true, type: 'deposit'});
    this.router.navigateByUrl('/tabs/home');
  }
}
