import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { PorderService } from '../../../services/porder.service';
import {MdDialog, MdDialogRef, MdDatepicker } from '@angular/material';
import { DialogResultConfirmComponent } from '../../shared/dialog-result-confirm/dialog-result-confirm.component';
import { Data } from '../../../shared.data';

@Component({
  selector: 'app-dashboard-oc',
  templateUrl: './dashboard-oc.component.html',
  styleUrls: ['./dashboard-oc.component.css']
})
export class DashboardOcComponent implements OnInit {
  resultCount:number = 0;
  ocs:any[] = [];

  checkFecha:boolean = false;
  dateTo:Date = new Date();

  params = {
    'from': 0,
    'to': 10,
    'query': ''
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
    this.activatedRoute.queryParams.subscribe(data=>{
      if(data && data.from && data.to && this.isNumeric(data.from) && this.isNumeric(data.to)){
        this.params.from = data.from;
        this.params.to = data.to;
      }
      if(data.query){
        this.params.query = data.query;
        this.searchService
        .search("porders", `from=${this.params.from}&count=${this.params.to}&invoice_number=${this.params.query}&porder_number=${this.params.query}&name=${this.params.query}&rfc=${this.params.query}&agent=${this.params.query}`)
        .subscribe(data=>{
          this.ocs = data.data;
          this.resultCount = data.msg;
        }, error=>{
          alert(`Ocurrió un error en el servidor. ${error}`);
        });
      }else{
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

    this.router.navigate(['dashboard/oc'], {queryParams: {query: value}});
  }

  borrar(id:number){
    this.openDialog(id);
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

  openDialog(id:number) {
    let dialogRef = this.dialog.open(DialogResultConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.porderService.delete(id).subscribe(res=>{
          window.location.reload();
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
      console.log(url);
      oc.download_path = url;
      //newTab.location.href = url;
      //window.open(url);
    })
  }
}
