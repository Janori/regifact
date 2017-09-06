import { Directive, HostListener, HostBinding, EventEmitter,
         Output, Input } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() private filesChangeEmiter : EventEmitter<File[]> = new EventEmitter();

  @Input() private allowedExtensions : Array<string> = [];
  @Input() private maxFiles:number = 1;

  @HostBinding('style.background') private background = '#eee';

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee'
  }

  @HostListener('drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    let files:File[] = evt.dataTransfer.files;
    let validFiles : File[] = [];
    if(files.length > 0){
      for(let file of files){
        let ext = file.name.split('.')[file.name.split('.').length - 1];
        if(this.allowedExtensions.lastIndexOf(ext) != -1){
          validFiles.push(file);
        }
      }
      this.filesChangeEmiter.emit(validFiles.slice(0, this.maxFiles));

    }
  }

}
