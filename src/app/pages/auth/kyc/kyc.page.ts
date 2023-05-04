import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.page.html',
  styleUrls: ['./kyc.page.scss'],
})
export class KycPage implements OnInit {

  public fromPage: string;

  constructor(private router: Router, private util: UtilService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      console.log(this.fromPage);
    }
  }

  ngOnInit() {
  }

}
