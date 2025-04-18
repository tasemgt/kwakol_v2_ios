import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private infoState: BehaviorSubject<{active: boolean; data: {type: string; data: any}}> = new BehaviorSubject(null);
  private loadingState: BehaviorSubject<{active: boolean; data: {type: string; data: any}}> = new BehaviorSubject(null);
  private instructHomeState: BehaviorSubject<{type: string; data: any}> = new BehaviorSubject(null);
  private instructOnboardingState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // private loadingState: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private backdropState: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private clearPinState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private appLockModalOpenState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private autolockOnSettingsState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private openSetUsernameState: BehaviorSubject<boolean> = new BehaviorSubject(false);



  constructor() {}

  public getInfoStateSubject(){
    return this.infoState;
  }

  public getinstructHomeStateStateSubject(){
    return this.instructHomeState;
  }
  
  public getinstructOnboardingStateStateSubject(){
    return this.instructOnboardingState;
  }

  public getLoadingStateSubject(){
    return this.loadingState;
  }

  public getBackdropStateSubject(){
    return this.backdropState;
  }

  public getClearPinStateSubject(){
    return this.clearPinState;
  }
  
  public getAppLockModalOpenStateSubject(){
    return this.appLockModalOpenState;
  }
  
  public getAutolockOnSettingsSubject(){
    return this.autolockOnSettingsState;
  }

  public getOpenSetUsernameStateSubject(){
    return this.openSetUsernameState;
  }
}
