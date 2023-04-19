import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { OneSignalService } from 'src/app/services/one-signal.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordType = 'password';
  public passwordIcon = 'eye-close';

  public inputFocused: boolean;

  private notification_id: string;

  constructor(
    private auth: AuthService,
    private util: UtilService,
    private oneSS: OneSignalService,
    private loading: LoadingController) { }

  ngOnInit() {
    this.getOneSignalPlayerID();
  }


  public async login(form: NgForm): Promise<void>{
    if(!form.valid){
      this.util.showToast('Email or password cannot be empty', 2000, 'danger');
      return;
    }
    try{
      // this.notification_id = '12345';
      console.log('Notification ID before send ', this.notification_id);
      if(!this.notification_id){
        await this.getOneSignalPlayerID();
      }
      await this.util.presentLoading();
      const resp  = await this.auth.login({email: form.value.email, password: form.value.password, notification_id: this.notification_id});
      this.loading.dismiss();
      setTimeout(() => form.reset(), 100);
      if(!resp.token){
        this.util.showToast(resp.message, 3000, 'danger');
        return;
      }
    }
    catch(err){
      console.log('Error>> ', err);
      if(err.status === 401){
        this.util.showToast('Invalid email or password', 3000, 'danger');
      }
      if(err.status === 0 || err.status === -3 || err.status === 500){
        this.util.showToast('Ooops! something went wrong, please check your connection and try again.', 3000, 'danger');
      }
      if(err.status === 500){
        console.log('Error from server,: ', err.status);
      }
      this.loading.dismiss();
    }
  }

  public hideShowPassword() {
    const deets = this.util.hideShowPassword(
      this.passwordType,
      this.passwordIcon
    );
    this.passwordType = deets.passwordType;
    this.passwordIcon = deets.passwordIcon;
  }

  public goToSignup(): void{
    window.open('https://my.kwakolmarkets.com/register?referral=9524f6c135f338667e5ddc3e1275d1fa', '_system', 'location=yes');
  }

  public onInputsFocus(): void{
    this.inputFocused = true;
  }

  public onInputsBlur(): void{
    this.inputFocused = false;
  }

  private async getOneSignalPlayerID(){
    this.notification_id = await this.oneSS.getPlayerID();
    console.log(this.notification_id);
  }


}
