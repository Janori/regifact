import { Component, OnInit } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { UsersService, IKeyValue } from '../../../services/users.service';

@Component({
  selector: 'app-dashboard-users-edit',
  templateUrl: './dashboard-users-edit.component.html',
  styles: []
})
export class DashboardUsersEditComponent implements OnInit {

  constructor(private userService:UsersService) { }

  roles:IKeyValue[] = []

  ngOnInit() {
    console.log("");
    this.userService.getAllRoles().subscribe(data =>{

      this.roles = data;
    });
  }

}
