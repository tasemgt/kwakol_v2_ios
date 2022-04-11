import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-affiliate-link',
  templateUrl: './affiliate-link.page.html',
  styleUrls: ['./affiliate-link.page.scss'],
})
export class AffiliateLinkPage implements OnInit {

  public fromPage: string;

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
  }

  public goToReferralCode(){
    this.router.navigateByUrl('/referral-code', {state: {url: this.router.url}});
  }

}
