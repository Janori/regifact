import { Component, OnInit } from '@angular/core';
import { UsersService, IUser } from '../../../services/users.service';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent implements OnInit {
  users:IUser[] = [];

  constructor(private usersService:UsersService) { }

  ngOnInit() {
    this.usersService.getAllUsers().subscribe(data=>{
      this.users = data;
    });
  }

  borrar(id:number){
    alert(id);
  }

  setDate(date:string){
    date = date.replace(" ", "T");
    return new Date(date);
  }

}
