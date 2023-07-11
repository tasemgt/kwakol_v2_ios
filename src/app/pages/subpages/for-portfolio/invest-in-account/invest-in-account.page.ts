import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController, Platform } from '@ionic/angular';
import { investmentIcons } from 'src/app/models/constants';
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
  public balance = '2,200';

  public showLoadingModal: boolean;
  public backdropActive = false;

  public isCustomizeName = false;
  public inputPinTypePassword = true;
  public pin: string;

  constructor(
    private platform: Platform,
    private router: Router,
    public util: UtilService,
    private loading: LoadingController,
    private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.account = state.account;
    }
  }

  ngOnInit() {
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
    if (!this.isCustomizeName) {
      this.isCustomizeName = true;
      return;
    }
    this.continueToPin();
  }

  public leaveCustomName() {
    this.isCustomizeName = false;
  }

  public continueToPin() {
    if (this.isCustomizeName) {
      this.pinEnterModal.present();
    }
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
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
      this.router.navigateByUrl('/tabs/home');
    }, 100);
  }

  private doAddInvestmentAccount() {
    //call api
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.pinEnterModal.dismiss();
      //Call balance refresh
      this.openLoadingModal();
    }, 2000);
  }
}
