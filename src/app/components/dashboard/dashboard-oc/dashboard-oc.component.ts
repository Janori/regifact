import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { PorderService } from '../../../services/porder.service';
import {MdDialog, MdDialogRef, MdDatepicker, MdDialogConfig } from '@angular/material';
import { DialogResultConfirmComponent } from '../../shared/dialog-result-confirm/dialog-result-confirm.component';
import { DialogResultOpenOrDownloadComponent } from '../../shared/dialog-result-open-or-download/dialog-result-open-or-download.component';

import { Data } from '../../../shared.data';

import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-dashboard-oc',
  templateUrl: './dashboard-oc.component.html',
  styleUrls: ['./dashboard-oc.component.css']
})
export class DashboardOcComponent implements OnInit {
  resultCount:number = 0;
  ocs:any[] = [];
  status:any[] = [];

  checkFecha:boolean = false;
  dateTo:Date = new Date();

  canUse(value:string){
    return Data.canUse(value);
  }


  params = {
    'from': 0,
    'to': 10,
    'query': '',
    'status': '',
  }

  isUser() : boolean{
    return Data.kind != "p";
  }

  constructor(private porderService:PorderService,
              private searchService:SearchService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private dialog:MdDialog) { }
              isNumeric(n: any) : n is number | string {
                  return !isNaN(parseFloat(n)) && isFinite(n);
              }
              intVal(n: number | string): number {
                  return typeof n === "number" ? n : parseInt(n, 10);
              }

  ngOnInit() {
    this.porderService.getStatus().subscribe(data =>{
      this.status = data.data;
      this.status.push({'status': 'Todos'});
    });
    this.activatedRoute.queryParams.subscribe(data=>{
      if(data && data.from && data.to && this.isNumeric(data.from) && this.isNumeric(data.to)){
        this.params.from = data.from;
        this.params.to = data.to;
      }
      if(data.query){
        this.params.query = data.query;
        this.searchService
        .search("porders", `from=${this.params.from}&count=${this.params.to}&invoice_number=${this.params.query}&porder_number=${this.params.query}&name=${this.params.query}&rfc=${this.params.query}&agent=${this.params.query}${(this.params.status == "") ? "" : "&status="+this.params.status  }`)
        .subscribe(data=>{
          this.ocs = data.data;
          this.resultCount = data.msg;
        }, error=>{
          alert(`Ocurrió un error en el servidor. ${error}`);
        });
      }else{
        this.params.query = '';
        if(Data.kind == 'p'){
          this.porderService.getProvPorders(this.params.from, this.params.to).subscribe(data=>{
            this.ocs = data.data;
            this.resultCount = data.msg;
          });
        }else{
          this.porderService.getPorders(this.params.from, this.params.to).subscribe(data=>{
            this.ocs = data.data;
            this.resultCount = data.msg;
          });
        }
      }
    });
  }

  buscar(value:string){
    var s = "";
    if(this.selectedValue != "Todos")
      s = this.selectedValue;
    this.router.navigate(['dashboard/oc'], {queryParams: {query: value, status: s}});
  }

  borrar(oc:any){
    this.openDialog(oc);
  }
  finalizar(oc:any){
    this.porderService.savePorder({ 'id': oc.id, 'status':'Finalizado'}, null, true)
    .subscribe(res=>{
      oc.status = 'Finalizado';
    }, error=>{
      console.log(error);
    });
  }

  setDate(date:string){
    date = date.replace(" ", "T");
    return new Date(date);
  }

  openDialog(oc:any) {
    let id = oc.id;
    let dialogRef = this.dialog.open(DialogResultConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.porderService.delete(id).subscribe(res=>{
          //window.location.reload();
          oc.status = "Cancelado";
          //this.ocs = this.ocs.filter(item => item !== oc);
        }, error=>{
          console.log(error);
        });
      }
    });
  }

  showFile(oc:any, isPDF:boolean){
    var path = isPDF ? oc.files.pdf_path : oc.files.xml_path;
    //var newTab = window.open('', '_blank');
    this.porderService.getPOCFile(path, isPDF).subscribe(file=>{
      let url = window.URL.createObjectURL(new Blob([file], {type: isPDF ? 'application/pdf' : 'application/xml'}));

      if(isPDF) oc.download_pdf_path = url;
      else oc.download_xml_path = url;
      this.openDialogDownloadOrOpen(oc, file, isPDF, false);
      //newTab.location.href = url;
      //window.open(url);
    })
  }

  showFileOC(oc:any){
    var path = oc.oc_path;
    if(path == null || path == ''){
      alert('No existe la orden de compra.');
      return;
    }
    //var newTab = window.open('', '_blank');
    this.porderService.getPOCFile(path, true).subscribe(file=>{
      let url = window.URL.createObjectURL(new Blob([file], {type: 'application/pdf' }));

      oc.oc_path = url;
      this.openDialogDownloadOrOpen(oc, file, true, true);
      //newTab.location.href = url;
      //window.open(url);
    })
  }

  openDialogDownloadOrOpen(oc:any, file:Blob, isPDF:boolean, oc_path:boolean) {
    let config: MdDialogConfig = {
      disableClose: false,
      width: '',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        oc: oc,
        file: file,
        isPDF: isPDF,
        oc_path: oc_path
      }
    };
    let dialogRef = this.dialog.open(DialogResultOpenOrDownloadComponent, config);
    /*dialogRef.afterClosed().subscribe(result => {
      switch(result){
        case 'download':
          FileSaver.saveAs(file, `file.${isPDF ? "pdf" : "xml"}`);
        break;
        case 'open':
          window.open(isPDF ? oc.download_pdf_path : oc.download_xml_path, '_blank');
        break;
        default:
        break;
      }
    });*/
  }

  selectedValue:string;
  statusChanged(){
    if(this.selectedValue != "Todos")
      this.params.status = this.selectedValue;
    else this.params.status = "";
    this.router.navigate(['dashboard/oc'], {queryParams: this.params });
  }
}
