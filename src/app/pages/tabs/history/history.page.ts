import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage  implements OnInit{

  public prevFilter;
  public selectedFilter;

  public filters = [
    { name: 'Show All', icon: 'all', selected: true },
    { name: 'Profits', icon: 'profit2', class: 'profit', selected: false },
    { name: 'Pending', icon: 'pending', class: 'pending', selected: false },
    { name: 'Bonuses', icon: 'bonus2', class: 'bonus', selected: false },
    { name: 'Withdrawals', icon: 'withdrawal2', class: 'withdrawal', selected: false },
    { name: 'Deposits', icon: 'deposit2', class: 'deposit', selected: false }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.selectedFilter = this.filters[0];
    this.prevFilter = this.selectedFilter;
  }


  public onTapFilter(filter){
    this.prevFilter = this.selectedFilter;
    filter.selected = true;
    this.selectedFilter = filter;
    this.prevFilter.selected = false;
  }

  public openHistorySummary(){
    this.router.navigateByUrl('/history-summary', {state:{url: this.router.url}});
  }

  public sort(){
  }

}
