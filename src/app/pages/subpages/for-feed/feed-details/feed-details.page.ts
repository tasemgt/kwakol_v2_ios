import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.feed = this.router.getCurrentNavigation().extras.state.feed;
    }
  }

  ngOnInit() {
  }

  public switchMode(){
    this.sunVal = !this.sunVal;
    this.moonVal = !this.moonVal;
  }

}
