import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public goToFeedDetails(){
    this.router.navigateByUrl('/feed-details', {state: {url:this.router.url}});
  }

}
