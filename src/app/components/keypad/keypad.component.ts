import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss'],
})
export class KeypadComponent implements OnInit {

  @Output() keypadEmitter = new EventEmitter<{ keypadText: string }>();
  public keypadText: string;

  constructor(private uiService: UiService) { }

  ngOnInit() {
    this.keypadText = '';
    this.uiService.getClearPinStateSubject().subscribe((state) => {
      if (state) {
        //clear keypad text when state is true
        this.keypadText = '';
      }
    });
  }

  public getPressedKey(key: string): void {
    if (key === 'cancel') {
      this.keypadText = this.keypadText.slice(0, -1);
    } else if (key === 'clear') {
      this.keypadText = '';
    } else {
      this.keypadText.length < 4 ? (this.keypadText += key) : '';
    }
    this.onKeypadTextChange(this.keypadText);
  }

  public onKeypadTextChange(text: string) {
    this.keypadEmitter.emit({ keypadText: text });
  }

  public onClearEmitter(){
    console.log('Clearing emmitre');
    this.keypadEmitter.emit({keypadText: ''});
  }

}
