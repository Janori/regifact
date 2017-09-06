import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, IUser } from '../../../services/users.service';
import { SearchService } from '../../../services/search.service';
import { Data, canUse } from '../../../shared.data';
import {MdDialog, MdDialogRef} from '@angular/material';
import { DialogResultConfirmComponent } from '../../shared/dialog-result-confirm/dialog-result-confirm.component';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent implements OnInit {
  users:IUser[] = [];
  resultCount:number = 0;

  params = {
    'from': 0,
    'to': 10,
    'query': ''
  }

  canUse(value:string){
    return Data.canUse(value);
  }

  constructor(private usersService:UsersService,
              private searchService:SearchService,
              private activatedRoute:ActivatedRoute,
              public dialog: MdDialog,
              private router:Router) { }

  isNumeric(n: any) : n is number | string {
      return !isNaN(parseFloat(n)) && isFinite(n);
  }
  intVal(n: number | string): number {
      return typeof n === "number" ? n : parseInt(n, 10);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(data=>{
      if(data && data.from && data.to && this.isNumeric(data.from) && this.isNumeric(data.to)){
        this.params.from = data.from;
        this.params.to = data.to;
      }
      if(data.query){
        this.params.query = data.query;
        this.searchService
        .search("users/u", `from=${this.params.from}&count=${this.params.to}&email=${this.params.query}&username=${this.params.query}&name=${this.params.query}`)
        .subscribe(data=>{
          this.users = data.data;
          this.resultCount = data.msg;
        }, error=>{
          alert(`Ocurrió un error en el servidor. ${error}`);
        });
      }else{
        this.usersService.getAllUsers(this.params.from, this.params.to).subscribe(data=>{
          this.users = data.data;
          this.resultCount = data.msg;
        });
      }
    });
  }

  buscar(value:string){
    this.router.navigate(['dashboard/users'], {queryParams: {query: value}});
  }

  borrar(id:number){
    this.openDelDialog(id);
  }

  setDate(date:string){
    date = date.replace(" ", "T");
    return new Date(date);
  }
  openDelDialog(id:number) {
    let dialogRef = this.dialog.open(DialogResultConfirmComponent);
    let w = window;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.usersService.delete(id).subscribe(res=>{
          w.location.reload();
        }, error=>{
          console.log(error);
        });
      }
    });
  }

}
