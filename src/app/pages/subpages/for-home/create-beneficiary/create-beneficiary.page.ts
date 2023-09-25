import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from 'node_modules/@ionic/angular';
import { countries } from 'src/app/models/constants';
import { Beneficiary } from 'src/app/models/user';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-create-beneficiary',
  templateUrl: './create-beneficiary.page.html',
  styleUrls: ['./create-beneficiary.page.scss'],
})
export class CreateBeneficiaryPage implements OnInit {
  @ViewChild('selectCountryModal') selectCountryModal: IonModal;
  @ViewChild('selectDOBModal') selectDOBModal: IonModal;
  @ViewChild('datepicker') datepicker: ElementRef;

  public countries = countries;

  public selectedCountryImg = '';

  public currentDate: Date | null;
  public selectedDate: Date | null;

  public fromPage: string;
  public beneficiary = new Beneficiary();

  constructor(
    private router: Router,
    private util: UtilService,
    private loading: LoadingController,
    private subService: SubscriptionService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
    }
  }

  ngOnInit() {
    this.currentDate = new Date();
  }

  public openSelectDOBModal() {
    this.selectDOBModal.present();
  }

  public openSelectCountryModal() {
    this.selectCountryModal.present();
  }

  public selectDOB() {
    // console.log('Selected Date>>> ', this.selectedDate);
    this.beneficiary.date_of_birth = this.util.getSimpleDate(this.selectedDate);
    this.selectDOBModal.dismiss();
  }

  public getSelectedDate(event){
    console.log('EVVF ', event);
  }

  public closeDateModal(){
    // this.beneficiary.date_of_birth = 'Date of Birth';
    this.selectDOBModal.dismiss();
  }

  public selectCountry(country) {
    console.log(country);
    this.beneficiary.country = country.name;
    this.selectedCountryImg = country.img;
    this.selectCountryModal.dismiss();
  }

  public async continueCreateBeneficiary() {
    if (this.util.checkUndefinedProperties(this.beneficiary)) {
      this.util.showToast('Kindly ensure no empty fields', 2500, 'danger');
      return;
    }
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.goToAddAccount();
    }, 1500);
  }

  private async goToAddAccount() {
    this.util.presentLoading();
    try {
      const resp = await this.subService.getInvestmentAccounts();
      this.loading.dismiss();
      if (resp.code === '100') {
        const invAccounts = resp.data.subscriptions;
        this.router.navigateByUrl('/new-account', {
          state: { url: this.router.url, accounts: invAccounts, beneficiary: this.beneficiary}
        });
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
    }
  }
}
