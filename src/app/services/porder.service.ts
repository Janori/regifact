import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ConstService } from './const.service';
import 'rxjs/add/operator/map';

@Injectable()
export class PorderService {
  private url = "porders/1"

  constructor(private http:Http) { }


  getPorder(){
    let headers = new Headers();
    headers.append("Authorization", `${localStorage.getItem('auth_token')}`);

    let url = ConstService.mainUrl + this.url;

    return this.http.get(url, { headers })
    .map( res =>{
      return res.json();
    });
  }

}
