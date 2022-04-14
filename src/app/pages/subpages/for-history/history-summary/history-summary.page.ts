import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-summary',
  templateUrl: './history-summary.page.html',
  styleUrls: ['./history-summary.page.scss'],
})
export class HistorySummaryPage implements OnInit {

  public fromPage: string;
  public hist;

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.hist = this.router.getCurrentNavigation().extras.state.hist;
    }
  }

  ngOnInit() {
  }

}
