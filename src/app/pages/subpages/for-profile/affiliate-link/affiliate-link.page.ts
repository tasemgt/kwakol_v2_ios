import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from '_node_modules/@awesome-cordova-plugins/clipboard/ngx';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-affiliate-link',
  templateUrl: './affiliate-link.page.html',
  styleUrls: ['./affiliate-link.page.scss'],
})
export class AffiliateLinkPage implements OnInit {

  public fromPage: string;
  public accountDeets;

  constructor(
    private clipboard: Clipboard,
    private router: Router,
    private util: UtilService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.accountDeets = this.router.getCurrentNavigation().extras.state.accountDeets;
    }
  }

  ngOnInit() {
  }

  public async copyLink(){
    const copied = await this.clipboard.copy(this.accountDeets.referral_url);
    if(copied){
      this.util.showToast('Referral link copied...', 2000, 'success');
    }
  }

  public goToReferralCode(){
    this.router.navigateByUrl('/referral-code', {state: {url: this.router.url}});
  }

}
