import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {

  @Input()
  hoverText:string = "Buscar...";
  @Input()
  submitValue:string = "Buscar";
  @Input()
  value:string = null;
  @Output()
  performSearch: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  search(){
    this.performSearch.emit(this.value);
  }

}
