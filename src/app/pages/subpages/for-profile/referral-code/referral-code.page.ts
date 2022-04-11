import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-referral-code',
  templateUrl: './referral-code.page.html',
  styleUrls: ['./referral-code.page.scss'],
})
export class ReferralCodePage implements OnInit {

  public fromPage: string;
  public refCode: string;

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
  }

  public confirm(){
    
  }

}
