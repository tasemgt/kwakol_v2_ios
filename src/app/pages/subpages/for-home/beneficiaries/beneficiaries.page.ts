import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.page.html',
  styleUrls: ['./beneficiaries.page.scss'],
  // styleUrls: ['./beneficiaries.page.scss', '../../../tabs/home/home.page.scss']
})
export class BeneficiariesPage implements OnInit, OnDestroy{
  public fromPage: string;
  public beneficiaries = [];

  public reloadBeneficiariesSub: Subscription;

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

  ngOnInit() {
    this.reloadBeneficiariesSub = this.homeService.getReloadBeneficiariesStateSubject().subscribe((pay) =>{
      if(pay){
        this.getBeneficiaries();
      }
    })
  }
  
  ngOnDestroy(): void {
    console.log('killed');
    this.reloadBeneficiariesSub.unsubscribe();
  }

  ionViewWillEnter(){
    
  }

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

  private async getBeneficiaries() {
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getBeneficiaries();
      this.loading.dismiss();
      if (resp.code == 100) {
        this.beneficiaries = resp.data;
        console.log(this.beneficiaries);
      }
      else{
        console.log(resp);
      }
    } catch (e) {
      this.loading.dismiss();
      console.log(e);
    }
  }
}
