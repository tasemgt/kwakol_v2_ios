import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {

  public fromPage: string;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
    }
  }

  public viewFAQDetails(){
    this.router.navigateByUrl('/faq-details', {state: {url: this.router.url}});
  }

  ngOnInit() {
  }

}
