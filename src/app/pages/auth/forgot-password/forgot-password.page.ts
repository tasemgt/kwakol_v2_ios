import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private util: UtilService) { }

  ngOnInit() {
  }

  public doReset(form: NgForm){
    this.util.presentAlertModal('emailSent');
  }
}
