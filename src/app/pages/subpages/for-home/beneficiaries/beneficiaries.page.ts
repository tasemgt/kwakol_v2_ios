import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HomeService } from 'src/app/services/home.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.page.html',
  styleUrls: ['./beneficiaries.page.scss'],
  // styleUrls: ['./beneficiaries.page.scss', '../../../tabs/home/home.page.scss']
})
export class BeneficiariesPage implements OnInit {
  public fromPage: string;
  public beneficiaries = [];

  constructor(
    private router: Router,
    public util: UtilService,
    private loading: LoadingController,
    private homeService: HomeService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.beneficiaries = state.beneficiaries;
    }
  }

  ngOnInit() {}

  public async goToBeneficiaryDetailsPage(beneficiary) {
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getBeneficiaryHistory(beneficiary.beneficiary_id);
      if(resp.code == '100'){
        this.loading.dismiss();
        const benHistStat = resp.data;
        this.router.navigateByUrl('/beneficiary-details', {
          state: { url: this.router.url, beneficiary, benHistStat },
        });
      }
    } catch (e) {
      this.loading.dismiss();
      this.util.showToast('An error occurred', 2000, 'danger');
    }
  }

  public goToCreateBeneficiaryPage() {
    this.router.navigateByUrl('/create-beneficiary', {
      state: { url: this.router.url },
    });
  }
}
