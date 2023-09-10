import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {

  public fromPage: string;
  public faqs = [];

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.faqs = state.faqs;
    }
  }

  public viewFAQDetails(faq){
    this.router.navigateByUrl('/faq-details', {state: {url: this.router.url, faq}});
  }

  ngOnInit() {
  }

}
