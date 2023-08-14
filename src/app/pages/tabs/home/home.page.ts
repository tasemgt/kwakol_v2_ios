import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import {
  historyIcons,
  investmentBGColors,
  investmentIcons,
} from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  //Modals from view
  @ViewChild('pinEnterModal') pinEnterModal: IonModal;
  @ViewChild('transferModal') transferModal: IonModal;
  @ViewChild('transferUserModal') transferUserModal: IonModal;
  @ViewChild('investmentTransferModal') investmentTransferModal: IonModal;
  @ViewChild('doInvestmentTransferModal') doInvestmentTransferModal: IonModal;
  @ViewChild('beneficiaryTransferModal') beneficiaryTransferModal: IonModal;
  @ViewChild('doBeneficiaryTransferModal') doBeneficiaryTransferModal: IonModal;

  @ViewChild('depositModal') depositModal: IonModal;
  @ViewChild('depositNairaModal') depositNairaModal: IonModal;
  @ViewChild('depositDollarModal') depositDollarModal: IonModal;
  @ViewChild('dollarCashDepositModal') dollarCashDepositModal: IonModal;
  @ViewChild('doDepositDollarCashModal') doDepositDollarCashModal: IonModal;

  @ViewChild('withdrawalModal') withdrawalModal: IonModal;
  @ViewChild('withdrawDollarModal') withdrawDollarModal: IonModal;
  @ViewChild('chooseDollarBankAccountModal')
  chooseDollarBankAccountModal: IonModal;
  @ViewChild('dollarCashWithdrawalModal') dollarCashWithdrawalModal: IonModal;
  @ViewChild('pinEnterModalWithdrawal') pinEnterModalWithdrawal: IonModal;

  @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;

  //Loading Modals
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  // @ViewChild('InfoModalDiv') infoModalDiv: ElementRef;

  public balanceIcon: string;
  public showBalance: boolean;

  public showLoadingModal: boolean;
  public backdropActive: boolean;
  public isSending = false;
  public listSpinner = false;

  //Home page data
  public user: User;
  public home: any;
  public wallet: any;
  public investment: any;
  public homeHistories: any[];
  public homeBalance: string;

  public toastShown = false;

  //Segment states
  public childPage;
  public activeSegment: string;
  public percent = 75;

  public showInfoModal: boolean;
  // public infoModalData: any;

  //Transfer to user Modal states
  public usernameOrEmail: string;
  public userToTransferTo: any;

  //Transfer to investment Modal states
  public investmentTransferAmount: string;
  public myInvestments = [];
  public selectedInvestment: any;

  //Transfer to beneficiary Modal states
  public beneficiaryTransferAmount: string;
  public myBeneficiaries = [];
  public selectedBeneficiary: any;

  public typeOfTransfer: string;

  //Deposit Modal states
  public dollarCashAmount: string;
  public dollarQRPageData: any;
  public nairaDepositeModalData: any;

  //Withdrawal Modal states
  public dollarCashWithdrawAmount: string;
  public withdrawCurrentcy: string;
  public myBanks = [];

  public inputTimer: any;
  public inputPinTypePassword = true;
  public pin: string;

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: AuthService,
    public util: UtilService,
    public uiService: UiService,
    private loading: LoadingController,
    private renderer: Renderer2,
    private subService: SubscriptionService,
    private homeService: HomeService
  ) {
    console.log('here');
  }

  ngOnInit(): void {
    this.activeSegment = 'wallet';
    this.showInfoModal = false;

    this.showLoadingModal = false;
    this.backdropActive = false;

    this.usernameOrEmail = '';
    this.pin = '';
    // this.infoModalData = {};

    this.investmentTransferAmount = '';

    this.auth.getAuthStateSubject().subscribe(async (state) => {
      if (state) {
        this.getUser();
        this.getHome();
      }
      const top = await this.loading.getTop();
      if (top) {
        this.loading.dismiss();
        this.goToPage(this.childPage);
      }
    });
    this.subService.getBalanceSubject().subscribe((state) => {
      if (state) {
        this.getHomeQuietly();
      }
    });

    this.homeService.getReopenStateSubject().subscribe((state) => {
      if (state) {
        this.openChooseBankAccountModal(this.withdrawCurrentcy);
      }
    });
  }

  ionViewWillEnter() {
    this.getHomeQuietly();
    this.getTimeOfDay();

    this.balanceIcon = 'eye-open';
    this.showBalance = false;
  }

  public async getUser() {
    this.user = this.dataService.getData(2);
  }

  public getIconForType(type: string) {
    return historyIcons[type];
  }

  public getIconForInvName(inv: string) {
    if (inv) {
      return investmentIcons[inv.toLowerCase()];
    }
  }

  public getColorForInvName(inv: string) {
    if (inv) {
      return investmentBGColors[inv.toLowerCase()];
    }
  }

  public segmentChanged(event) {
    console.log(event.target.value);
    this.activeSegment = event.target.value;
  }

  public async getHome() {
    this.listSpinner = true;
    try {
      const resp = await this.homeService.getHome();
      this.listSpinner = false;
      if (resp.code === '100') {
        this.home = resp.data.home;
        this.wallet = this.home.wallet;
        this.investment = this.home.investment;
        this.homeHistories = this.investment.user_details.transactions;
        this.homeBalance = this.util.numberWithCommas(
          this.investment.total_fund
        );
        console.log(this.home);
        console.log(this.investment);
      }
    } catch (error) {
      // this.listSpinner = false;
      console.log(error);
      if (error.status === 0) {
        !this.toastShown
          ? this.util.showToast(
              'Please check your network connection',
              4000,
              'danger'
            )
          : '';
        this.toastShown = true;
        setTimeout(() => this.getHome(), 10000);
      }
    }
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public goToPage(page: string) {
    this.childPage = page;
    if (!this.home) {
      // this.util.presentLoading('Please wait...');
      return;
    }
    const subscriber = this.home.user_details?.subscriber;
    this.router.navigateByUrl(page, {
      state: { url: this.router.url, subscriber },
    });
  }

  public goToNewAccount() {
    this.moreOptionsModal.dismiss();
    this.getInvestmentAccounts();
  }

  public addInvBalances(inv) {
    let sum: number;
    let rounded: string;
    sum = Number(inv.balance) + Number(inv.profit_balance);
    rounded = sum.toFixed(2);
    return rounded;
  }

  public goToHistorySummary(hist) {
    console.log(hist);
    if (hist.type === 'profit') {
      this.router.navigateByUrl('/history-summary', {
        state: { url: this.router.url, hist },
      });
      return;
    }
  }

  public goToInvestmentDeets(sub) {
    this.router.navigateByUrl('/investment-details', {
      state: { url: this.router.url, sub },
    });
  }

  public doRefresh(event): void {
    this.getHomeQuietly();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public hideShowBalance() {
    console.log('Clicked........');
    this.balanceIcon =
      this.balanceIcon === 'eye-open' ? 'eye-close' : 'eye-open';
    this.showBalance = !this.showBalance;
  }

  public openInfoModal(type, data) {
    this.uiService
      .getInfoStateSubject()
      .next({ active: true, data: { type, data } });
  }

  public getTimeOfDay() {
    return this.util.greetMessage();
  }

  //MODAL FUNCTIONS
  public openTransferModal() {
    this.transferModal.present();
  }

  public openTransferUserModal() {
    this.transferModal.dismiss();
    this.transferUserModal.present();
  }

  public async goToTransferUserPage(
    quickTransfer: boolean,
    usernameOrEmail?: string
  ) {
    if (quickTransfer) {
      this.util.presentLoading();
      const resp = await this.getUserToTransferTo(usernameOrEmail);
      this.loading.dismiss();
      this.handleGoToDoTransferPage();
      return;
    } else if (!this.userToTransferTo) {
      return;
    }
    this.handleGoToDoTransferPage();
  }

  public handleGoToDoTransferPage() {
    this.usernameOrEmail = '';
    this.transferUserModal.dismiss();
    this.router.navigateByUrl('/wallet-transfer-user', {
      state: {
        user: this.userToTransferTo,
        url: this.router.url,
        walletBalance: this.wallet.balance,
      },
    });
    setTimeout(() => (this.userToTransferTo = null), 200);
  }

  public onUsernameEmailInputChange(usernameOrEmail: string) {
    if (usernameOrEmail.length <= 3) {
      return;
    }
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.getUserToTransferTo(usernameOrEmail);
    }, 2000);
  }

  public async getUserToTransferTo(usernameOrEmail: string) {
    if (!usernameOrEmail) {
      return;
    }
    try {
      const resp = await this.homeService.initiateTransferToUser(
        usernameOrEmail
      );
      if (resp.code === '100') {
        console.log(resp.data);
        this.userToTransferTo = resp.data;
      } else if (resp.code === '418') {
        this.util.showToast(
          `Cannot find a user with ${usernameOrEmail}`,
          3000,
          'danger'
        );
      }
      return resp;
    } catch (error) {
      console.log(error);
    }
  }

  public async openTransferInvestmentModal() {
    //Fetch investments from server
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getSubscriptions();
      // this.listSpinner = false;
      this.loading.dismiss();
      this.transferModal.dismiss();
      // this.listSpinner = true;
      if (resp.code == 100) {
        this.myInvestments = resp.data;
      }
      if (this.myInvestments.length <= 1) {
        this.investmentTransferModal.initialBreakpoint = 0.3; //If no investment
      }
    } catch (err) {
      this.loading.dismiss();
      console.log(err);
    }
    this.investmentTransferModal.present();
    this.investmentTransferModal
      .onWillDismiss()
      .then(() => (this.myInvestments = []));
  }

  public openDoTransferInvestmentModal(selectedInvestment) {
    this.selectedInvestment = selectedInvestment;
    this.investmentTransferModal.dismiss();
    this.doInvestmentTransferModal.present();
  }

  public async openTransferBeneficiaryModal() {
    //Fetch investments from server
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getBeneficiaries();
      // this.listSpinner = false;
      this.loading.dismiss();
      this.transferModal.dismiss();
      // this.listSpinner = true;
      if (resp.code == 100) {
        this.myBeneficiaries = resp.data;
      }
      if (this.myBeneficiaries.length <= 1) {
        this.investmentTransferModal.initialBreakpoint = 0.3; //If no investment
      }
    } catch (err) {
      this.loading.dismiss();
      console.log(err);
    }
    this.beneficiaryTransferModal.present();
    this.beneficiaryTransferModal
      .onWillDismiss()
      .then(() => (this.myBeneficiaries = []));
  }

  public openDoTransferBeneficiaryModal(selectedBeneficiary) {
    this.selectedBeneficiary = selectedBeneficiary;
    this.beneficiaryTransferModal.dismiss();
    this.doBeneficiaryTransferModal.present();
  }

  public makeInvestmentOrBeneficiaryTransfer(type: string) {
    if (type === 'investment') {
      this.doInvestmentTransferModal.dismiss();
    } else {
      this.doBeneficiaryTransferModal.dismiss();
    }
    this.typeOfTransfer = type;
    this.pinEnterModal.present();
    //Clear pin value for accidental modal close
    this.pinEnterModal.onWillDismiss().then((data) => {
      this.pin = '';
    });
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      this.typeOfTransfer === 'investment'
        ? this.doTransferInvestmentFunds()
        : this.doTransferBeneficiaryFunds();
    }
  }

  //DEPOST AREA
  public openDepositModal() {
    this.depositModal.present();
  }

  public async openCurrencyDepositModal(type) {
    if (type === 'naira') {
      //Naira
      const payload = {
        currency: 'NGN',
        type: 'CASH',
        amount: 100, //test amount...
      };
      this.util.presentLoading();
      try {
        const resp = await this.homeService.initiateWalletDeposit(payload);
        this.loading.dismiss();
        this.depositModal.dismiss();
        this.depositNairaModal.present();
        if (resp.code == 100) {
          console.log(resp.data);
          this.nairaDepositeModalData = resp.data;
        }
      } catch (error) {
        this.loading.dismiss();
        console.log(error);
        this.util.showToast('An error occurred.', 2000, 'danger');
      }
    } else {
      //Dollar
      this.depositModal.dismiss();
      this.depositDollarModal.present();
    }
  }

  public openDollarCashDepositModal() {
    this.depositDollarModal.dismiss();
    this.dollarCashDepositModal.present();
  }

  //For Dollar Deposit based on Cash
  public makeDollarCashDeposit() {
    if (!this.dollarCashAmount) {
      this.util.showToast('Please enter a cash amount', 2500, 'danger');
      return;
    }
    const payload = {
      currency: 'USD',
      type: 'CASH',
      amount: this.dollarCashAmount,
    };

    this.doInitialDollarDeposit(payload, payload.type);
  }

  //For Dollar Deposit based on Bank Transfer
  public async goToDepositDollarBankTransferPage() {
    const payload = {
      currency: 'USD',
      type: 'TRANSFER',
    };
    this.doInitialDollarDeposit(payload, payload.type);
  }

  ////////////////////WITHDRAWAL AREA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  public openWithdrawalModal() {
    this.withdrawalModal.present();
  }

  public openCurrencyWithdrawalModal(type) {
    if (type === 'naira') {
      this.withdrawalModal.dismiss();
      this.openChooseBankAccountModal('NGN');
    } else {
      //Dollar
      this.withdrawalModal.dismiss();
      this.withdrawDollarModal.present();
    }
  }

  public openDollarCashWithdrawalModal() {
    this.withdrawDollarModal.dismiss();
    this.dollarCashWithdrawalModal.present();
  }

  public async openChooseBankAccountModal(type: string) {
    this.withdrawCurrentcy = type;
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getMyBanks();
      this.loading.dismiss();
      if (resp.code == 100) {
        console.log(resp.data);
        if (this.withdrawCurrentcy === 'NGN') {
          this.myBanks = resp.data.naira;
        } else {
          //USD
          this.myBanks = resp.data.dollar;
          this.withdrawDollarModal.dismiss();
        }
        if(this.myBanks.length <= 1){
          this.chooseDollarBankAccountModal.initialBreakpoint = 0.3;
        }
        else{
          this.chooseDollarBankAccountModal.initialBreakpoint = 0.4;
        }
        this.chooseDollarBankAccountModal.present();
      }
    } catch (e) {
      this.loading.dismiss();
      this.util.showToast('Please try again', 2000, 'danger');
      console.log(e);
    }
  }

  public goToAddBank(type) {
    this.chooseDollarBankAccountModal.dismiss();
    this.router.navigateByUrl('/add-bank', {
      state: { url: this.router.url, type },
    });
  }

  public makeDollarCashWithdrawal() {
    if (!this.dollarCashWithdrawAmount) {
      this.util.showToast('Please enter a withdrawal amount', 2500, 'danger');
      return;
    }
    this.dollarCashWithdrawalModal.dismiss();
    this.pinEnterModalWithdrawal.present();
    //Clear pin value for accidental modal close
    this.pinEnterModalWithdrawal.onWillDismiss().then((data) => {
      this.pin = '';
    });
  }

  public onWithdrawalPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      this.util.presentLoading();
      //Call withdraw api here
      this.doWalletWithdrawal();
    }
  }

  // public openDollarBankTransferWithdrawalModal(){
  //   this.withdrawDollarModal.dismiss();
  //   this.dollarCashDepositModal.present();
  // }

  // INVESTMENTS SEGMENT AREA //

  public openMoreOptionsModal() {
    this.moreOptionsModal.present();
  }

  public async goToBeneficiariesPage() {
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getBeneficiaries();
      this.loading.dismiss();
      if (resp.code == 100) {
        this.myBeneficiaries = resp.data;
        console.log(this.myBeneficiaries);
        this.moreOptionsModal.dismiss();
        this.router.navigateByUrl('/beneficiaries', {
          state: { url: this.router.url, beneficiaries: this.myBeneficiaries },
        });
      }
    } catch (e) {
      this.loading.dismiss();
      this.util.showToast('Please try again', 2000, 'danger');
      console.log(e);
    }
  }

  public openInvestementDetailsPage(inv) {
    //Fetch investment from api
    this.router.navigateByUrl('/investment-details', {
      state: { url: this.router.url, investment: inv },
    });
  }

  // PRIVATES!!
  private async getHomeQuietly() {
    const resp = await this.homeService.getHome();
    console.log('Stubborn home response>> ', resp);
    if (resp.code === '100') {
      this.home = resp.data.home;
      console.log('Stubborn home>> ', this.home);
      this.wallet = this.home.wallet;
      this.investment = this.home.investment;
      this.homeHistories = this.investment.user_details.transactions;
      this.homeBalance = this.util.numberWithCommas(this.investment.total_fund);
    }
  }

  private async getInvestmentAccounts() {
    // this.router.navigateByUrl('/new-account', {
    //   state: { url: this.router.url },
    // });
    this.util.presentLoading();
    try {
      const resp = await this.subService.getInvestmentAccounts();
      this.loading.dismiss();
      if (resp.code === '100') {
        const invAccounts = resp.data.subscriptions;
        this.router.navigateByUrl('/new-account', {
          state: { url: this.router.url, accounts: invAccounts },
        });
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
    }
  }

  private async doTransferInvestmentFunds() {
    if (!this.pin) {
      return;
    }
    if (!this.investmentTransferAmount) {
      return;
    }
    const payload = {
      pin: this.pin,
      subscription_id: this.selectedInvestment.subscription_id,
      amount: this.investmentTransferAmount,
    };
    this.util.presentLoading();
    console.log(payload);
    // setTimeout(() => {
    //   this.loading.dismiss();
    //   this.uiService.getLoadingStateSubject().next(true);
    //   // this.isSending =false;
    // }, 1000);
    try {
      const resp = await this.homeService.doTransferToSubscription(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.uiService
          .getLoadingStateSubject()
          .next({ active: true, data: { type: 'deposit', data: {} } });
        this.subService.getBalanceSubject().next(true);
        this.pin = '';
        this.investmentTransferAmount = '';
        this.selectedInvestment = null;
        // this.isSending =false;
      } else if (resp.code == '418') {
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      // this.closeLoadingModal(false);
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  private async doTransferBeneficiaryFunds() {
    if (!this.pin) {
      return;
    }
    if (!this.beneficiaryTransferAmount) {
      return;
    }
    const payload = {
      pin: this.pin,
      // subscription: '',
      amount: this.beneficiaryTransferAmount,
      beneficiary_id: this.selectedBeneficiary.beneficiary_id,
    };

    // this.pin = '';
    // this.beneficiaryTransferAmount = '';
    this.util.presentLoading();
    console.log(payload);
    try {
      const resp = await this.homeService.doTransferToBeneficiary(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.uiService
          .getLoadingStateSubject()
          .next({ active: true, data: { type: 'deposit', data: {} } });
        this.subService.getBalanceSubject().next(true);
        this.pin = '';
        this.beneficiaryTransferAmount = '';
        this.selectedBeneficiary = null;
      } else if (resp.code == '418') {
        console.log(resp);
      }
    } catch (error) {
      this.loading.dismiss();
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  //Gets initial payment account or qr ref code for dollar deposits
  private async doInitialDollarDeposit(payload, type) {
    this.util.presentLoading();
    try {
      const resp = await this.homeService.initiateWalletDeposit(payload);
      this.loading.dismiss();
      if (resp.code == 100) {
        if (type === 'CASH') {
          console.log(resp.data.transaction);
          this.dollarQRPageData = resp.data.transaction;
          this.dollarCashDepositModal.dismiss(); //Dismiss cash modal if present
          this.depositDollarModal.dismiss(); //Dismiss first dollar modal if present
          this.doDepositDollarCashModal.present(); //Present QR Page for cash payments
          return;
        }

        //Go to dollar transfer and upload receipt page for type = 'TRANSFER'
        this.depositDollarModal.dismiss(); //Dismiss first dollar modal if present
        this.router.navigateByUrl('/deposit', {
          state: { url: this.router.url, data: resp.data },
        });
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
    }
  }

  private doWalletWithdrawal() {
    setTimeout(() => {
      this.loading.dismiss();
      this.pinEnterModalWithdrawal.dismiss();
      this.uiService
        .getLoadingStateSubject()
        .next({ active: true, data: { type: 'withdraw', data: {} } });
    }, 1500);
  }
}
