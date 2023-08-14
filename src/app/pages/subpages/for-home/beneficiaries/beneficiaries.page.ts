import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.page.html',
  styleUrls: ['./beneficiaries.page.scss']
  // styleUrls: ['./beneficiaries.page.scss', '../../../tabs/home/home.page.scss']
})
export class BeneficiariesPage implements OnInit {

  public fromPage: string;
  public beneficiaries = [];

  constructor(private router: Router, public util: UtilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.beneficiaries = state.beneficiaries;
    }
  }

  ngOnInit() {
  }


  public goToBeneficiaryDetailsPage(beneficiary){
    this.router.navigateByUrl('/beneficiary-details', {state: {url: this.router.url, beneficiary}});
  }

  public goToCreateBeneficiaryPage(){
    this.router.navigateByUrl('/create-beneficiary', {state: {url: this.router.url }});
  }

}
