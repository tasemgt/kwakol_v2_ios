import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: 'portfolio.page.html',
  styleUrls: ['portfolio.page.scss']
})
export class PortfolioPage {

  constructor(private router: Router) {}

  public goToInvestmentDetails(){
    this.router.navigateByUrl('/investment-details', {state: {url:this.router.url}});
  }

  public goToNewAccount(){
    this.router.navigateByUrl('/new-account', {state: {url:this.router.url}});
  }
}
