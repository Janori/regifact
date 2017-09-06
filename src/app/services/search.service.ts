import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ConstService } from './const.service';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService {
  url = 'search/'

  constructor(private http:Http) { }

  search(url:String, params:String){
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));
    return this.http.get(`${ConstService.mainUrl}${this.url}${url}?${params}`, { headers })
    .map( res =>{
      return res.json();
    }, (errorResponse: any) => {
      console.log(errorResponse);
    });
  }

}
