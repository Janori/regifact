import { Component, OnInit } from '@angular/core';
import { PorderService } from './../../services/porder.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {
  data:any={};
  isLogged;

  constructor(private porderService:PorderService,
              private authService:AuthService) {
  }

  ngOnInit() {
    this.porderService.getPorder().subscribe(data=>{
      this.data = data;
    });
    this.authService.login("luke1@gmail.com", "secrest");
    this.isLogged = this.authService.isAuthenticated();
  }


}
