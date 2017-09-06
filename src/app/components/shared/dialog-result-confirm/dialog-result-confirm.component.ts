import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-dialog-result-confirm',
  templateUrl: './dialog-result-confirm.component.html',
  styleUrls: ['./dialog-result-confirm.component.css']
})
export class DialogResultConfirmComponent implements OnInit {
  @Input()
  public delTitle:string;

  constructor() { }

  ngOnInit() {
  }

}
