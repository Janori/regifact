import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';


@Injectable()
export class ConstService{
  static mainUrl = "http://localhost:8000/api/"

  constructor(private http:Http){
  }

  getNewtoken(email:string, secret:string){
    let url = ConstService.mainUrl + "authenticate";

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let data = {
      "email":email,
      "password": secret
    };

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
        return true;
      }else{
        return false;
      }
    });
  }


}
