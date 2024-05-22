import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController, Platform } from '@ionic/angular';
import { investmentIcons } from 'src/app/models/constants';
import { Beneficiary } from 'src/app/models/user';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-invest-in-account',
  templateUrl: './invest-in-account.page.html',
  styleUrls: ['./invest-in-account.page.scss'],
})
export class InvestInAccountPage implements OnInit {
  @ViewChild('pinEnterModal') pinEnterModal: IonModal;
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  public floatUp: boolean;
  public keyboardHeight: number;

  public fromPage: string;
  public account;
  public ammount: string;
  public customName: string;
  public balance : string;

  public showLoadingModal: boolean;
  public backdropActive = false;

  public isCustomizeName = false;
  public inputPinTypePassword = true;
  public pin: string;
  public beneficiary: Beneficiary;

  constructor(
    private platform: Platform,
    private router: Router,
    private homeService: HomeService,
    private subscriptionService: SubscriptionService,
    public util: UtilService,
    private loading: LoadingController,
    private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.account = state.account;
      this.beneficiary = state.beneficiary;
      this.balance = state.balance || homeService.getWalletBallance();
    }
  }

  ngOnInit() {
    console.log(this.beneficiary);
    console.log(this.account);
    this.platform.keyboardDidShow.subscribe((ev) => {
      const { keyboardHeight } = ev;
      this.keyboardHeight = keyboardHeight;
      this.floatUp = true;
    });

    this.platform.keyboardDidHide.subscribe(() => {
      this.floatUp = false;
    });
  }

  public footerStyles() {
    if (this.floatUp) {
      return { bottom: this.keyboardHeight + 50 + 'px' };
    } else {
      return { bottom: 1.5 + 'rem' };
    }
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public getIconForInvName(inv: string) {
    if (inv) {
      return investmentIcons[inv.toLowerCase()];
    }
    return '';
  }

  public continueToCustomize() {
    if (!this.ammount) {
      this.util.showToast('A subscription amount is required.', 2500, 'danger');
      return;
    }
    if (!this.isCustomizeName && !this.beneficiary) {
      //If we are still in amount entry and it isnt beneficiary creation
      this.isCustomizeName = true;
      return;
    }
    //We have added custom name or its beneficiary adding...
    if(this.isCustomizeName && !this.beneficiary && !this.customName){
      this.util.showToast('A custom name is required.', 2500, 'danger');
      return;
    }
    this.continueToPin();
  }

  public leaveCustomName() {
    this.isCustomizeName = false;
  }

  public continueToPin() {
    if (this.isCustomizeName || this.beneficiary) {
      this.pinEnterModal.present();
    }
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      if (this.beneficiary) {
        // If Beneficiary exists for creation
        this.doCreateBeneficiaryAccount();
        return;
      }
      this.doAddInvestmentAccount();
    }
  }

  public openLoadingModal() {
    this.pin = '';
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
      this.subscriptionService.getBalanceSubject().next(true);
      this.router.navigateByUrl('/tabs/home');
    }, 100);
  }

  private async doCreateBeneficiaryAccount() {
    const payload = {
      name: `${this.beneficiary.firstname.trim()} ${this.beneficiary.lastname.trim()}`,
      subscription: this.account.id,
      amount: Math.abs(+this.ammount.trim()),
      pin: this.pin,
    };
    console.log(payload);
    this.util.presentLoading();
    try {
      const resp = await this.homeService.createBeneficiary(payload);
      console.log(resp);
      this.loading.dismiss();
      if (resp.code == 100) {
        this.pinEnterModal.dismiss();
        //Call balance refresh
        this.openLoadingModal();
      } else {
        this.util.showToast(resp.message, 2000, 'danger');
      }
    } catch (err) {
      console.log(err);
      this.loading.dismiss();
      this.util.showToast(err.error.message, 2000, 'danger');
    }
  }

  private async doAddInvestmentAccount() {
    const payload = {
      custom_name: this.customName,
      subscription: `${this.account.id}`,
      pin: this.pin,
      amount: Math.abs(+this.ammount),
    };
    console.log(payload);
    this.util.presentLoading();
    try {
      const resp = await this.subscriptionService.createInvestmentAccount(payload);
      console.log(resp);
      this.loading.dismiss();
      if (resp.code == 100) {
        this.pinEnterModal.dismiss();
        //Call balance refresh
        this.openLoadingModal();
      } else {
        this.util.showToast(resp.message, 2000, 'danger');
      }
    } catch (err) {
      console.log(err);
      this.loading.dismiss();
      const keys = Object.keys(err.error.errors);
      // console.log(keys.length);
      this.util.showToast(err.error.errors[keys[0]], 3000, 'danger');
    }
  }
}
