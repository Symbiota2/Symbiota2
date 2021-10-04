import { Directive, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';

@Directive({
  selector: '[symbiota2ImgFallback]'
})
export class ImgFallbackDirective {

  constructor(private el: ElementRef) { }

  @HostListener('error') onError() {
    this.el.nativeElement.src = 'assets/images/default_av.png'
    
  }
}
