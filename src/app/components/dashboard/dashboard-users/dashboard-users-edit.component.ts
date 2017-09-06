import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import { DialogResultCreateComponent } from '../../shared/dialog-result-create/dialog-result-create.component';
import { FormsModule, NgForm, NgModel,
         FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { UsersService, IKeyValue, IUser } from '../../../services/users.service';

const EMAIL_REGEX = '^([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)?$';

@Component({
  selector: 'app-dashboard-users-edit',
  templateUrl: './dashboard-users-edit.component.html',
  styles: [`
    input:-moz-read-only { /* For Firefox */
      cursor:not-allowed;
    }
    input:read-only {
      cursor:not-allowed;
    }
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
export class DashboardUsersEditComponent implements OnInit {

  private id:number;
  private defaultPassword:string = "*********";

  forma:FormGroup;
  roles:IKeyValue[] = [];
  rolSelected:number = 1;

  kindSelected:string = "u";
  defaultEmail:string = "";

  saving:boolean = false;

  constructor(private userService:UsersService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              public dialog: MdDialog) {
    this.forma = new FormGroup({
      'username': new FormControl(''),
      'email': new FormControl('',
        Validators.pattern(EMAIL_REGEX),
        this.checkEmail.bind(this)
      ),
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern("^([\\wÀ-ÿ]+)(\\s[\\wÀ-ÿ]+){1,3}$")
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern("^([a-zA-Z0-9.?!$#@_-]|[\\d*])+$")
      ]),
      'password_repeat': new FormControl('', [
        this.checkEquals.bind(this)
      ]),
      'role_id': new FormControl(this.kindSelected, Validators.required)
    });
    this.forma.controls['password_repeat'].markAsTouched();
    this.forma.controls['password'].valueChanges.subscribe(value=>{
      this.forma.controls['password_repeat'].updateValueAndValidity();
    });

    this.activatedRoute.params.subscribe(data => {
      this.id = data.id;
      this.fillForm(this.id);
    });
  }
  ngOnInit() {
    this.userService.getAllRoles().subscribe(data =>{
      this.roles = data.filter(rol=>{
        return rol.code != "provider";
      });
    });
  }

  fillForm(id:number){
    this.userService.getUser(id).subscribe(data =>{
      console.log(data);
      if(data.data == null || !data.status){
        this.router.navigate(['./dashboard/users']);
      }else{
        this.defaultEmail = data.data.email;
        this.forma.controls['username'].setValue(data.data.username);
        this.forma.controls['email'].setValue(data.data.email);
        this.forma.controls['name'].setValue(data.data.name);
        this.forma.controls['password'].setValue(this.defaultPassword);
        this.forma.controls['password_repeat'].setValue(this.defaultPassword);
        this.forma.controls['role_id'].setValue(data.data.role_id);
      }
    }, error => {
      this.router.navigate(['./dashboard/users']);
    });
  }

  save(form:FormGroup){
    if(form.valid){
      var obj:any = {}
      if(form.controls['password'].value != this.defaultPassword){
        obj = {
          "password":form.controls['password'].value,
          "email":form.controls['email'].value,
          "role_id":form.controls['role_id'].value,
          "name": form.controls['name'].value
        }
      }else{
        obj = {
          "email":form.controls['email'].value,
          "role_id":form.controls['role_id'].value,
          "name": form.controls['name'].value
        }
      }
      this.saving = true;
      this.userService.updateUser(this.id, obj).subscribe(ok=>{
        if(ok){
          this.openDialog();
        }else{
          alert('Ocurrió un error al modificar el usuario');
        }
        this.saving = false;
      },error=>{
        this.saving = false;
      })

    }
  }

  checkEquals(control:FormControl): {[s:string]:boolean} {
    let forma:any = this.forma;
    if(forma == null) return null;
    if(control.value != forma.controls['password'].value){
      return { notEqual:true };
    }else return null;
  }

  checkUserName(control:FormControl): Promise<any>|Observable<any>{
    return this.userService.userExists(control.value, false);
  }
  checkEmail(control:FormControl): Promise<any>|Observable<any>{
    return this.userService.userExists(control.value, true, this.defaultEmail);
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogResultCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      switch(result){
        case 'new':
          this.router.navigate(['./dashboard/users/create']);
        break;
        case 'edit':
        this.router.navigate(['./dashboard/users', this.id, 'edit']);
        break;
        default:
          this.router.navigate(['./dashboard/users']);
        break;
      }
    });
  }

}
