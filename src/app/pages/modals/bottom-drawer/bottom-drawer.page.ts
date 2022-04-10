import { Component, Input, OnInit } from '@angular/core';
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

  @Input() type;

  public banks = [
    { name: 'Wema Bank', selected: false },
    { name: 'United Bank for Africa', selected: false },
    { name: 'Keystone Bank', selected: false },
    { name: 'Taj Bank', selected: false }
  ];

  public investments = [
    { name: 'Levadura', balance: '1,255.49', selected: false },
    { name: 'Marigold', balance: '7,534.51', selected: false },
    { name: 'Jūnzi', balance: '15,655.01', selected: false }
  ];

  public currencies = [
    { name: '$ USD ', selected: false },
    { name: 'N NGN', selected: false },
    { name: 'Euro', selected: false },
    { name: '£ GBP', selected: false }
  ];


  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService) { }

  ngOnInit() {
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
    this.closeModal({type: 'currency', data:currency});
  }


  private closeModal(data: any){
    this.modalCtrl.dismiss({data});
  }

  //Initialize selected if there is already
  private initializeList(){
    if(this.selectedBank){
     const bank = this.banks.find(b => b.name === this.selectedBank.name);
     bank.selected = true;
    }
    if(this.selectedInvestment){
      const inv = this.investments.find(inv => inv.name === this.selectedInvestment.name);
      inv.selected = true;
     }
     if(this.selectedCurrency){
      const cur = this.currencies.find(c => c.name === this.selectedCurrency.name);
      cur.selected = true;
     }
  }

}
