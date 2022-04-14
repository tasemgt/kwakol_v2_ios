import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { historyIcons } from 'src/app/models/constants';
import { HistoryService } from 'src/app/services/history.service';
import { BottomDrawerPage } from '../../modals/bottom-drawer/bottom-drawer.page';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage  implements OnInit{

  private modal: HTMLIonModalElement;

  public prevFilter;
  public selectedFilter;

  public histories;

  public filters = [
    { name: 'Show All', icon: 'all', selected: true },
    { name: 'Profit', icon: 'profit2', class: 'profit', selected: false },
    { name: 'Pending', icon: 'pending', class: 'pending', selected: false },
    { name: 'Bonus', icon: 'bonus2', class: 'bonus', selected: false },
    { name: 'Withdrawal', icon: 'withdrawal2', class: 'withdrawal', selected: false },
    { name: 'Deposit', icon: 'deposit2', class: 'deposit', selected: false }
  ];

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private historyService: HistoryService) {}

  ngOnInit() {
    this.selectedFilter = this.filters[0];
    this.prevFilter = this.selectedFilter;

    this.getHistories('');
  }


  public onTapFilter(filter){
    this.histories = null;
    this.prevFilter = this.selectedFilter;
    filter.selected = true;
    this.selectedFilter = filter;
    this.prevFilter.selected = false;

    const f = {...filter};
    f.name = f.name.toLowerCase();
    f.name === 'show all' ? this.getHistories('') : this.getHistories(f.name);
  }

  public openHistorySummary(hist){
    console.log(hist);
    this.router.navigateByUrl('/history-summary', {state:{url: this.router.url, hist}});
  }

  public sort(){
    this.presentModal('sort');
  }

  public async getHistories(filter: string){
    try {
      const resp = await this.historyService.getHistories(filter);
      if(resp.code === '100'){
        this.histories = resp.data.history.data;
        console.log(this.histories);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public getIconForType(type: string){
    return historyIcons[type];
  }

  private async presentModal(type: string) {
    this.modal = await this.modalCtrl.create({
      component: BottomDrawerPage,
      breakpoints: [0, 0.2, 0.4],
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropBreakpoint: 0.2,
      backdropDismiss: true,
      swipeToClose: true,
      keyboardClose: true,
      cssClass: 'kwakol-modal-bottom-drawer',
      componentProps: { type, formSelects: {}}
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    if(!data) return;
    const from = data.data.data.from;
    const to = data.data.data.to;
    this.filterHistoryByDate(from, to);
  }

  private async filterHistoryByDate(from, to){
    const payload = {
      from: `${from} 00:00:00`,
      to: `${to} 23:59:59`
    }
    try {
      const resp = await this.historyService.getHistoriesByDate(payload);
      if(resp.code === '100'){
        this.histories = resp.data.history;
        console.log(this.histories);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
