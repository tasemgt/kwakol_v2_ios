import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit {

  public fromPage: string;
  public feeds = [];

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.feeds = state.feeds;
    }
  }

  public viewFeedDetails(feed){
    this.router.navigateByUrl('/feed-details', {state: {url: this.router.url, feed}});
  }

  ngOnInit() {
  }

}
