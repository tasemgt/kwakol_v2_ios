import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';
import { investmentIcons } from 'src/app/models/constants';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.page.html',
  styleUrls: ['./beneficiary-details.page.scss'],
})
export class BeneficiaryDetailsPage implements OnInit {
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  @ViewChild('doDepositFromWalletToBeneficiaryModal')
  doDepositFromWalletToBeneficiaryModal: IonModal;
  @ViewChild('withdrawToWalletModal') withdrawToWalletModal: IonModal;
  @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;
  @ViewChild('accountStatementModal') accountStatementModal: IonModal;
  // @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;
  @ViewChild('pinEnterModal') pinEnterModal: IonModal;

  //Amount Inputs
  @ViewChild('doDepositFromWalletToBeneficiaryRef')
  doDepositFromWalletToBeneficiaryRef: ElementRef;

  @ViewChild('selectDateModal') selectDateModal: IonModal;
  @ViewChild('datepicker') datepicker: ElementRef;

  public transType: string;
  public walletBal: string;


  public currentDate: Date | null;
  public selectedDate: Date | null;
  public dateState = 'from';

  public showLoadingModal: boolean;
  public backdropActive = false;
  public loadingModalType: string;

  public fromPage: string;
  public beneficiary: any;
  public activeSegment: string;

  public depositFromWalletToBeneficiaryAmount: string;

  public inputPinTypePassword = true;
  public pin: string;

  //Segments
  public withdrawAmount: string;
  public date = {
    from: '',
    to: '',
  };

  constructor(
    private keyboard: Keyboard,
    private router: Router,
    public util: UtilService,
    private homeService: HomeService,
    private subscriptionService: SubscriptionService,
    private loading: LoadingController,
    private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.beneficiary = state.beneficiary;
      this.walletBal = state.walletBal;
    }
  }

  ngOnInit() {
    this.activeSegment = 'history';
    this.currentDate = new Date();
    this.walletBal = this.homeService.getWalletBallance();
    console.log(this.beneficiary);
  }

  public segmentChanged(event) {
    console.log(event.target.value);
    this.activeSegment = event.target.value;
  }

  //Responsible for alerts and confirmation.
  public openLoadingModal(type: string) {
    this.loadingModalType = type;
    setTimeout(() => {
      this.backdropActive = true;
      this.showLoadingModal = true;
    }, 10);
  }

  public closeLoadingModal() {
    const loadingModalDiv = this.loadingModalDiv.nativeElement;
    const backdrop = this.backdrop.nativeElement;

    this.renderer.removeClass(loadingModalDiv, 'animate__slideInUp');
    this.renderer.addClass(loadingModalDiv, 'animate__slideOutDown');
    this.renderer.removeClass(backdrop, 'animate__fadeIn');
    this.renderer.addClass(backdrop, 'animate__fadeOut');
    setTimeout(() => {
      this.backdropActive = false;
      this.showLoadingModal = false;

      if (this.loadingModalType === 'alert') {
        this.subscriptionService.getBalanceSubject().next(true);
        // this.router.navigateByUrl('/tabs/home');
      }
    }, 100);
  }

  public openEnterWithdrawalAmount() {
    this.closeLoadingModal(); //
    this.withdrawToWalletModal.present();
  }

  public openEnterDepositFromWalletAmount() {
    this.doDepositFromWalletToBeneficiaryModal.present();
    if (this.doDepositFromWalletToBeneficiaryRef?.nativeElement) {
      this.doDepositFromWalletToBeneficiaryRef.nativeElement.focus();
      this.keyboard.show();
    }
  }

  public openEnterPinModal(type) {
    this.transType = type;
    if (type === 'withdrawal') {
      if (!this.withdrawAmount) {
        this.util.showToast(
          'Kindly enter your withdrawal amount',
          2500,
          'danger'
        );
        return;
      }
      this.withdrawToWalletModal.dismiss();
    } else {
      //Deposit
      if (!this.depositFromWalletToBeneficiaryAmount) {
        this.util.showToast('Kindly enter your deposit amount', 2500, 'danger');
        return;
      }
      this.doDepositFromWalletToBeneficiaryModal.dismiss();
    }
    this.pinEnterModal.present();
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      if (this.transType === 'withdrawal') {
        this.makeWithdrawalToWallet();
      } else {
        this.doDepositFromWalletToInvestment();
      }
    }
  }

  public async doDepositFromWalletToInvestment() {
    if (!this.pin) {
      return;
    }
    if (!this.depositFromWalletToBeneficiaryAmount) {
      return;
    }
    const payload = {
      pin: this.pin,
      // subscription: '',
      amount: this.depositFromWalletToBeneficiaryAmount,
      beneficiary_id: this.beneficiary.beneficiary_id,
    };
    this.util.presentLoading();
    console.log(payload);
    try {
      const resp = await this.homeService.doTransferToBeneficiary(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.openLoadingModal('alert');
        this.beneficiary.balance =
          +this.beneficiary.balance +
          +this.depositFromWalletToBeneficiaryAmount +
          ''; //update the beneficiary balance on the page
        this.subscriptionService.getBalanceSubject().next(true);
        this.pin = '';
        this.depositFromWalletToBeneficiaryAmount = '';
      } else if (resp.code == '418') {
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  public async makeWithdrawalToWallet() {
    const payload = {
      beneficiary_id: this.beneficiary.beneficiary_id,
      amount: this.withdrawAmount,
      pin: this.pin,
    };
    this.util.presentLoading();
    console.log(payload);
    try {
      const resp = await this.homeService.withdrawFromBeneficiary(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.openLoadingModal('alert');
        this.beneficiary.balance =
          +this.beneficiary.balance - +this.withdrawAmount + ''; //update the investment balance on the page
        this.subscriptionService.getBalanceSubject().next(true);
        this.pin = '';
        this.withdrawAmount = '';
      } else if (resp.code == '418') {
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  public openMoreOptionsModal() {
    this.moreOptionsModal.present();
  }

  public requestAccountStatement() {
    this.moreOptionsModal.dismiss();
    this.accountStatementModal.present();
  }

  public generateAccountStatement() {
    if(!this.date.from && !this.date.to){
      this.util.showToast('Please select a date range', 2000, 'danger');
      return;
    }
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.accountStatementModal.dismiss();
      this.openLoadingModal('alert-statement');
    }, 1000);
  }

  public openDateModal(type) {
    this.dateState = type;
    this.selectDateModal.present();
  }

  public selectDate() {
    // console.log('Selected Date>>> ', this.selectedDate);
    if (this.dateState === 'from') {
      this.date.from = this.util.getSimpleDate(this.selectedDate);
    } else {
      this.date.to = this.util.getSimpleDate(this.selectedDate);
    }
    this.selectDateModal.dismiss();
  }

  public getSelectedDate(event) {
    console.log('EVVF ', event);
  }

  public closeDateModal() {
    this.selectDateModal.dismiss();
  }

  public closeInvestment(){}

  public getIconForInvName(inv: string) {
    if (inv) {
      return investmentIcons[inv.toLowerCase()];
    }
    return '';
  }
}
