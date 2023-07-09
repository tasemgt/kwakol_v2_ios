import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HomeService } from 'src/app/services/home.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('accountManagerModal') accountManagerModal: IonModal;

  public user: User;
  public accountDeets;

  public myBeneficiaries = [];

  private execptions = ['/settings'];

  constructor(
    private router: Router,
    private auth: AuthService,
    private profileService: ProfileService,
    private util: UtilService,
    private homeService: HomeService,
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
      this.util.presentLoading('Logging you out');
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

  public goToPage(page: string){
    // if(this.accountDeets){
    //   this.router.navigateByUrl(page, {state: {url: this.router.url, accountDeets : this.accountDeets}});
    //   return;
    // }
    if(this.execptions.includes(page)){
      this.router.navigateByUrl(page, {state: {url: this.router.url}});
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
    }, 'Cancel', 'Yes')
  }

  public async getAccountDetails(page){
    try {
      this.util.presentLoading('Please wait...');
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

  public async goToNextOfKin(){
    this.router.navigateByUrl('/next-of-kin', {state: {url: this.router.url}});
  }

  public goToLinks(link: string): void{
    window.open(link, '_system', 'location=yes');
  }

  public openAccountManagerModal(){
    this.accountManagerModal.present();
  }

  public async goToBeneficiariesPage(){
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getBeneficiaries();
      this.loading.dismiss();
      if(resp.code == 100){
        this.myBeneficiaries = resp.data;
        this.router.navigateByUrl('/beneficiaries', {state: {url: this.router.url, beneficiaries: this.myBeneficiaries}});
      }
    }
    catch(e){
      this.loading.dismiss();
      this.util.showToast('Please try again', 2000, 'danger');
      console.log(e);
    }
  }

  public goToChangePasswordPage(){
    this.router.navigateByUrl('/change-password', {state: {url: this.router.url, user: this.user}});
  }
}
