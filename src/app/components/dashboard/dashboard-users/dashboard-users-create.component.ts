import { Component, OnInit } from '@angular/core';
import { UsersService, IKeyValue } from '../../../services/users.service';

@Component({
  selector: 'app-dashboard-users-create',
  templateUrl: './dashboard-users-create.component.html',
  styles: []
})
export class DashboardUsersCreateComponent implements OnInit {

  constructor(private userService:UsersService) { }

  roles:IKeyValue[] = [];
  rolSelected:number = 1;

  kinds:IKeyValue[] = [];
  kindSelected:string = "x";

  ngOnInit() {
    console.log("");
    this.userService.getAllRoles().subscribe(data =>{
      this.roles = data;
    });
    this.userService.getAllKinds().subscribe(data =>{
      this.kinds = data;
    });
  }

}
