import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Keyboard } from 'node_modules/@ionic-native/keyboard/ngx';
import { IonModal, LoadingController } from 'node_modules/@ionic/angular';
import { historyIcons, investmentIcons } from 'src/app/models/constants';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.page.html',
  styleUrls: ['./investment-details.page.scss'],
})
export class InvestmentDetailsPage implements OnInit {
  @ViewChild('InfoModalDiv') infoModalDiv: ElementRef;
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  @ViewChild('doDepositFromWalletModal') doDepositFromWalletModal: IonModal;
  @ViewChild('withdrawToWalletModal') withdrawToWalletModal: IonModal;
  @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;
  @ViewChild('accountStatementModal') accountStatementModal: IonModal;
  // @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;
  @ViewChild('pinEnterModal') pinEnterModal: IonModal;

  //Amount Inputs
  @ViewChild('doDepositFromWalletRef') doDepositFromWalletRef: ElementRef;
  @ViewChild('withdrawAmountRef') withdrawAmountRef: ElementRef;

  @ViewChild('selectDateModal') selectDateModal: IonModal;
  @ViewChild('datepicker') datepicker: ElementRef;

  public fromPage: string;
  public investment: any;
  public walletBal: string;
  public transType: string;
  public histStats: any;
  public isArchived: boolean;

  public showLoadingModal: boolean;
  public showInfoModal: boolean;
  public infoModalData: any;
  public infoModalDataType: string;
  public backdropActive = false;
  public loadingModalType: string;

  public currentDate: Date | null;
  public selectedDate: Date | null;
  public dateState = 'from';

  public depositFromWalletAmount: string;
  public inputPinTypePassword = true;
  public pin: string;

  public openedFrom = '';

  //Segment states
  public activeSegment: string;

  public withdrawAmount: string;
  public date = {
    from: '',
    to: '',
  };

