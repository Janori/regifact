import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Data } from '../shared.data';
import 'rxjs/add/operator/timeout';


@Injectable()
export class ConstService{
  //static mainUrl = "http://localhost:8000/api/"
  static mainUrl = "http://api.bymssa.mx/api/";

  constructor(private http:Http){
  }

  getNewtoken(email:string, secret:string){
    let url = ConstService.mainUrl + "authenticate";

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    var data:any;

    if(email.indexOf("@") == -1){
      data = {
        "username":email,
        "password":secret
      }
    }else{
      data = {
        "email":email,
        "password": secret
      };
    }

    return this.http.post(url, data, { headers })
    .map( res =>{
      if(res.json().status){
        let minutes:number = res.json().data.ttl;
        let milliseconds = minutes * 1000 * 60;
        var d1 = new Date();
        d1.setTime(d1.getTime() + milliseconds);
        console.log("Time", milliseconds);
        localStorage.setItem('auth_token', res.json().data.token);
        localStorage.setItem('expire_token', d1.toString());
        localStorage.setItem('uk', res.json().data.kind);
        localStorage.setItem('access', JSON.stringify(res.json().data.perms));
        Data.kind = res.json().data.kind;
        Data.access = res.json().data.perms;
        console.log(res.json().data);
        console.log(Data.access);
        return true;
      }else{
        return false;
      }
    }).catch((error)=>{
      if(error.name == "TimeoutError"){
        return Observable.throw("Tiempo de espera agotado, intente de nuevo más tarde.");
      }
      console.log(error);
      return Observable.throw(error);
    });
  }

  handleError(error:any){
    console.log(error)
  }


}
