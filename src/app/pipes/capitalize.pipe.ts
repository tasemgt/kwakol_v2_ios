import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if(!value){
      return;
    }
    return value.substring(0,1).toUpperCase() + value.substring(1);
  }

}
