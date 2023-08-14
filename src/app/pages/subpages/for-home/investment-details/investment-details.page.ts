import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { investmentIcons } from 'src/app/models/constants';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.page.html',
  styleUrls: ['./investment-details.page.scss'],
})
export class InvestmentDetailsPage implements OnInit {
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  @ViewChild('withdrawToWalletModal') withdrawToWalletModal: IonModal;
  @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;
  @ViewChild('accountStatementModal') accountStatementModal: IonModal;
  // @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;
  @ViewChild('pinEnterModal') pinEnterModal: IonModal;

  public fromPage: string;
  public investment: any;

  public showLoadingModal: boolean;
  public backdropActive = false;
  public loadingModalType: string;

  public inputPinTypePassword = true;
  public pin: string;

  //Segment states
  public activeSegment: string;

  public withdrawAmount: string;
  public date = {
    from: '',
    to: ''
  };

  constructor(
    private router: Router,
    public util: UtilService,
    private subscriptionService: SubscriptionService,
    private loading: LoadingController,
    private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.investment = state.investment;
    }
  }

  ngOnInit() {
    this.activeSegment = 'history';
    console.log('invvv ', this.investment );
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
        this.router.navigateByUrl('/tabs/home');
      }
    }, 100);
  }

  public openEnterWithdrawalAmount() {
    this.closeLoadingModal();
    this.withdrawToWalletModal.present();
  }

  public openEnterPinModal() {
    if (!this.withdrawAmount) {
      this.util.showToast(
        'Kindly enter your withdrawal amount',
        2500,
        'danger'
      );
      return;
    }
    this.withdrawToWalletModal.dismiss();
    this.pinEnterModal.present();
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      this.makeWithdrawalToWallet();
    }
  }

  public makeWithdrawalToWallet() {
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.pinEnterModal.dismiss();
      this.openLoadingModal('alert');
      // this.router.navigateByUrl('/tabs/home');
    }, 1000);
  }


  public openMoreOptionsModal(){
    this.moreOptionsModal.present();
  }

  public requestAccountStatement(){
    this.moreOptionsModal.dismiss();
    this.accountStatementModal.present();
  }

  public openDateModal(type){

  }

  public closeInvestment(){
    
  }
}
