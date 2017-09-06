import { Component, OnInit } from '@angular/core';
import { Data, canUse } from '../../../shared.data';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  canUse(value:string){
    return Data.canUse(value);
  }

  ngOnInit() {
  }

}
