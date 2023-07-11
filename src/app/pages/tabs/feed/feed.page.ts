import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedsService } from 'src/app/services/feeds.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  public explore;

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

  public viewFAQs(){
    this.router.navigateByUrl('/faqs', {state: {url: this.router.url}});
  }

  public viewFAQDetails(){
    this.router.navigateByUrl('/faq-details', {state: {url: this.router.url}});
  }

  public viewNewsFeeds(){
    this.router.navigateByUrl('/feeds', {state: {url: this.router.url}});
  }

  public viewNewsFeedsDetails(feed){
    this.router.navigateByUrl('/feed-details', {state: {url: this.router.url, feed}});
  }

  private async getFeeds(){
    try {
      const resp = await this.feedService.getExploreData();
      if(resp.code == '100'){
        this.explore = resp.data;
        console.log(this.explore);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
