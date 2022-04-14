import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user: User;
  public accountDeets;
  

  constructor(
    private router: Router,
    private auth: AuthService,
    private profileService: ProfileService,
    private util: UtilService,
    private dataService: DataService,
    private loading: LoadingController) {}

    ngOnInit(): void {
      this.auth.getAuthStateSubject().subscribe((state) =>{
        if(state){
          this.getUser();
        }
      });
    }

  public async getUser() {
    this.user = this.dataService.getData(2);
  }

  public editProfile(){

  }

  public requestPasswordReset(){
    this.util.presentAlertConfirm('Reset Password', 'You will be required to login and create a new password. Proceed?', async() =>{
      this.util.presentLoading2('Logging you out');
      try {
        const resp = await this.profileService.requestPasswordReset(this.user.email);
        if(resp.code === '100'){
          this.loading.dismiss();
          this.util.showToast(resp.message, 3000, 'success');
          this.auth.logout();
        }
      } catch (err) {
        this.loading.dismiss();
        console.log(err);
      }
    }, 'No', 'Yes')
  }

  public goToPage(page:string){
    if(this.accountDeets){
      this.router.navigateByUrl(page, {state: {url: this.router.url, accountDeets : this.accountDeets}});
      return;
    }
    this.getAccountDetails(page);
  }

  public logOut(){
    this.util.presentAlertConfirm('Logout', 'Checking out of Kwakol Funds?', () =>{
      this.util.presentLoading();
      setTimeout(() =>{
        this.loading.dismiss();
        this.auth.logout();
      }, 1500);
    }, 'Nah!', 'Yup!')
  }

  public async getAccountDetails(page){
    try {
      this.util.presentLoading2('Please wait...');
      const resp = await this.profileService.getAccountInfo();
      this.loading.dismiss();
      if(resp.code === '100'){
        this.accountDeets = resp.data.details;
        this.router.navigateByUrl(page, {state: {url: this.router.url, accountDeets : this.accountDeets}});
      }
    } catch (err) {
      console.log(err);
    }
  }
}
