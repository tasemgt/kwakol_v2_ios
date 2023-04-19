import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public fromPage: string;

  constructor(private router: Router, private util: UtilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {}

  public getStarted() {
    this.util.presentLoadingModal({loadingText: 'Setting up your account...', onClosePageUrl: '/kyc'});
  }
}
