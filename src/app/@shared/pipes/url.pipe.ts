import { Pipe, PipeTransform } from '@angular/core';

/**
 *  Angular Tutorial => angular-tutorial
 *  سلام دنیا ->  سلام-دنیا
 */

@Pipe({
  name: 'url'
})
export class UrlPipe implements PipeTransform {

  transform(val: string) {
    if (val) {
      val = this.url_convert(val);
    }
    return val;
  }

  url_convert(value: string) {
    value = value.toString().toLowerCase();
    let finile = value.replace(/\s+/g, '-');

    return finile.toString();
  }

}
