import { Component, OnInit, Input, Inject } from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import { Data } from '../../../shared.data';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-dialog-result-open-or-download',
  templateUrl: './dialog-result-open-or-download.component.html',
  styleUrls: ['./dialog-result-open-or-download.component.css']
})
export class DialogResultOpenOrDownloadComponent implements OnInit {
  oc:any;
  file:Blob;
  isPDF:boolean;


  download(){
    FileSaver.saveAs(this.file, `file.${this.isPDF ? "pdf" : "xml"}`);
  }


  constructor(
      @Inject(MD_DIALOG_DATA) public data: any
  ) {
    this.oc = data.oc;
    this.file = data.file;
    this.isPDF = data.isPDF;
  }


  ngOnInit() {
  }

}
