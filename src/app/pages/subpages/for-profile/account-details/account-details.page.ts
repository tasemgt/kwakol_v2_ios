import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.page.html',
  styleUrls: ['./account-details.page.scss'],
})
export class AccountDetailsPage implements OnInit {

  public fromPage: string;
  public accountDeets;

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.accountDeets = this.router.getCurrentNavigation().extras.state.accountDeets;
    }
  }

  ngOnInit() {
  }

  public requestUpdate(){
    
  }

}
