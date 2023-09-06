import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController, NavController } from '@ionic/angular';
import { HomeService } from 'src/app/services/home.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.page.html',
  styleUrls: ['./add-bank.page.scss'],
})
export class AddBankPage implements OnInit {

  @ViewChild('pinEnterModal') pinEnterModal: IonModal;
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  public fromPage: string;
  public type: string;

  public accountName: '';
  public accountNumber: '';
  public bankName: '';
  public sortCode: '';
  public swiftCode: '';
  public bankAddress: '';

  public showLoadingModal: boolean;
  public backdropActive = false;
  public loadingModalType: string;

  public pin: string;
  public inputPinTypePassword = true;

  constructor(
    private router: Router,
    private navController: NavController,
    private util: UtilService,
    private uiService: UiService,
    private homeService: HomeService,
    private loading: LoadingController,
    private renderer: Renderer2
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.type = state.type;
    }
  }

  ngOnInit() {
    this.pin = '';
  }

  public goBack(){
    this.navController.setDirection('back');
    this.router.navigateByUrl(this.fromPage);
    this.homeService.getReopenStateSubject().next(true);
  }

  public openPinModal() {
    this.pinEnterModal.present();
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      this.doCreateBank();
    }
  }

  public openLoadingModal(type: string) {
    this.pin = '';
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
      this.goBack(); //Close page and reopen choose dollar account modal
    }, 100);
  }

  public doAddBank(){
    if(!this.accountName || !this.accountNumber || !this.bankName){
      this.util.showToast('Kindly ensure you fill in all fields', 3000, 'danger');
      return;
    }
    if(this.type === 'USD'){
      if(!this.sortCode || !this.swiftCode || !this.bankAddress){
        this.util.showToast('Kindly ensure you fill in all fields..', 3000, 'danger');
        return;
      }
    }
    this.openPinModal();
  }

  private async doCreateBank() {
    const payload = {
      currency: this.type.toUpperCase(),
      bank_name: this.bankName,
      bank_account_name: this.accountName,
      account_number: this.accountNumber,
      swift_code: this.swiftCode,
      sort_code: this.sortCode,
      branch: this.bankName,
      branch_address: this.bankAddress,
      pin: this.pin
    };

    console.log(payload);
    this.util.presentLoading();
    // setTimeout(() =>{
    //   this.loading.dismiss();
    //   this.pinEnterModal.dismiss();
    //   this.openLoadingModal('alert');
    // },1000);
    try {
      const resp = await this.homeService.createBank(payload);
      console.log(resp);
      this.loading.dismiss();
      if (resp.code == 100) {
        this.pinEnterModal.dismiss();
        this.pin = '';
        this.openLoadingModal('alert');
      } else {
        this.util.showToast(resp.data, 2000, 'danger');
      }
    } catch (err) {
      console.log(err);
      this.loading.dismiss();
      this.pin = '';
      this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
      this.util.showToast(err.error.message, 2000, 'danger');
    }
  }

}
