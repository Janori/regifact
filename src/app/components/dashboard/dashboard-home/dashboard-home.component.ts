import { Component, OnInit } from '@angular/core';
import { Data } from '../../../shared.data';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  isUser() : boolean{
    return Data.kind != "p";
  }

  constructor() { }


  ngOnInit() {
  }

  test(){
    alert('Función en proceso.');
  }

}
