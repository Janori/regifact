import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ConstService } from './const.service';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  url = "users/";
  kinds = "users/kinds";
  roles = "roles";

  constructor(private http:Http,
              private router:Router) { }

  getAllUsers(){
      let url = ConstService.mainUrl + this.url;
      let headers = new Headers();
      headers.append("Authorization", localStorage.getItem('auth_token'));

      return this.http.get(url, { headers })
      .map( res =>{
        if(res.json().status){
          let users:IUser[] = [];
          for(let user of res.json().data){
            users.push(user);
          }
          return users;
        }else{
          return [];
        }
      });
  }

  getAllRoles(){
    let url = ConstService.mainUrl + this.roles;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.get(url, { headers })
    .map( res =>{
      if(res.json().status){
        return res.json().data;
      }else{
        return [];
      }
    });
  }

  getAllKinds(){
    let url = ConstService.mainUrl + this.kinds;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.get(url, { headers })
    .map( res =>{
      if(res.json().status){
        let users:IKeyValue[] = res.json().data;
        return users;
      }else{
        return [];
      }
    });
  }

}

export interface IKeyValue{
  key:string,
  value:string
}
export interface IUser{
  "id":number,
  "name":string,
  "email":string,
  "password":string,
  "kind":string,
  "role_id":number,
  "created_at":Date,
  "updated_at":Date
}
