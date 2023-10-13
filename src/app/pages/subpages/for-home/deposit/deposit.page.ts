import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit{

  @ViewChild('selectBankModal') selectBankModal: IonModal;

  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  public backdropActive = false;
  public showLoadingModal: boolean;
  public isSending = false;

  public toastShown = false;
  public subscriber;
  public fromPage: string;
  public depositPageData: any;
  public currency: string;
  public accInfo:any = {};
  public depositAmount: string;
  public fileName = 'Tap to choose';

  public banks = [];
  public selectedBank;
  
  private receipt: File;

  constructor(
    private router: Router,
    public util: UtilService,
    private renderer: Renderer2,
    private loading: LoadingController,
    private homeService: HomeService,
    private uiService: UiService,
    private subService: SubscriptionService) {
    if(this.router.getCurrentNavigation().extras.state){
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.currency = state.currency;
      this.depositPageData = state.data;

      if(this.currency === 'naira'){
        this.banks = state.banks;
        this.selectedBank = state.banks[0];
        this.accInfo.currency_id = 1;
        this.accInfo.id = this.selectedBank.id;
        this.accInfo.account_number = this.selectedBank.account_number;
        this.accInfo.bank_name = this.selectedBank.bank_name;
        this.accInfo.bank_account_name = 'Kwakol Markets Limited';
      }
      else{
        this.accInfo = this.depositPageData.accounts[0];
      }
    }
  }

  ngOnInit() {
    console.log(this.depositPageData);
  }

  public async doTransfer(){
    if(!this.depositAmount) { return this.util.showToast('Please enter a deposit amount', 2500, 'danger'); }
    if(!this.receipt) { return this.util.showToast('Please attach a proof of transfer', 2500, 'danger'); }

    if(this.currency === 'naira' && !this.selectedBank){
      return this.util.showToast('Please select a bank', 2500, 'danger');
    }

    const formData = new FormData();

    const amount = this.depositAmount.replace(/,/g, "");

    formData.append('amount', amount);
    formData.append('proof_of_payment', this.receipt);
    formData.append('bank_id', this.accInfo.id);
    formData.append('currency_id', this.accInfo.currency_id);

    console.log(Array.from(formData.entries()));
    try {
      this.util.presentLoading();
      const resp = this.currency === 'dollar' ? await this.homeService.makeWalletDepositUSD(formData) : await this.homeService.makeWalletDepositNaira(formData);
      console.log(resp);
      this.loading.dismiss();
      if(resp.code == 100){
        this.subService.getBalanceSubject().next(true);
        this.openLoadingModal();
      }
      else{
        this.util.showToast(resp.data, 3000, 'danger');
        return;
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
      error.status === 0 ? 
        this.util.showToast('Please check your network connection...', 3000, 'danger'): '';
        // error.status === 422 ?
        // this.util.showToast('Please', 3000, 'danger'):'';
    }
  }

  public selectBank(bank){
    this.selectBankModal.dismiss();
    console.log(this.selectedBank);
    this.selectedBank = bank;
    this.accInfo.account_number = bank.account_number;
    this.accInfo.bank_name = bank.bank_name;
    this.accInfo.id = bank.id;
  }

  public onFileChange(fileChangeEvent){
    this.receipt = fileChangeEvent.target.files[0];
    this.fileName = this.receipt.name.slice(0,35);
  }

  public openLoadingModal() {
    this.isSending = true;
    setTimeout(() => {
      this.backdropActive = true;
      this.showLoadingModal = true;
    }, 10);
  }

  public closeLoadingModal(doReload: boolean) {
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

}
