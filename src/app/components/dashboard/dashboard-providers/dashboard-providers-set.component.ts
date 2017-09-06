import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import { DialogResultCreateComponent } from '../../shared/dialog-result-create/dialog-result-create.component';
import { FormsModule, NgForm, NgModel,
         FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { UsersService } from '../../../services/users.service';


const EMAIL_REGEX = '^([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)?$';

@Component({
  selector: 'app-dashboard-providers-set',
  templateUrl: './dashboard-providers-set.component.html',
  styles: [`
      .input-style {
        margin-top: 20px;
        display: block;
        width: 300px;
      }
      .selector-style{
        margin-top: 30px;
      }
  `]
})
export class DashboardProvidersSetComponent implements OnInit {
  insertProperties:[string];
  updateProperties:[string];

  saving:boolean = false;

  isEditing:boolean = false;
  modelId:number = 0;

  form:FormGroup;
  kindSelected:string = "p";
  roleId:number = 3;
  defaultPassword:string = "********";
  defaultEmail:string = "";

  constructor(private activatedRoute:ActivatedRoute,
              private router:Router,
              private userService:UsersService,
              public dialog: MdDialog) {
        this.userService.getAllRoles().subscribe(data =>{
          this.roleId = data.filter(rol=>{
            return rol.code == "provider";
          }) | 3;
        });
        if(this.activatedRoute.snapshot.url.join('').indexOf("create") > 0){
          this.createForm();
        }else{
          this.isEditing = true;
          this.editForm();
          this.activatedRoute.params.subscribe(data=>{
            if(data.id){
              this.modelId = data.id;
              this.getModel(this.modelId);
            }
          });
        }
        this.form.controls['password_repeat'].markAsTouched();
        this.form.controls['password'].valueChanges.subscribe(value=>{
          this.form.controls['password_repeat'].updateValueAndValidity();
        });
  }


  save(form:FormGroup){
    if(!this.saving){
      if(this.isEditing){
        this.saveEdit(form);
      }else{
        this.saveInsert(form);
      }
    }
  }

  private saveInsert(form:FormGroup){
    if(form.valid){
      var obj:any = {}
      obj = {
        "username":form.controls['username'].value,
        "password":form.controls['password'].value,
        "email": form.controls['email'].value,
        "role_id":this.roleId,
        "kind": this.kindSelected,
        "name": form.controls['name'].value
      }
      this.saving = true;
      this.userService.createUser(obj).subscribe(ok=>{
        if(ok){
          this.openDialog();
        }else{
          alert('Ocurrió un error al modificar el usuario');
        }
        this.saving = false;
      },error=>{
        alert('Ocurrió un error con el servidor');
        this.saving = false;
      });
    }
  }

  private saveEdit(form:FormGroup){
    if(form.valid){
      var obj:any = {}
      if(form.controls['password'].value != this.defaultPassword){
        obj = {
          "password":form.controls['password'].value,
          "email":form.controls['email'].value,
          "name": form.controls['name'].value
        }
      }else{
        obj = {
          "email":form.controls['email'].value,
          "name": form.controls['name'].value
        }
      }
      this.saving = true;
      this.userService.updateUser(this.modelId, obj).subscribe(ok=>{
        if(ok){
          this.openDialog();
        }else{
          alert('Ocurrió un error al modificar el usuario');
        }
        this.saving = false;
      },error=>{
        alert('Ocurrió un error con el servidor');
        this.saving = false;
      });

    }
  }

  getModel(id:number){
    this.userService.getUser(id).subscribe(data =>{
      if(data == null || !data.status){
        this.router.navigate(['./dashboard/providers/create']);
      }else{
        this.defaultEmail = data.data.email;
        this.form.controls['username'].setValue(data.data.username);
        this.form.controls['email'].setValue(data.data.email);
        this.form.controls['name'].setValue(data.data.name);
        this.form.controls['password'].setValue(this.defaultPassword);
        this.form.controls['password_repeat'].setValue(this.defaultPassword);
      }
    }, error => {
      this.router.navigate(['./dashboard/providers']);
    })
  }

  ngOnInit() {
  }

  editForm(){
    this.form = new FormGroup({
      'username': new FormControl({value:'', disabled:true}),
      'email': new FormControl('',
        Validators.pattern(EMAIL_REGEX),
        this.checkEmail.bind(this)
      ),
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern("^([\\wÀ-ÿ\\s]+)$")
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern("^([a-zA-Z0-9.?!$#@_-]|[\\d*])+$"),
        this.checkEquals.bind(this)
      ]),
      'password_repeat': new FormControl('', [
        this.checkEquals.bind(this)
      ])
    });
  }
  createForm(){
    this.form = new FormGroup({
      'username': new FormControl('',
        Validators.required,
        this.checkUserName.bind(this)
      ),
      'email': new FormControl('',
        Validators.pattern(EMAIL_REGEX),
        this.checkEmail.bind(this)
      ),
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern("^([\\wÀ-ÿ\\s]+)$")
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern("^([a-zA-Z0-9.?!$#@_-]|[\\d*])+$"),
        this.checkEquals.bind(this)
      ]),
      'password_repeat': new FormControl('', [
        this.checkEquals.bind(this)
      ])
    });
    this.form.controls['username'].valueChanges.subscribe(value=>{
      this.form.controls['password'].setValue(value);
      this.form.controls['password_repeat'].setValue(value);
    });
  }

  checkEquals(control:FormControl): {[s:string]:boolean} {
    let form:any = this.form;
    if(form == null) return null;
    if(control.value != form.controls['password'].value){
      return { notEqual:true };
    }else return null;
  }

  checkUserName(control:FormControl): Promise<any>|Observable<any>{
    return this.userService.userExists(control.value, false, this.defaultEmail);
  }
  checkEmail(control:FormControl): Promise<any>|Observable<any>{
    return this.userService.userExists(control.value, true, this.defaultEmail);
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogResultCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      switch(result){
        case 'new':
          this.router.navigate(['./dashboard/providers/create']);
        break;
        case 'edit':
        this.router.navigate(['./dashboard/providers', 7, 'edit']);
        break;
        default:
          this.router.navigate(['./dashboard/providers']);
        break;
      }
    });
  }
}
