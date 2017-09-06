import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'domsafe'
})
export class DomsafePipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer){}

  transform(value: any, url: any): any { //DomSanitizer //SafeResourceUrl
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url + value);
  }

}
