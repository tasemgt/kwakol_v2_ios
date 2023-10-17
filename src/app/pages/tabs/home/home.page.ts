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
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HistoryService } from 'src/app/services/history.service';
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
  @ViewChild('chooseDollarBankAccountModal') chooseDollarBankAccountModal: IonModal;
  @ViewChild('dollarAndNairaWithdrawalModal') dollarAndNairaWithdrawalModal: IonModal;
  @ViewChild('withdrawalInvestmentModal') withdrawalInvestmentModal: IonModal;
  @ViewChild('pinEnterModalWithdrawal') pinEnterModalWithdrawal: IonModal;
  @ViewChild('moreOptionsModal') moreOptionsModal: IonModal;

  
  //Amount Inputs
  @ViewChild('dollarAndNairaWithdrawalModalRef') dollarAndNairaWithdrawalModalRef: ElementRef;
  @ViewChild('doInvestmentTransferRef') doInvestmentTransferRef: ElementRef;
  @ViewChild('doBeneficiaryTransferRef') doBeneficiaryTransferRef: ElementRef;
  @ViewChild('doUserTransferRef') doUserTransferRef: ElementRef;
  @ViewChild('dollarCashDepositRef') dollarCashDepositRef: ElementRef;
  @ViewChild('withdrawalInvestmentRef') withdrawalInvestmentRef: ElementRef;

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
  public dailyRate: string;
  public wallet: any;
  public investment: any;
  public homeHistories: any[];
  public homeBalance: string;

  public toastShown = false;

  //Segment states
  public childPage;
  public activeSegment: string;
  public percent: number;
  public canWithdrawUSD: boolean;

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
  public dollarOrNairaWithdrawAmount: string;
  public nairaWithdrawEquivalentAmount: string;
  public withdrawCurrentcy: string;
  public typeOfWithdrawal: string;
  public withdrawalInvestmentAmount: string;
  public isInvestmentWithdrawal: boolean;
  public myBanks = [];
  public selectedBank = null;

  public inputTimer: any;
  public inputPinTypePassword = true;
  public pin: string;

  constructor(
    private keyboard: Keyboard,
    private vibration: Vibration,
    private social: SocialSharing,
    private router: Router,
    private dataService: DataService,
    private auth: AuthService,
    public util: UtilService,
    public uiService: UiService,
    private loading: LoadingController,
    private renderer: Renderer2,
    private historyService: HistoryService,
    private subService: SubscriptionService,
    private homeService: HomeService
  ) {
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

    //This repopens select bank modal once the add form page closes
    this.homeService.getReopenStateSubject().subscribe((state) => {
      if (state) {
        this.openChooseBankAccountModal(this.withdrawCurrentcy);
      }
    });

    //This opens a modal as directed from another page via the ui service (tabs page in this case)
    this.uiService.getinstructHomeStateStateSubject().subscribe((state) => {
      if (state) {
        // True to denote that this opens investment list modals for withdrawal and not deposit or transfer
        this.openTransferInvestmentModal(true);
      }
    });

    //This opens deposit modal here from history page
    this.historyService.getDoHomeActionSubject().subscribe((state) => {
      if (state) {
        console.log('Opening eposit');
        this.openDepositModal();
      }
    });
  }

  ionViewWillEnter() {
    this.getHomeQuietly();
    this.getTimeOfDay();

    this.balanceIcon = 'eye-close';
    this.showBalance = true;
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
        this.homeService.setWalletBallance(this.wallet.balance);
        this.dailyRate = this.home.daily_rate.split('₦')[1];
        console.log(this.home);
        console.log(this.investment);
        this.percent = this.home.verified_kyc ? (this.home.verified_kyc.toLowerCase() === 'pending' ? 95 : this.home.verified_kyc.toLowerCase() === 'no'? 25: 75):75;
        this.canWithdrawUSD = this.home.can_withdraw_usd_cash;
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

  public async openShareToSocials(){
    const message = `Account Name: ${this.nairaDepositeModalData.accounts.account_name}
Account Number: ${this.nairaDepositeModalData.accounts.account_number}
Bank Name: ${this.nairaDepositeModalData.accounts.bank_Name}
Rate: ${this.home.daily_rate}`;

    const options = {
      message,
      chooserTitle: 'Pick an app',
      // iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };

    try {
      const result = await this.social.shareWithOptions(options);
      console.log("Share completed? " + result.completed);
      console.log("Share to app: " + result.app);
    }
    catch (error) {
      console.log("Sharing failed with message: " + error);
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

  public goToProfilePage(){
    this.router.navigateByUrl('/tabs/profile', {state:{url: this.router.url}});
  }

  public goToNewAccount() {
    this.moreOptionsModal.dismiss();
    this.investmentTransferModal.dismiss(); //If investment transfer modal is open.
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

  public doRefresh(event): void {
    this.getHomeQuietly();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public hideShowBalance() {
    console.log('Clicked........');
    // this.util.showToast('fdlnjbkjnkjnjkngmjdgjdnkjngkjdng', 3000000, 'danger');
    this.balanceIcon =
      this.balanceIcon === 'eye-open' ? 'eye-close' : 'eye-open';
    this.showBalance = !this.showBalance;
  }

  public goToHistory(activeSegment){
    this.historyService.getActiveSegmentSubject().next(activeSegment);
    this.router.navigateByUrl('/tabs/history');
  }

  public openInfoModal(type, data, fromWallet) {
    data.fromWallet = fromWallet;
    if(type === 'bonus'){
      return;
    }
    this.uiService
      .getInfoStateSubject()
      .next({ active: true, data: { type, data } });
  }

  public getTimeOfDay() {
    return this.util.greetMessage();
  }

  public openDepositModalFromInvestmentsTab(){
    this.activeSegment = 'wallet';
    this.openDepositModal();
  }

  public goToKYC(){
    if(!this.home.verified_kyc || this.home.verified_kyc.toLowerCase() === 'redo'){
      this.router.navigateByUrl('/kyc', {state: {url: this.router.url, data: this.user, kycVerified: this.home.verified_kyc.toLowerCase()}});
      return;
    }
    else if(this.home.verified_kyc.toLowerCase() === 'pending'){
      this.uiService.getLoadingStateSubject().next({active: true, data: {type: 'pending', data: null}});
    }
    else if(this.home.verified_kyc.toLowerCase() === 'no'){
      this.uiService.getLoadingStateSubject().next({active: true, data: {type: 'no', data: null}});
    }
  }

  //MODAL FUNCTIONS
  public openTransferModal() {
    this.transferModal.present();
  }

  public async openTransferUserModal() {
    this.transferModal.dismiss();
    await this.transferUserModal.present();
    if(this.doUserTransferRef?.nativeElement){
      this.doUserTransferRef.nativeElement.focus();
      this.keyboard.show();
    }
  }

  public async goToTransferUserPage(
    quickTransfer: boolean,
    usernameOrEmail?: string
  ) {
    if (quickTransfer) {
      this.util.presentLoading();
      const resp = await this.getUserToTransferTo(usernameOrEmail);
      console.log(usernameOrEmail);
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

  public async openTransferInvestmentModal(isWithdrawal) {
    this.isInvestmentWithdrawal = isWithdrawal;
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
        this.myInvestments = this.myInvestments.filter((inv) => inv.status === 'active'); //return and display only active investments
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

  public async openDoTransferInvestmentModal(selectedInvestment) {
    this.selectedInvestment = selectedInvestment;
    this.investmentTransferModal.dismiss();
    if(this.isInvestmentWithdrawal){
      await this.withdrawalInvestmentModal.present();
      if(this.withdrawalInvestmentRef?.nativeElement){
        this.withdrawalInvestmentRef.nativeElement.focus();
        this.keyboard.show();
      }
    }
    else{
      await this.doInvestmentTransferModal.present();
      if(this.doInvestmentTransferRef?.nativeElement){
        this.doInvestmentTransferRef.nativeElement.focus();
        this.keyboard.show();
      }
    }
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
        this.beneficiaryTransferModal.initialBreakpoint = 0.3; //If no beneficiary
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

  public async openDoTransferBeneficiaryModal(selectedBeneficiary) {
    this.selectedBeneficiary = selectedBeneficiary;
    this.beneficiaryTransferModal.dismiss();
    await this.doBeneficiaryTransferModal.present();
    if(this.doBeneficiaryTransferRef?.nativeElement){
      this.doBeneficiaryTransferRef.nativeElement.focus();
      this.keyboard.show();
    }
  }

  public makeInvestmentOrBeneficiaryTransfer(type: string) {
    if (type === 'investment') {
      if(this.isInvestmentWithdrawal){
        //Investment withdrawal section
        if(!this.withdrawalInvestmentAmount){
          this.util.showToast('Kindly input a withdrawal amount.', 2500, 'danger');
          return;
        }
        this.withdrawalInvestmentModal.dismiss();
      }
      else{
        //Investment transfer section
        if(!this.investmentTransferAmount){
          this.util.showToast('Kindly input a transfer amount.', 2500, 'danger');
          return;
        }
        this.doInvestmentTransferModal.dismiss();
      }
    } 
    else{
      //For beneficiary
      if(!this.beneficiaryTransferAmount){
        this.util.showToast('Kindly input a transfer amount.', 2500, 'danger');
        return;
      }
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
      if(this.typeOfTransfer === 'investment'){
        if(this.isInvestmentWithdrawal){
          this.makeInvestmentWithdrawal();
          return;
        }
        this.doTransferInvestmentFunds();
      }
      else{
        this.doTransferBeneficiaryFunds();
      }
    }
  }

  //DEPOST AREA
  public openDepositModal() {
    this.depositModal.present();
    // this.vibration.vibrate(500);
  }

  public async openCurrencyDepositModal(type) {
    if (type === 'naira') {
      //Naira
      const payload = {
        currency: 'NGN',
        type: 'CASH',
        amount: 100, //test amount...
      };

      const banks = [
        {id: 3, bank_name: 'Jaiz Bank', account_number: '0012117943', selected: true},
        {id: 4, bank_name: 'United Bank of Africa', account_number: '1485609290', selected: false},
        {id: 5, bank_name: 'Guarantee Trust Bank', account_number: '0725652204', selected: false},
        {id: 6, bank_name: 'Wema Bank', account_number: '7810599277', selected: false},
        {id: 7, bank_name: 'Access Bank', account_number: '1485609290', selected: false}
      ];

      this.util.presentLoading();
      setTimeout(() => {
        this.loading.dismiss();
        this.depositModal.dismiss();
        this.router.navigateByUrl('/deposit', {
          state: { url: this.router.url, banks, currency: 'naira' },
        });
      }, 200);
      // try {
      //   const resp = await this.homeService.initiateWalletDeposit(payload);
      //   this.loading.dismiss();
      //   // this.depositNairaModal.present();
      //   // if (resp.code == 100) {
      //   //   console.log(resp.data);
      //   //   this.nairaDepositeModalData = resp.data;
      //   // }
      // } catch (error) {
      //   this.loading.dismiss();
      //   console.log(error);
      //   this.util.showToast('An error occurred.', 2000, 'danger');
      // }
    } else {
      //Dollar
      this.depositModal.dismiss();
      this.depositDollarModal.present();
    }
  }

  public async openDollarCashDepositModal() {
    this.depositDollarModal.dismiss();
    await this.dollarCashDepositModal.present();
    if(this.dollarCashDepositRef?.nativeElement){
      this.dollarCashDepositRef.nativeElement.focus();
      this.keyboard.show();
    }
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

  public async openDollarAndNairaWithdrawalModal(type: string, bank?) {
    if(!this.canWithdrawUSD){
      this.util.showToast('This feature requires an active investment.', 2500, 'danger');
      return;
    }
    this.typeOfWithdrawal = type;
    if(type === 'cash'){
      //Check if dollar selection is cash to ensure withdraw currency is set to USD
      this.withdrawCurrentcy = 'USD';
    }
    this.selectedBank = bank;
    this.withdrawDollarModal.dismiss();
    await this.dollarAndNairaWithdrawalModal.present();
    if(this.dollarAndNairaWithdrawalModalRef?.nativeElement){
      this.dollarAndNairaWithdrawalModalRef.nativeElement.focus();
      this.keyboard.show();
    }
  }

  public async openChooseBankAccountModal(type: string) {
    this.withdrawCurrentcy = type;
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getMyBanks();
      this.loading.dismiss();
      if (resp.code == 100) {
        console.log(resp.data, this.withdrawCurrentcy);
        if(!resp.data){
          this.chooseDollarBankAccountModal.initialBreakpoint = 0.3;
          this.chooseDollarBankAccountModal.present();
          return;
        }
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
        //More like choose any account number ngn or usd
        this.chooseDollarBankAccountModal.present();
      }
    } catch (e) {
      this.loading.dismiss();
      this.util.showToast('Please try again', 2000, 'danger');
      console.log(e);
    }
  }

  //Go to Add Bank Page
  public goToAddBank(type) {
    this.chooseDollarBankAccountModal.dismiss();
    this.router.navigateByUrl('/add-bank', {
      state: { url: this.router.url, type },
    });
  }


  //Input withdraw amount and proceed to enter pin to authorize
  public makeDollarCashWithdrawal() {
    if (!this.dollarOrNairaWithdrawAmount) {
      this.util.showToast('Please enter a withdrawal amount', 2500, 'danger');
      return;
    }
    console.log(this.home.daily_rate_withdrawal_raw )
    const nairaEquiv = (+this.home.daily_rate_withdrawal_raw * +this.dollarOrNairaWithdrawAmount).toFixed(2);
    this.nairaWithdrawEquivalentAmount = nairaEquiv + '';
    this.dollarAndNairaWithdrawalModal.dismiss();
    this.pinEnterModalWithdrawal.present();
    // Clear pin value for accidental modal close
    this.pinEnterModalWithdrawal.onWillDismiss().then((data) => {
      this.pin = '';
      this.dollarOrNairaWithdrawAmount = '';
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




  ////////////////// INVESTMENTS SEGMENT AREA //////////////////////////

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

  public async openInvestementDetailsPage(inv) {

    //Check if investment is active first

    if(inv.status !== 'active'){
      this.uiService
          .getLoadingStateSubject()
          .next({ active: true, data: { type: 'inactive', data: { plan: inv.subscription.name }} });
      return;
    }

    //Fetch investment histry from api
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getInvestmentHistory(inv.id);
      this.loading.dismiss();
      if (resp.code == '100') {
        this.router.navigateByUrl('/investment-details', {
          state: { url: this.router.url, investment: inv, walletBal: this.home.wallet.balance, histStats: resp.data }
        });
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  public startInvestmentWithdrawal(){
    this.uiService.getLoadingStateSubject().next({active: true, data: {type: 'confirm', data: {}}});
  }

  //This makes a withdrawal from subscription into wallet
  public async makeInvestmentWithdrawal(){
    const payload = {
      subscription_id: this.selectedInvestment.subscription_id,
      amount: this.withdrawalInvestmentAmount,
      pin: this.pin
    };
    this.util.presentLoading();
    console.log(payload);
    try {
      const resp = await this.homeService.withdrawFromInvestment(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        console.log(resp.message);
        this.pinEnterModal.dismiss();
        this.uiService
          .getLoadingStateSubject()
          .next({ active: true, data: { type: 'withdraw', data: {} } });
        this.subService.getBalanceSubject().next(true);
        this.pin = '';
        this.withdrawalInvestmentAmount = '';
        this.selectedInvestment = null;
        // this.isSending =false;
      } else if (resp.code == '418') {
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


  public goToCreateBeneficiaryPage(){
    this.beneficiaryTransferModal.dismiss();
    this.router.navigateByUrl('/create-beneficiary', {state: {url: this.router.url }});
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
      this.homeService.setWalletBallance(this.wallet.balance);
      this.percent = this.home.verified_kyc ? (this.home.verified_kyc.toLowerCase() === 'pending' ? 95 : this.home.verified_kyc.toLowerCase() === 'no'? 25: 75): 75;
      this.canWithdrawUSD = this.home.can_withdraw_usd_cash;
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
          state: { url: this.router.url, accounts: invAccounts, balance: this.home.wallet.balance },
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
      this.pin = '';
      this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
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
      this.pin = '';
      this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
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
          state: { url: this.router.url, data: resp.data, currency: 'dollar' },
        });
      }
    } catch (error) {
      console.log(error);
      this.loading.dismiss();
    }
  }

  //Calls the wallet withdrawal api to finish withdrawal process
  private async doWalletWithdrawal() {
    const payload = {
      amount: this.dollarOrNairaWithdrawAmount,
      exchange_rate: this.dailyRate,
      bank_account_id: this.selectedBank?.id || '1', // '1' for dollar cash so api doesn't break
      type: this.typeOfWithdrawal,
      pin: this.pin
    };
    console.log(payload);
    try {
      const resp = await this.homeService.withdrawFromWallet(payload);
      this.loading.dismiss();
      if (resp.code == '100') {
        this.pinEnterModalWithdrawal.dismiss();
        this.chooseDollarBankAccountModal.dismiss();
        this.uiService
          .getLoadingStateSubject()
          .next({ active: true, data: { type: 'withdraw', data: {} } });
        this.pin = '';
      } else if (resp.code == '418') {
        console.log(resp);
      }
    } catch (error) {
      this.loading.dismiss();
      this.pin = '';
      this.uiService.getClearPinStateSubject().next(true); //Clear keypad state
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }
}
