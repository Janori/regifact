import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, IKeyValue, IUser } from '../../../../services/users.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import { DialogResultCreateComponent } from '../../../shared/dialog-result-create/dialog-result-create.component';
import { FormsModule, NgForm, NgModel,
         FormGroup, FormControl, Validators } from '@angular/forms';
import { PorderService } from '../../../../services/porder.service';
import { Http, ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-dashboard-users-oc',
  templateUrl: './dashboard-users-oc.component.html',
  styleUrls: ['./dashboard-users-oc.component.css']
})
export class DashboardUsersOCComponent implements OnInit {
  @ViewChild('fInput') el:ElementRef;

  isEditing:boolean = false;
  userId:number = 0;
  ocId:number = 0;
  isMobile:boolean = false;
  user:any = {};
  oc:any = {};
  files:File[] = [];
  fileUrl:any = null;

  saving:boolean = false;

  form:FormGroup;

  constructor(private activatedRoute:ActivatedRoute,
              private porderService:PorderService,
              private router:Router,
              private userService:UsersService,
              public dialog: MdDialog,
              private rd:Renderer,
              private http:Http) { }

  ngOnInit() {
    this.isMobile = window.navigator.userAgent.toLowerCase().indexOf("mobile") >= 0;
    this.activatedRoute.params.subscribe(data => {
      this.userId = data.userId;
      this.getUserData();
      if(data.ocId){
        this.ocId = data.ocId;
        this.isEditing = true;
        this.getOCData();
      }
    },error=>{
      console.log("si");
      this.router.navigate(['./dashboard/providers']);
    });
    this.form = new FormGroup({
      'username': new FormControl({value:this.user.name, disabled:true}),
      'folio': new FormControl(this.oc.porder_number, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      'monto': new FormControl(this.oc.amount, [
        Validators.required,
        Validators.pattern('^([0-9]+)(\.[0-9]{1,4})?$')
      ]),
      'programmed_pay_date': new FormControl(this.oc.programmed_pay_date, [
        Validators.required,
        //Validators.pattern('^[]$')
      ])
    });
  }

  getUserData(){
    this.userService.getUser(this.userId).subscribe(data =>{
      if(data.data == null || !data.status){
        console.log("Error al obtener data" + data.msg);
        this.router.navigate(['./dashboard/providers']);
      }else{
        this.user = data.data;
        this.form.controls['username'].setValue(this.user.name);
      }
    }, error => {
      console.log("Error en userService" + error);
      this.router.navigate(['./dashboard/providers']);
    });

  }

  getOCData(){
    this.porderService.getPorder(this.ocId).subscribe(data=>{
      if(data.data == null || !data.status){
        console.log("Error en status OCData " + data.msg);
        this.router.navigate(['./dashboard/providers']);
      }else{
        this.oc = data.data;
        this.form.controls['monto'].setValue(this.oc.amount);
        this.form.controls['folio'].setValue(this.oc.porder_number);
        try{
          this.form.controls['programmed_pay_date'].setValue(this.oc.programmed_pay_date);
        }catch(e){}
        if(this.oc.oc_path){
          this.porderService.getFileUrl(this.ocId).subscribe(res=>{
            this.fileUrl = new Blob([res.blob()], { type:res.headers.get('content-type')});
          });
        }
      }
    }, error=>{
      console.log("Error en ocData " + error);
      this.router.navigate(['./dashboard/providers'])
    });

  }

  openFile(){
    this.rd.invokeElementMethod(this.el.nativeElement, 'click');
  }
  showFile(){
    if(this.files.length > 0){
      //console.log(this.files[0]);
      let url = window.URL.createObjectURL(new Blob([this.files[0]], {type: this.files[0].type}));
      window.open(url);
    }else if(this.fileUrl){
      let url = window.URL.createObjectURL(this.fileUrl);
      window.open(url);
    }else if(!this.fileUrl){
      alert('El archivo ya no existe.');
    }
  }

  saveFile(fileInput: any){
    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let ext = file.name.split('.')[file.name.split('.').length - 1];
      if(ext.toLowerCase() == "pdf"){
        this.files = [file];
      }else{
        alert('Sólo se permiten archivos PDF');
      }
    }
  }

  onFilesChange(fileList : File[]){
    if(fileList.length == 0){
      alert('Sólo se permiten archivos PDF');
    }else{
      this.files = fileList;
    }
  }

  pad(num:number, size:number): string {
      let s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  }

  save(form:FormGroup){
    if(!form.valid){
      alert("Ocurrió un error al guardar los datos.");
      return;
    }
    let file = this.files.length > 0 ? this.files[0] : null;

    let d = <Date>form.controls['programmed_pay_date'].value;
    let ppd = d.getFullYear().toString() + '-' +
              this.pad(d.getMonth() + 1, 2).toString() + '-' +
              this.pad(d.getDay() + 1, 2).toString() + 'T12:00:00';


    var data = {
      'provider_id': this.userId,
      'porder_number': form.controls['folio'].value,
      'amount': form.controls['monto'].value,
      'programmed_pay_date': ppd
    }

    this.saving = true;
    if(this.isEditing){
      data['id'] = this.ocId;
    }
    this.porderService.savePorder(data, file, this.isEditing).subscribe(data=>{
        if(data.status){
          this.ocId = data.data.id;
          this.openDialog();
        }else{
          console.log(data.msg, data.data);
        }
        this.saving = false;
    }, error=>{
      this.saving = false;
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogResultCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      switch(result){
        case 'new':
          this.router.navigate(['./dashboard/providers', this.userId, 'add-oc']);
        break;
        case 'edit': //providers/:userId/edit-oc/:ocId
          this.router.navigate(['./dashboard/providers', this.userId, 'edit-oc', this.ocId]);
        break;
        default:
          if(this.isEditing) this.router.navigate(['./dashboard/oc']);
          else this.router.navigate(['./dashboard/providers']);
        break;
      }
    });
  }


}
