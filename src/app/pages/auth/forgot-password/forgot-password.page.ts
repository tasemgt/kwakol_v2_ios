import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private profileService: ProfileService,
    private util: UtilService,
    private loading: LoadingController) {}

  ngOnInit() {
  }

  public async doReset(form: NgForm){
    const email = form.value.email.trim();
    if(!form.valid || !this.util.validateEmail(email)){
      this.util.showToast('Please enter a valid email', 2000, 'danger');
      return;
    }
    this.util.presentLoading('');
      try {
        const resp = await this.profileService.requestPasswordReset(email);
        if(resp.code === '100'){
          this.loading.dismiss();
          this.util.presentAlertModal('emailSent');
        }
      } catch (err) {
        this.loading.dismiss();
        console.log(err);
      }
  }

  public goToSignup(): void{
    window.open('https://my.kwakolmarkets.com/register?referral=9524f6c135f338667e5ddc3e1275d1fa', '_system', 'location=yes');
  }
}
