import { Directive, ElementRef, HostListener, Input  } from '@angular/core';

@Directive({
  selector: '[appSelectOnClick]'
})
export class SelectOnClickDirective {

  constructor(private el:ElementRef) {}

  private focusedElement:any = null;

  @HostListener('click') gotFocus(){
    if(this.focusedElement != this.el){
      this.el.nativeElement.select();
    }

    this.focusedElement = this.el;
  }
  @HostListener('focusout') lostFocus(){
    this.focusedElement = null;
  }

}
