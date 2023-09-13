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
  public notifications = [];
  public faqs = [];
  public feeds = [];

  constructor(
    private router: Router,
    private feedService: FeedsService) { }

  ngOnInit() {
    this.getFeeds();
  }

  public doRefresh(event): void {
    this.getFeedsQuiet();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public goToFeedDetails(feed){
    this.router.navigateByUrl('/feed-details', {state: {url:this.router.url, feed}});
  }

  public viewNotifications(){
    this.router.navigateByUrl('/notifications', {state: {url: this.router.url, notifications:this.notifications}});
  }

  public viewFAQs(){
    this.router.navigateByUrl('/faqs', {state: {url: this.router.url, faqs: this.faqs}});
  }

  public viewFAQDetails(faq){
    this.router.navigateByUrl('/faq-details', {state: {url: this.router.url, faq}});
  }

  public viewNewsFeeds(){
    this.router.navigateByUrl('/feeds', {state: {url: this.router.url, feeds: this.feeds}});
  }

  public viewNewsFeedsDetails(feed){
    this.router.navigateByUrl('/feed-details', {state: {url: this.router.url, feed}});
  }

  private async getFeeds(){
    try {
      const resp = await this.feedService.getExploreData();
      if(resp.code == '100'){
        this.explore = resp.data;
        this.notifications = this.explore.notifications;
        this.faqs = this.explore.faq;
        this.feeds = this.explore.feeds;
        console.log(this.explore);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async getFeedsQuiet(){
    const resp = await this.feedService.getExploreData();
    console.log('Quiet Feeds>> ', resp);
    if (resp.code == '100') {
      this.explore = resp.data;
      this.notifications = this.explore.notifications;
      this.faqs = this.explore.faq;
      this.feeds = this.explore.feeds;
    }
  }

}
