import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { ConstService } from './const.service';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  url = "users/loggedin";

  constructor(private http:Http,
              private router:Router,
              private constService:ConstService) { }

  getPermissions(){
    let url = ConstService.mainUrl + 'user/all_perms';
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.get(url,{ headers })
    .map( res =>{
      if(res.json().status){
        return res.json().data;
      }else{
        return [];
      }
    },error=>{
      console.log(error);
    });

  }

  isAuthenticated(){
    let url = ConstService.mainUrl + this.url;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));
    let token:string = localStorage.getItem('auth_token');
    let expire_token:string = localStorage.getItem('expire_token');

    if(token && expire_token){
      let expireTime = new Date(expire_token);
      if(expireTime.getTime() - new Date().getTime() > 0){
        return true;
      }
    }
    return false;
  }

  logout(redirectTo:string){
    localStorage.removeItem('auth_token');
    localStorage.removeItem('expire_token');
    localStorage.removeItem('access');
    localStorage.removeItem('uk');
    this.router.navigate([redirectTo]);
  }

  login(email:string, secret:string){
    return this.constService.getNewtoken(email, secret);
  }

}
