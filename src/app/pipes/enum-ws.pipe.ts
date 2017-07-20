import { Pipe, PipeTransform } from '@angular/core';
import { ConstService } from '../services/const.service';
import { Http, Headers } from '@angular/http';

@Pipe({
  name: 'enumWs'
})
export class EnumWsPipe implements PipeTransform {

  constructor(private http:Http){}

  transform(value: any, url:string): any {
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    let cUrl = ConstService.mainUrl + url;

    return this.http.get(cUrl, { headers })
    .map(res=>{
      if(res.json().status){
        let dic:IKeyValue[] = res.json().data;
        for(let row of dic){
          console.log("Key:" + row.key + " PK:" + value);
          if(row.key == value){
            return row.value;
          }
        }
        return value;
      }else{
        return value;
      }
    });
  }

}

interface IKeyValue{
  key:string,
  value:string
}
