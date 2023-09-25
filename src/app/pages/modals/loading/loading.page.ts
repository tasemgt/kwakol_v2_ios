import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  @Input() loadingText: string;
  public isLoading = true;


  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => this.loadingText = 'Redirecting...', 500);
      setTimeout(() => this.modalCtrl.dismiss({done: true}), 2000);
    }, 3000);
  }
}
