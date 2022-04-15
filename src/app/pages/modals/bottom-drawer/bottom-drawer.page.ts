import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { bottomDrawer } from 'src/app/models/constants';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-bottom-drawer',
  templateUrl: './bottom-drawer.page.html',
  styleUrls: ['./bottom-drawer.page.scss'],
})
export class BottomDrawerPage implements OnInit {

  public selectedBank;
  public selectedInvestment;
  public selectedCurrency;

  public from = '';
  public to = '';

  @Input() type;
  @Input() formSelects;

  public investments = [];
  public currencies = [];
  public banks = [];

  public currentURL;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private dataService: DataService) { }

  ngOnInit() {

    this.currentURL = this.router.url;
    this.banks = this.dataService.getBanks();

    this.populateSelectButtons();
    this.selectedBank = this.dataService.getBank();
    this.selectedInvestment = this.dataService.getInvestment();
    this.selectedCurrency = this.dataService.getCurrency();
    console.log(this.selectedBank);
    this.initializeList();
  }

  public onTapBank(bank){
    bank.selected = true;
    this.dataService.setBank(bank);
    this.closeModal({type: 'bank', data:bank});
  }

  public onTapInvestment(investment){
    investment.selected = true;
    this.dataService.setInvestment(investment);
    this.closeModal({type: 'investment', data:investment});
  }

  public onTapCurrency(currency){
    currency.selected = true;
    this.dataService.setCurrency(currency);
    console.log(currency);
    this.banks = [];
    this.dataService.clearBanks();
    this.dataService.clearBank();
    this.populateBankAccountsButtons(currency);
    this.closeModal({type: 'currency', data:currency});
  }

  public sortByDate(){
    this.closeModal({data: { from: this.from.split('T')[0], to: this.to.split('T')[0] }});
  }

  private closeModal(data: any){
    this.modalCtrl.dismiss({data});
  }

  //Initialize selected if there is already
  private initializeList(){
    if(this.selectedBank){
     const bank = this.banks.find(b => b.name === this.selectedBank.name);
     bank? bank.selected = true : '';
    }
    if(this.selectedInvestment){
      const inv = this.investments.find(inv => inv.name === this.selectedInvestment.name);
      inv ? inv.selected = true : '';
     }
     if(this.selectedCurrency){
      const cur = this.currencies.find(c => c.name === this.selectedCurrency.name);
      cur ? cur.selected = true: '';
     }
  }

  private populateSelectButtons(){
    if(this.formSelects.investments){
      this.formSelects.investments.forEach(inv =>{
        const investment = {id: inv.id, name: inv.subscription.name, balance: inv.balance, selected: false};
        this.investments.push(investment);
      });
    }

    if(this.formSelects.currencies){
      this.formSelects.currencies.forEach(cur =>{
        const currency =  { id: cur.id, name: cur.short_name, sym: cur.symbol, selected: false, accounts: cur.accounts }
        this.currencies.push(currency);
      });
    }
  }

  private populateBankAccountsButtons(currency){
    currency.accounts.forEach(b =>{ 
      const bank =  { 
        id: b.id, 
        accountName: b.bank_name,
        accountNum: b.account_number,
        bankName: b.bank_account_name, 
        selected: false
      }
      this.banks.push(bank);
    });
    this.dataService.setBanks(this.banks);
    console.log(this.banks);
  }

}
