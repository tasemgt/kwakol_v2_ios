import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { countries } from 'src/app/models/constants';
import { Beneficiary } from 'src/app/models/user';

@Component({
  selector: 'app-create-beneficiary',
  templateUrl: './create-beneficiary.page.html',
  styleUrls: ['./create-beneficiary.page.scss'],
})
export class CreateBeneficiaryPage implements OnInit {

  @ViewChild('selectCountryModal') selectCountryModal: IonModal;
  @ViewChild('selectDOBModal') selectDOBModal: IonModal;

  public countries = countries;

  public selectedCountryImg = '';

  public fromPage: string;
  public beneficiary =  new Beneficiary();

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
    }
  }

  ngOnInit() {
    console.log('HEre now');
  }

  public openSelectDOBModal(){
    this.selectDOBModal.present();
  }
  
  public openSelectCountryModal(){
    this.selectCountryModal.present();
  }

  public selectDOB(){
    this.beneficiary.date_of_birth = '1990-01-01';
    this.selectDOBModal.dismiss();
  }

  public selectCountry(country){
    console.log(country);
    this.beneficiary.country = country.name;
    this.selectedCountryImg = country.img;
    this.selectCountryModal.dismiss();
  }

}
