import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: 'portfolio.page.html',
  styleUrls: ['portfolio.page.scss']
})
export class PortfolioPage implements OnInit{

  public portfolio;

  constructor(
    private router: Router,
    private portfolioService: PortfolioService,
    public util: UtilService) {}

  ngOnInit(): void {
    this.getPortfolio();
  }
  

  private async getPortfolio(){
    try {
      const resp = await this.portfolioService.getPortfolio();
      if(resp.code === '100'){
        this.portfolio = resp.data.portfolio;
      }
    } catch (error) {
      console.log(error);
    }
  }

  public goToInvestmentDetails(sub){
    this.router.navigateByUrl('/investment-details', {state: {url:this.router.url, sub}});
  }

  public goToNewAccount(){
    this.router.navigateByUrl('/new-account', {state: {url:this.router.url}});
  }
}
