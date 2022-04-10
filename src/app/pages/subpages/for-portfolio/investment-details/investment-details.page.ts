import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.page.html',
  styleUrls: ['./investment-details.page.scss'],
})
export class InvestmentDetailsPage implements OnInit {

  public fromPage: string;

  public selectedTab;
  public prevTab;

  public tabs = [
    {name: 'History', active: true},
    {name: 'Statistics', active: false},
    {name: 'About', active: false}
  ]

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
    this.selectedTab = this.tabs[0];
    this.prevTab = this.tabs[0];
  }

  public switchTab(tab: any){
    this.prevTab.active = false;
    tab.active = true;
    this.selectedTab = tab;
    console.log(tab);
    this.prevTab = tab;
  }

  public goToPage(page:string){

  }

}
