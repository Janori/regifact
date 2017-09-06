import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute,
         RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Data } from '../shared.data';

@Injectable()
export class AccessGuardService {

  constructor(private auth:AuthService,
              private activatedRoute:ActivatedRoute,
              private router:Router) {
  }


  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    if(!Data.access || JSON.stringify(Data.access) === JSON.stringify({})){
      //console.log(localStorage.getItem('access'));
      Data.access = JSON.parse(localStorage.getItem('access'));
    }
    if(!Data.kind || Data.kind === '')
      Data.kind = localStorage.getItem('uk');

    Data.kind = Data.kind.toLowerCase();


    var re = /(\w+)[0-9]+(\w+)/;
    let url = next.url.join('').replace(re, "$1$2");
    if(url == "home") return true;
    //console.log(url);
    for(let a of Data.access){
       if(url.indexOf(a.description) > -1 &&
            (url.length - a.description.length < 3)){
          //console.log(url, a.description);
         return true;
       }
    }
    alert('Tu usuario no tiene acceso a esta sección');

    this.router.navigate(['./dashboard']);
    return false;
  }

}
