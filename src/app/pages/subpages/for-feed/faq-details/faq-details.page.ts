import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.page.html',
  styleUrls: ['./faq-details.page.scss'],
})
export class FaqDetailsPage implements OnInit {

  public fromPage: string;
  public faq: any;
  public faqBody: any;

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.faq = state.faq;
      this.faqBody = state.faq.body;
    }
  }

  ngOnInit() {
    this.faqBody = this.sanitizer.bypassSecurityTrustHtml(this.faqBody);
  }

}
