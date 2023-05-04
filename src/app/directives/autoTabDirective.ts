import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[maxlength="1"]',
})
export class AutoTabDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement) {
    const value = input.value;
    if (value.length === 1) {
      const next = input.nextElementSibling as HTMLInputElement;
      if (next) {
        next.focus();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedValue = event.clipboardData?.getData('text');
    if (pastedValue?.length === 6) {
      const values = pastedValue.split('');
      const inputs = this.el.nativeElement.querySelectorAll('.otp-input');
      console.log(inputs);
      for (let i = 0; i < values.length; i++) {
        const inputField = inputs[i] as HTMLInputElement;
        inputField.value = values[i];
        if (i < values.length - 1) {
          const next = inputs[i + 1] as HTMLInputElement;
          next.focus();
        }
      }
    }
  }
}
