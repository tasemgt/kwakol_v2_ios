import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedsService } from 'src/app/services/feeds.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  public feeds;

  constructor(
    private router: Router,
    private feedService: FeedsService) { }

  ngOnInit() {
    this.getFeeds();
  }

  public goToFeedDetails(feed){
    this.router.navigateByUrl('/feed-details', {state: {url:this.router.url, feed}});
  }

  public viewNotifications(){
    this.router.navigateByUrl('/notifications', {state: {url: this.router.url}});
  }

  private async getFeeds(){
    try {
      const resp = await this.feedService.getFeeds();
      if(resp.code === '100'){
        this.feeds = resp.data.feeds.data;
        console.log(this.feeds);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
