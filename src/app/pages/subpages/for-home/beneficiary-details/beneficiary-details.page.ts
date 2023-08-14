import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.page.html',
  styleUrls: ['./beneficiary-details.page.scss'],
})
export class BeneficiaryDetailsPage implements OnInit {

  public fromPage: string;
  public beneficiary: any;

  constructor(
    private router: Router,
    public util: UtilService,
    private subscriptionService: SubscriptionService,
    private loading: LoadingController,
    // private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.beneficiary = state.beneficiary;
    }
  }

  ngOnInit() {
  }

  public openLoadingModal(type: string) {
    // this.loadingModalType = type;
    // setTimeout(() => {
    //   this.backdropActive = true;
    //   this.showLoadingModal = true;
    // }, 10);
  }

  public openMoreOptionsModal(){
    // this.moreOptionsModal.present();
  }

}
