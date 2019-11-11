import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();
  @HostBinding('style.opacity') private opacity = '1';
  @HostBinding('style.borderWidth') private border = '1';
  @HostBinding('style.borderStyle') private borderStyle = 'none';
  @HostBinding('style.borderColor') private borderColor = 'none';

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '0.4';
    this.border = '2px';
    this.borderStyle = 'dashed';
    this.borderColor = 'blue';
  }


  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    this.border = '0px';
    this.borderStyle = 'none';
    this.borderColor = 'none';
  }
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    this.border = '0px';
    this.borderStyle = 'none';
    this.borderColor = 'none';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit({ target: { files } });
    }
  }

}
