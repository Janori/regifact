import { Injectable } from '@angular/core';
import { Http, Headers,ResponseContentType } from '@angular/http';
import { ConstService } from './const.service';
import 'rxjs/add/operator/map';

@Injectable()
export class PorderService {
  private url = "porders"
  private url4Provs = "search/porders/prov"
  private downloadUrl = "download/porders/"
  private pocUrl = "download/ifiles"
  private urlInvFile = "ifiles"

  constructor(private http:Http) { }

  getPorders(from:number = 0, to:number = 10){
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
  getPorder(id:number){
      let url = ConstService.mainUrl + this.url + `/${id}`;
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

  getProvPorders(from:number = 0, to:number=10){
    let url = ConstService.mainUrl + this.url4Provs + `?from=${from}&count=${to}`;
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

  savePorder(data:any, file:File, isEditing:boolean){
    let url = ConstService.mainUrl + this.url;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    let formData:FormData = new FormData();
    if(!isEditing){
      formData.append('provider_id', data.provider_id);
    }
    if(data.invoice_number){
      formData.append('invoice_number', data.invoice_number);
    }
    if(data.porder_number)
      formData.append('porder_number', data.porder_number);
    if(data.amount)
      formData.append('amount', data.amount);
    if(data.status)
      formData.append('status', data.status);

    if(file)
      formData.append('oc_file', file, file.name);
    if(isEditing){
      return this.http.post(url + '/edit/' + data.id, formData, {headers})
      .map(res=>{
        return res.json();
      }, error=>{
        console.log(error);
      });
    }else{
      return this.http.post(url, formData, {headers})
      .map(res=>{
        return res.json();
      }, error=>{
        console.log(error);
      });
    }



  }

  delete(id:number){
    let url = `${ConstService.mainUrl}${this.url}/${id}`;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));
    return this.http.delete(url, { headers })
    .map(res=>{
      return res.json();
    }, error=>{
      console.log(error);
    });
  }

  getFileUrl(id:number){
    //return `ftp://portal%40bymssa.mx:P455w0rd@bymssa.mx/${url}`
    let url = ConstService.mainUrl + this.downloadUrl + `${id}`;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));
    return this.http.get(url,
                   { headers: headers,
                     responseType: ResponseContentType.ArrayBuffer
                   })
    .map((res) => {
      /*console.log(res);
      console.log(res.headers);

      console.log(res.headers.get('content-type'));*/
      //return `ftp://portal%40bymssa.mx:P455w0rd@bymssa.mx/`
      return new Blob([res.blob()], { type:res.headers.get('content-type')});
    },error=>{
      console.log(error);
    });
  }

  getPOCFile(path:string, getPDF:boolean){
    let url = ConstService.mainUrl + this.pocUrl;
    console.log(url + " - " + path);
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));
    return this.http.post(url, {'path':path},
                   { headers: headers,
                     responseType: ResponseContentType.ArrayBuffer
                   })
    .map((res) => {
      return new Blob([res.blob()], { type:getPDF ? 'application/pdf' : 'application/xml'});
    },error=>{
      console.log(error);
    });

  }

  savePOCFile(idPorder:number, file:File, isPDF:boolean){
    let url = ConstService.mainUrl + this.urlInvFile;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    let formData:FormData = new FormData();
    formData.append('porder_id', ''+idPorder);
    if(file)
      formData.append(isPDF ? 'pdf_file' : 'xml_file', file, file.name);
    return this.http.post(url, formData, {headers})
      .map(res=>{
      return res.json();
    }, error=>{
      console.log(error);
    });
  }

  removePOCFile(id:number, path:string, isPDF:boolean){
    let url = ConstService.mainUrl + this.urlInvFile + `/${id}`;
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem('auth_token'));

    return this.http.put(url,
      {'path':path, 'type':isPDF?'pdf':'xml'}, {headers})
      .map(res=>{
      return res.json();
    }, error=>{
      console.log(error);
    });
  }

}
