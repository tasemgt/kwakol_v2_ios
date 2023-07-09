import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.page.html',
  styleUrls: ['./faq-details.page.scss'],
})
export class FaqDetailsPage implements OnInit {

  public fromPage: string;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
    }
  }
  
  ngOnInit() {
  }

}
