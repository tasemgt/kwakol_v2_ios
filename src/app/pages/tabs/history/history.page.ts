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

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage  implements OnInit{

  
  public prevFilter;
  public selectedFilter;
  public histories;
  
  public filters = [
    { name: 'Show All', icon: 'all', class: 'all', size: '4', selected: true },
    { name: 'Profit', icon: 'profit2', class: 'profit', size: '3', selected: false },
    { name: 'Pending', icon: 'pending', class: 'pending', size: '4', selected: false },
    { name: 'Bonus', icon: 'bonus2', class: 'bonus', size: '3', selected: false },
    { name: 'Withdrawal', icon: 'withdrawal2', class: 'withdrawal', size: '4', selected: false },
    { name: 'Deposit', icon: 'deposit2', class: 'deposit', size: '4', selected: false }
  ];

  //Segment states
  public childPage;
  public activeSegment: string;

  private modal: HTMLIonModalElement;
  constructor(
    public util: UtilService,
    private modalCtrl: ModalController,
    private router: Router,
    private auth: AuthService,
    private subService: SubscriptionService,
    private historyService: HistoryService,
    private dataService: DataService) {
    }

  ngOnInit() {
    this.activeSegment = 'wallet';
    this.dataService.clearCBI(); //Clears all stored currency, bank, and investment info
    this.selectedFilter = this.filters[0];
    this.prevFilter = this.selectedFilter;

    this.auth.getAuthStateSubject().subscribe((state) =>{
      if(state){
        // this.getHistories();
      }
    });
    this.subService.getBalanceSubject().subscribe((state) =>{
      if(state){
        // this.getHistories();
      }
    });
    this.historyService.getActiveSegmentSubject().subscribe((state) =>{
      if(state){
        // this.activeSegment = state.activeSegment;
      }
    });
  }


  ionViewWillEnter(){
    // this.getHistoriesQuiet();
  }

  public segmentChanged(event) {
    console.log(event.target.value);
    this.activeSegment = event.target.value;
  }

  public onTapFilter(filter){
    if(filter.name === this.selectedFilter.name){
      return;
    }
    this.histories = null;
    this.prevFilter = this.selectedFilter;
    filter.selected = true;
    this.selectedFilter = filter;
    this.prevFilter.selected = false;

    const f = {...filter};
    f.name = f.name.toLowerCase();
    // f.name === 'show all' ? this.getHistories() : this.getHistories();
  }

  public openHistorySummary(hist){
    console.log(hist);
    if(hist.type === 'profit'){
      this.router.navigateByUrl('/history-summary', {state:{url: this.router.url, hist}});
      return;
    }
  }

  // public sort(){
  //   this.presentModal('sort');
  // }

  public async getHistories(){
    try {
      const resp = await this.historyService.getHistories();
      if(resp.code === '100'){
        this.histories = resp.data.history.data;
        console.log(this.histories);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getHistoriesQuiet(){
    const resp = await this.historyService.getHistories();
    if(resp.code === '100'){
      this.histories = resp.data.history.data;
      console.log(this.histories);
    }
  }

  public getIconForType(type: string){
    return historyIcons[type];
  }

  // private async presentModal(type: string) {
  //   this.modal = await this.modalCtrl.create({
  //     component: BottomDrawerPage,
  //     breakpoints: [0, 0.2, 0.4],
  //     mode: 'ios',
  //     initialBreakpoint: 0.4,
  //     backdropBreakpoint: 0.2,
  //     backdropDismiss: true,
  //     swipeToClose: true,
  //     keyboardClose: true,
  //     cssClass: 'kwakol-modal-bottom-drawer',
  //     componentProps: { type, formSelects: {}}
  //   });
  //   await this.modal.present();
  //   const { data } = await this.modal.onWillDismiss();
  //   if(!data) return;
  //   const from = data.data.data.from;
  //   const to = data.data.data.to;
  //   this.filterHistoryByDate(from, to);
  // }

  // private async filterHistoryByDate(from, to){
  //   const payload = {
  //     from: `${from} 00:00:00`,
  //     to: `${to} 23:59:59`
  //   }
  //   try {
  //     const resp = await this.historyService.getHistoriesByDate(payload);
  //     if(resp.code === '100'){
  //       this.histories = resp.data.history;
  //       console.log(this.histories);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

}
