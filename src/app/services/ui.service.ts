import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private infoState: BehaviorSubject<{active: boolean; data: {type: string; data: any}}> = new BehaviorSubject(null);
  private loadingState: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private backdropState: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  public getInfoStateSubject(){
    return this.infoState;
  }

  public getLoadingStateSubject(){
    return this.loadingState;
  }

  public getBackdropStateSubject(){
    return this.backdropState;
  }
}
