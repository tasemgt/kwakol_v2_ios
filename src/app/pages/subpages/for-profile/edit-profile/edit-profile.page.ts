import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { constants } from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public fromPage: string;
  public user: User;
  public username: string;
  public email: string;
  public phone: string;

  public constant =  constants;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private util: UtilService,
    private loading: LoadingController,
    private navController: NavController,
    private storageService: StorageService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.user = state.user;
    }
  }

  ngOnInit() {
    this.email = this.user.email;
    this.phone = this.user.phone;
    this.username = this.user.username;
  }

  public uploadPhoto() {}

  public async doEditProfile() {
    const payload = {
      username: this.username,
    };
    console.log(payload);
    this.util.presentLoading();

    // setTimeout(() =>{
    //   this.loading.dismiss();
    //   this.util.showToast('Profile Updated successfully', 3000, 'success');
    //   this.goBack(payload);
    // },1000);

    try {
      const resp = await this.profileService.doEditProfile(payload);
      this.loading.dismiss();
      if (resp.code == 100) {
        this.util.showToast('Profile Updated successfully', 3000, 'success');
        this.goBack(payload);
        //
      } else {
        this.util.showToast(resp.data, 2000, 'danger');
      }
    } catch (error) {
      console.log('FAILED>', error);
      this.loading.dismiss();
    }
  }

  public goBack(payload){
    this.navController.setDirection('back');
    this.profileService.getProfileUpdateSubject().next(payload);
    this.updateUsernameInStorage(payload.username);
    this.router.navigateByUrl('tabs/profile');
  }

  public async updateUsernameInStorage(username){
    const user =  await this.storageService.get(this.constant.currentUser);
    user.username = username;
    this.storageService.set(this.constant.currentUser, user);
  }
}
