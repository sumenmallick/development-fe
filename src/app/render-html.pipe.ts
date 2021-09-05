import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

    @Pipe({ name: 'safe' })

export class EscapeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, type: string): SafeHtml | SafeStyle {
      //console.log('Pipe called');
      switch(type){
        case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
        case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
        default: throw new Error('Invalid safe type specified: ${type}');
      }
  }
}