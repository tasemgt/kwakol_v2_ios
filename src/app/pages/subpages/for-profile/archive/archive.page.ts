import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HomeService } from 'src/app/services/home.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {
  public fromPage: string;
  public archives = [];
  public investment: any;

  constructor(
    private router: Router,
    private util: UtilService,
    private loading: LoadingController,
    private homeService: HomeService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.investment = state.investment;
      // this.archives = state.archives;
    }
  }

  ngOnInit() {
  }

  public async openInvestementDetailsPage(inv, isArchived) {
    //Fetch investment histry from api

    this.util.presentLoading();
    // setTimeout(() => {
    //   this.router.navigateByUrl('/investment-details', {
    //     state: {
    //       url: this.router.url,
    //       investment: inv,
    //       walletBal: '0.00',
    //       histStats: { history: { data: [] } },
    //       isArchived,
    //     },
    //   });
    // }, 1000);
    try {
      const resp = await this.homeService.getInvestmentHistory(inv.id);
      this.loading.dismiss();
      if (resp.code == '100') {
        inv.balance = '0.00'
        this.router.navigateByUrl('/investment-details', {
          state: {
            url: this.router.url,
            investment: inv,
            walletBal: '0.00',
            histStats: resp.data,
            isArchived
          },
        });
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }
}
