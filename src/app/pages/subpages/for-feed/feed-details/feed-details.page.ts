import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from 'node_modules/@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-feed-details',
  templateUrl: './feed-details.page.html',
  styleUrls: ['./feed-details.page.scss'],
})
export class FeedDetailsPage implements OnInit {

  public fromPage: string;
  public feed;

  public sunVal = true;
  public moonVal = false;

  constructor(
    private router: Router,
    private platform: Platform) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.feed = this.router.getCurrentNavigation().extras.state.feed;
    }
  }

  ngOnInit() {
  }

  public async switchMode(){
    this.sunVal = !this.sunVal;
    this.moonVal = !this.moonVal;

    if (this.platform.is('capacitor')) {
      if(this.moonVal){
        await StatusBar.setStyle({ style: Style.Dark });
        return;
      }
      await StatusBar.setStyle({ style: Style.Light });
    }
  }

}
