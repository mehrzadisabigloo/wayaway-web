import { Pipe, PipeTransform } from '@angular/core';


/**
 *  1234567 => ۱٬۲۳۴٬۵۶۷
 */


@Pipe({
  name: 'commafy',
  standalone: true
})
export class CommafyPipe implements PipeTransform {

  transform(value: string | number): string {
      let str: any = value.toString().split(',')
      str = str.join("");
      str = str.toString().split('.');
      if (str[0].length >= 4) {
          str[0] = str[0].replace(/(\S)(?=(\S{3})+$)/g, '$1,');
      }
      if (str[1] && str[1].length >= 5) {
          str[1] = str[1].replace(/(\S{3})/g, '$1 ');
      }
      return str.join('.');
  }

}
