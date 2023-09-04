import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController, NavController } from '@ionic/angular';
import { NextOfKin } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.page.html',
  styleUrls: ['./next-of-kin.page.scss'],
})
export class NextOfKinPage implements OnInit {

  @ViewChild('pinEnterModal') pinEnterModal: IonModal;

  public fromPage: string;
  public nextOfKin = new NextOfKin();

  public inputPinTypePassword = true;
  public pin: string;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    public util: UtilService,
    private loading: LoadingController,
    private navController: NavController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
    }
  }

  ngOnInit() {
    console.log('HEre now');
  }

  //Pin stuff
  public openPinModal() {
    this.nextOfKin.pin = '0000'; //Temporary pin so the next line check passess;
    if (this.util.checkUndefinedProperties(this.nextOfKin)) {
      this.util.showToast('Kindly ensure no empty fields', 2500, 'danger');
      return;
    }
    this.pinEnterModal.present();
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public onPinInputChange(e: { keypadText: string }) {
    console.log(e);
    this.pin = e.keypadText;
    if (this.pin.length === 4) {
      this.nextOfKin.pin = this.pin;
      console.log(this.nextOfKin);
      this.addNextOfKin();
    }
  }
  // End Pin stuff

  private async addNextOfKin() {
    this.util.presentLoading();
    try {
      const resp = await this.profileService.addNextOfKin(this.nextOfKin);
      this.loading.dismiss();
      if (resp.code === '100') {
        console.log(resp.data);
        this.util.showToast('Your Next of Kin has been added', 2500, 'success');
        this.pinEnterModal.dismiss();
        this.navController.setDirection('back');
        this.router.navigateByUrl('/tabs/profile');
      } else if (resp.code == '418') {
        console.log(resp);
        this.util.showToast(resp.message, 2500, 'danger');
      }
    } catch (error) {
      this.loading.dismiss();
      console.log('ERROR', error);
    }
  }
}
