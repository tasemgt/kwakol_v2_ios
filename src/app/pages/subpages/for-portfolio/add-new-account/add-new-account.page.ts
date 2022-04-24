import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { BottomDrawerPage } from 'src/app/pages/modals/bottom-drawer/bottom-drawer.page';
import { DataService } from 'src/app/services/data.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.page.html',
  styleUrls: ['./add-new-account.page.scss'],
})
export class AddNewAccountPage implements OnInit {

  private modal: HTMLIonModalElement;
  public toastShown = false;

  public account;

  public amount: string;
  public depositData;

  public selectedBank: any;
  public selectedCurrency: any;

  public fileName = 'No file chosen';
  private receipt: File;

  public fromPage: string;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private router: Router,
    public util: UtilService,
    private loading: LoadingController,
    private subService: SubscriptionService,
    private dataService: DataService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.account = this.router.getCurrentNavigation().extras.state.account;
    }
  }

  ngOnInit() {
    this.getDepoitPageData();
    this.selectedBank = this.dataService.getBank() || {bankName: 'Select Bank'};
    this.selectedCurrency = this.dataService.getCurrency() || {name: 'USD', sym: '$'};
  }

  public async continue(){
    if(!this.selectedCurrency.selected) return this.util.showToast('Please select a currency', 2000, 'danger');
    if(!this.amount) return this.util.showToast('Please input deposit amount', 2000, 'danger');
    if(!this.selectedBank.selected) return this.util.showToast('Please select a bank', 2000, 'danger');
    if(!this.receipt) return this.util.showToast('Please attach a proof receipt', 2000, 'danger');

    const formData = new FormData();

    const amount = this.amount.replace(/,/g, "");

    formData.append('currency_id', this.selectedCurrency.id); formData.append('bank_id', this.selectedBank.id);
    formData.append('amount', amount); formData.append('proof_of_payment', this.receipt);
    formData.append('subscription_id', this.account.id);
    console.log(Array.from(formData.entries()));

    try {
      this.util.presentLoading();
      const resp = await this.subService.doNewSubscription(formData);
      console.log(resp);
      if(resp.code === '100'){
        this.loading.dismiss();
        this.subService.getBalanceSubject().next(true);
        this.util.showToast('Account created successfully', 3000, 'success');
        this.navCtrl.setDirection('back');
        this.router.navigateByUrl(this.fromPage);
        // this.util.presentAlertModal('depositConfirm');
      }
    } catch (error) {
      this.loading.dismiss();
      console.log(error);
      error.status === 0 ? this.util.showToast('Please check your network connection...', 3000, 'danger') : '';
    }

  }


  public onFileChange(fileChangeEvent){
    this.receipt = fileChangeEvent.target.files[0];
    this.fileName = this.receipt.name.slice(0,35);
  }

  public onTapSelect(type: string){
    if(type === 'bank' && !this.selectedCurrency.selected){
      this.util.showToast('Please select a currency first.', 2000, 'danger');
      return;
    }
    this.presentModal(type);
  }

  async presentModal(type: string) {
    const formSelects = {
      currencies: this.depositData.deposit
    }
    this.modal = await this.modalCtrl.create({
      component: BottomDrawerPage,
      breakpoints: [0, 0.2, 0.4, 0.7, 0.9],
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropBreakpoint: 0.2,
      backdropDismiss: true,
      swipeToClose: true,
      keyboardClose: true,
      cssClass: 'kwakol-modal-bottom-drawer',
      componentProps: { type, formSelects }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    if(!data) return;
    if(data.data.type === 'bank'){
      this.selectedBank = data.data.data;
    }
    else if(data.data.type === 'currency'){
      this.selectedBank = {bankName: 'Select Bank'};
      this.selectedCurrency = data.data.data;
    }
  }

  private async getDepoitPageData(){
    !this.toastShown ? this.util.presentLoading('Preparing...'): '';
    try {
      const resp = await this.subService.getDepositData();
      this.loading.dismiss();
      resp.code === '100' ? this.depositData = resp.data : console.log(resp);
      console.log(this.depositData.deposit);
      const currencies: any[] = this.depositData.deposit;
      let s  = currencies.find(c => c.name === 'Dollar');
      s = { id: s.id, name: s.short_name, sym: s.symbol, selected: true, accounts: s.accounts } //My formatted currency object
      this.selectedCurrency = s; //Making default selected currency to be dollar;
      this.dataService.setCurrency(s); //To help populate bottom drawer on openning it
      this.putBanksInDataService(s);
    } catch (error) {
      console.log(error);
      if(error.status === 0){
       !this.toastShown ? this.util.showToast('Please check your network connection', 4000, 'danger') : '';
        this.toastShown = true;
        setTimeout(() => this.getDepoitPageData(), 8000);
      }
    }
  }

  private putBanksInDataService(currency){
    const banks = [];
    currency.accounts.forEach(b =>{ 
      const bank =  { 
        id: b.id, 
        accountName: b.bank_name,
        accountNum: b.account_number,
        bankName: b.bank_account_name, 
        selected: false
      }
      banks.push(bank);
    });
    this.dataService.setBanks(banks);
  }

  public refreshModel(): void{
    if(this.amount){
      this.amount = this.util.numberWithCommas(this.amount);
    }
  }

}
