import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ConstService } from './const.service';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  url = "users";
  urlProviders = "providers";
  urlUserName = "users/find/username/";
  urlEmail = "users/find/email/";
  urlPwd = "users/pwd";
  kinds = "users/kinds";
  roles = "roles";

  constructor(private http:Http,
              private router:Router) { }



  getAllUsers(from:number = 0, to:number = 10){
      let url = ConstService.mainUrl + this.url + `?from=${from}&count=${to}`;
      let headers = new Headers();
      headers.append("Authorization", localStorage.getItem('auth_token'));
      console.log(url);
      return this.http.get(url, { headers })
      .map( res =>{
        return res.json();
      }, (errorResponse: any) => {
        console.log(errorResponse);
      });
  }
  getAllProviders(from:number = 0, to:number = 10){
      let url = ConstService.mainUrl + this.urlProviders + `?from=${from}&count=${to}`;
      let headers = new Headers();
      headers.append("Authorization", localStorage.getItem('auth_token'));
      console.log(url);
      return this.http.get(url, { headers })
      .map( res =>{
        return res.json();
      }, (errorResponse: any) => {
        console.log(errorResponse);
      });
  }

  getUser(id:number){
    let url = ConstService.mainUrl + this.url + '/' + id;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.get(url, { headers })
    .map( res =>{
      return res.json();
    }, (errorResponse: any) => {
      console.log(errorResponse);
    });
  }

  updateUser(id:number, data:any){
    let url = ConstService.mainUrl + this.url + '/' + id;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.put(url, data, { headers })
    .map( res =>{
      return res.json().status;
    }, (errorResponse: any) => {
      console.log(errorResponse);
    });
  }
  updatePWD(pwd:string){
    let url = ConstService.mainUrl + this.urlPwd;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.put(url, {'password':pwd}, { headers })
    .map( res =>{
      return res.json();
    }, (errorResponse: any) => {
      console.log(errorResponse);
    });
  }

  createUser(data:any){
    let url = ConstService.mainUrl + this.url;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.post(url, data, { headers })
    .map( res =>{
      return res.json();
    }, (errorResponse: any) => {
      console.log(errorResponse);
    });
  }

  userExists(username:String, isEmail:boolean, def:String=null){
    let url = `${ConstService.mainUrl}${!isEmail ? this.urlUserName : this.urlEmail}${username}`;
    console.log(url);
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.get(url, { headers })
    .map( res =>{
      if(res.json().status){
        if(username.length == 0) return null;
        if(def && def == username){
          return null;
        }
        return {existe:true};
      }else{
        return null;
      }
    }, error=>{
      console.log(error);
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
  delete(id:number){
    let url = ConstService.mainUrl + this.url + "/" + id;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));
    return this.http.delete(url, { headers })
    .map( res =>{
      return res.json();
    }, (errorResponse: any) => {
      console.log(errorResponse);
    });
  }

}

export interface IKeyValue{
  key:string,
  value:string
}
export interface IUser{
  "id":number,
  "username":string,
  "name":string,
  "email":string,
  "password":string,
  "kind":string,
  "role_id":number,
  "created_at":Date,
  "updated_at":Date
}
