import { Directive, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';

@Directive({
  selector: '[symbiota2ImgFallback]'
})
export class ImgFallbackDirective {

  readonly DEFAULT_ICON_PATH = "assets/images/default_av.png"

  constructor(private el: ElementRef) { }

  @HostListener('error') onError() {
    this.el.nativeElement.src = this.DEFAULT_ICON_PATH
    
  }
}
