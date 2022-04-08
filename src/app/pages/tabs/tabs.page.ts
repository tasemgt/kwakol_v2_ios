import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('tabs', { static: false }) tabs: IonTabs;
  public selectedTab: string;
  public previousTab: string;

  public tabList = {
    home: false,
    portfolio: false,
    history: false,
    feed: false,
    profile: false
  };

  constructor() {}


  public onTabChange(): void{
    this.previousTab = this.selectedTab;
    this.selectedTab = this.tabs.getSelected();
    this.tabList[this.selectedTab] = true;
    this.tabList[this.previousTab] = false;
  }

}
