import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { PorderService } from '../../../services/porder.service';
import {MdDialog, MdDialogRef, MdDatepicker, MdTooltip, MdDialogConfig } from '@angular/material';
import { DialogResultConfirmComponent } from '../../shared/dialog-result-confirm/dialog-result-confirm.component';
import { DialogResultOpenOrDownloadComponent } from '../../shared/dialog-result-open-or-download/dialog-result-open-or-download.component';
import { Data } from '../../../shared.data';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-dashboard-oc-providers',
  templateUrl: './dashboard-oc-providers.component.html',
  styleUrls: ['./dashboard-oc-providers.component.css']
})
export class DashboardOcProvidersComponent implements OnInit {
  @ViewChild('xmlInput') xmlEl:ElementRef;
  @ViewChild('pdfInput') pdfEl:ElementRef;

  resultCount:number = 0;
  ocs:any[] = [];

  pdfLoading = 0;
  xmlLoading = 0;

  params = {
    'from': 0,
    'to': 10,
    'query': ''
  }

  constructor(private porderService:PorderService,
              private searchService:SearchService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private rd:Renderer,
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
        .search("porders/prov", `from=${this.params.from}&count=${this.params.to}&invoice_number=${this.params.query}&porder_number=${this.params.query}&agent=${this.params.query}`)
        .subscribe(data=>{
          this.ocs = data.data;
          this.resultCount = data.msg;
        }, error=>{
          alert(`Ocurrió un error en el servidor. ${error}`);
        });
      }else{
        this.porderService.getProvPorders(this.params.from, this.params.to).subscribe(data=>{
          this.ocs = data.data;
          this.resultCount = data.msg;
        });
      }
    });
  }

  setDate(date:string){
    date = date.replace(" ", "T");
    return new Date(date);
  }

  buscar(value:string){
    this.router.navigate(['dashboard/oc'], {queryParams: {query: value}});
  }

  openXML(){
    this.rd.invokeElementMethod(this.xmlEl.nativeElement, 'click');
  }
  openPDF(){
    this.rd.invokeElementMethod(this.pdfEl.nativeElement, 'click');
  }


  saveXML(fileInput: any, oc:any){
    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let ext = file.name.split('.')[file.name.split('.').length - 1];
      if(ext.toLowerCase() == "xml"){
        let r = new FileReader();
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e=>{
          let txt = myReader.result;
          let rgxTotal = /(?:^|\s)Total\s*=\s*"(.*?)(?:"|$)/g;
          let rgxFolio = /(?:^|\s)Folio\s*=\s*"(.*?)(?:"|$)/g;
          let matchTot = rgxTotal.exec(txt);
          let matchFolio = rgxFolio.exec(txt);

          if(matchFolio.length>0){
            oc.invoice_number = matchFolio[1];
            this.updateInvoiceNumber(oc.id, oc.invoice_number);
          }
          if(matchTot.length > 0){
            let tot:number = +matchTot[1];
            if(oc.amount != tot){
              alert('El archivo XML no contiene el total solicitado en la OC');
            }else{
              this.xmlLoading += 1;
              this.porderService.savePOCFile(oc.id, file, false)
              .subscribe(data=>{
                if(data.status){
                  oc.files = data.data;
                }else{
                  console.log(data.msg);
                }
                this.xmlLoading -= 1;
              }, error=>{
                console.log(error);
              })
            }
          }else{
            alert('El archivo XML no es correcto.');
          }

        });
        myReader.readAsText(file);

      }else{
        alert('Sólo se permiten archivos XML');
      }
    }
  }
  savePDF(fileInput: any, oc:any){
    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let ext = file.name.split('.')[file.name.split('.').length - 1];
      if(ext.toLowerCase() == "pdf"){
        this.pdfLoading += 1;
        this.porderService.savePOCFile(oc.id, file, true)
        .subscribe(data=>{
          if(data.status){
            oc.files = data.data;
            console.log("saved");
          }else{
            console.log(data.msg, data.data);
          }
          this.pdfLoading -= 1;
        }, error=>{
          console.log(error);
        });
      }else{
        alert('Sólo se permiten archivos PDF');
      }
    }
  }

  showFile(oc:any, isPDF:boolean, isOC:boolean = false){
    var path = isPDF ? oc.files.pdf_path : oc.files.xml_path;
    if(isOC) path = oc.oc_path;
    //var newTab = window.open('', '_blank');
    this.porderService.getPOCFile(path, isPDF).subscribe(file=>{
      let url = window.URL.createObjectURL(new Blob([file], {type: isPDF ? 'application/pdf' : 'application/xml'}));

      if(isPDF) oc.download_pdf_path = url;
      else oc.download_xml_path = url;
      this.openDialogDownloadOrOpen(oc, file, isPDF);
      //newTab.location.href = url;
      //window.open(url);
    })
  }

  deletePDF(id:number, path:string){
    this.porderService.removePOCFile(id, path, true)
    .subscribe(data=>{
      console.log(data);
    },error=>{
      console.log(error);
    });
  }

  deleteXML(id:number, path:string){
    this.porderService.removePOCFile(id, path, false)
    .subscribe(data=>{
      console.log(data);
    },error=>{
      console.log(error);
    });
  }

  updateInvoiceNumber(id:number, invoice_number:string){
    let data = {
      'invoice_number': invoice_number,
      'id': id
    }
    this.porderService.savePorder(data, null, true).subscribe(data=>{
      //console.log(data);
    }, error=>{
      //console.log(error);
      alert('Ocurrió un error al actualizar el #Factura');
    });
  }

  openDialogDownloadOrOpen(oc:any, file:Blob, isPDF:boolean) {
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
        isPDF: isPDF
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
}