  constructor(
    private keyboard: Keyboard,
    private router: Router,
    public util: UtilService,
    private uiService: UiService,
    private subscriptionService: SubscriptionService,
    public homeService: HomeService,
    private loading: LoadingController,
    private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.investment = state.investment;
      this.walletBal = state.walletBal;
      this.histStats = state.histStats;
      this.isArchived = state.isArchived;
    }
    this.infoModalData = {};
  }

  ngOnInit() {
    this.activeSegment = 'history';
    this.currentDate = new Date();
    console.log('invvv ', this.investment);
    console.log('ballll ', this.walletBal);
    console.log('HistStats ', this.histStats);
    console.log('Is Archived ', this.isArchived);
  }

  public doRefresh(event): void {
    this.doGetInvestmentDetails();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public getIconForInvName(inv: string) {
    if (inv) {
      return investmentIcons[inv.toLowerCase()];
    }
    return '';
  }

  public segmentChanged(event) {
    console.log(event.target.value);
    this.activeSegment = event.target.value;
  }

  public openInfoModal(type, data) {
    this.openedFrom = 'info';
    this.infoModalDataType = type;
    console.log(data);
    const res = this.util.infoModalFunc(type, data, this.infoModalData);
    setTimeout(() => {
      if (res) {
        this.backdropActive = true;
        this.showInfoModal = true;
      }
    }, 10);
  }

  //Responsible for alerts and confirmation.
  public openLoadingModal(type: string) {
    this.loadingModalType = type;
    setTimeout(() => {
      this.backdropActive = true;
      this.showLoadingModal = true;
    }, 10);
  }

  public closeModal() {
    const modalDiv =
      this.openedFrom === 'info'
        ? this.infoModalDiv.nativeElement
        : this.loadingModalDiv.nativeElement;
    const backdrop = this.backdrop.nativeElement;

    this.renderer.removeClass(modalDiv, 'animate__slideInUp');
    this.renderer.addClass(modalDiv, 'animate__slideOutDown');
    this.renderer.removeClass(backdrop, 'animate__fadeIn');
    this.renderer.addClass(backdrop, 'animate__fadeOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => {
      this.backdropActive = false;
      this.showInfoModal = false;
      this.showLoadingModal = false;
      this.openedFrom = '';
      if (this.loadingModalType === 'alert') {
        this.subscriptionService.getBalanceSubject().next(true);
      }
    }, 100);
  }

  // public closeLoadingModal() {
  //   const loadingModalDiv = this.loadingModalDiv.nativeElement;
  //   const backdrop = this.backdrop.nativeElement;

  //   this.renderer.removeClass(loadingModalDiv, 'animate__slideInUp');
  //   this.renderer.addClass(loadingModalDiv, 'animate__slideOutDown');
  //   this.renderer.removeClass(backdrop, 'animate__fadeIn');
  //   this.renderer.addClass(backdrop, 'animate__fadeOut');
  //   setTimeout(() => {
  //     this.backdropActive = false;
  //     this.showLoadingModal = false;

  //     if (this.loadingModalType === 'alert') {
  //       this.subscriptionService.getBalanceSubject().next(true);
  //       // this.router.navigateByUrl('/tabs/home');
  //     }
  //   }, 100);
  // }

  public async openEnterWithdrawalAmount() {
    this.closeModal(); //
    await this.withdrawToWalletModal.present();
    if (this.withdrawAmountRef?.nativeElement) {
      this.withdrawAmountRef.nativeElement.focus();
      this.keyboard.show();
    }
    const data = this.withdrawToWalletModal.willDismiss;
    if(data){
      this.withdrawAmount = '';
    }
  }

  public async openEnterDepositFromWalletAmount() {
    await this.doDepositFromWalletModal.present();
    if (this.doDepositFromWalletRef?.nativeElement) {
      this.doDepositFromWalletRef.nativeElement.focus();
      this.keyboard.show();
    }
    const data = this.doDepositFromWalletModal.willDismiss;
    if(data){
      this.depositFromWalletAmount = '';
    }
  }

  //Pin stuff
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
      if (!this.depositFromWalletAmount) {
        this.util.showToast('Kindly enter your deposit amount', 2500, 'danger');
        return;
      }
      this.doDepositFromWalletModal.dismiss();
    }
    this.pinEnterModal.present();
  }

  public onTapPinInput(): void {
    // this.inputPinTypePassword = !this.inputPinTypePassword;
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
  // End Pin stuff

  public async doDepositFromWalletToInvestment() {
    if (!this.pin) {
      return;
    }
    if (!this.depositFromWalletAmount) {
      return;
    }
    const payload = {
      pin: this.pin,
      subscription_id:  this.investment.id,//this.investment.subscription_id,
      amount: Math.abs(+this.depositFromWalletAmount),
    };
    this.util.presentLoading();
    console.log(payload);
    try {
      const resp = await this.homeService.doTransferToSubscription(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.openLoadingModal('alert');
        //this.investment.balance = +this.investment.balance + +this.depositFromWalletAmount +'';//update the investment balance on the page
        this.subscriptionService.getBalanceSubject().next(true);
        this.doGetInvestmentDetails();
        this.pin = '';
        this.depositFromWalletAmount = '';
      } else if (resp.code == '418') {
        this.pin = '';
        this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
        this.util.showToast(resp.data, 2000, 'danger');
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      this.pin = '';
      this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  public async makeWithdrawalToWallet() {
    const payload = {
      subscription_id: this.investment.id,//this.investment.subscription_id,
      amount: Math.abs(+this.withdrawAmount),
      pin: this.pin,
    };
    this.util.presentLoading();
    console.log(payload);
    try {
      const resp = await this.homeService.withdrawFromInvestment(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.openLoadingModal('alert');
        // this.investment.balance = (+this.investment.balance + +this.histStats.stats.profit_balance) - +this.withdrawAmount +'';//update the investment balance on the page
        this.subscriptionService.getBalanceSubject().next(true);
        this.doGetInvestmentDetails();
        this.pin = '';
        this.withdrawAmount = '';
      } else if (resp.code == '418') {
        this.pin = '';
        this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
        this.util.showToast(resp.data, 2000, 'danger');
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      this.pin = '';
      this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
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
    if (!this.date.from && !this.date.to) {
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
    // this.beneficiary.date_of_birth = 'Date of Birth';
    this.selectDateModal.dismiss();
  }

  public getIconForType(type: string) {
    return historyIcons[type];
  }

  public closeInvestment() {}

  private async doGetInvestmentDetails(){
    try {
      const resp = await this.homeService.getInvestmentHistory(this.investment.id);
      if (resp.code == '100') {
        this.histStats = resp.data;
        console.log(this.histStats);
      }
      else{
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // private async getInvestmentDetailsQuiet() {
  //   const resp = await this.homeService.getInvestmentHistory(inv.id);
  //   console.log('e>> ', resp);
  //   if (resp.code === '100') {
  //     const histStats =  resp.data;
  //   }
  // }
}
